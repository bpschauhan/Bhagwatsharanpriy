"use server";

import type { ContentEntityType, Prisma, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireReviewerAccess } from "@/lib/auth/rbac";
import { reviewDecisionSchema } from "@/lib/validation/content";

export type ReviewActionState = {
  ok: boolean;
  message: string;
};

const reviewableModels = {
  BOOK: "book",
  CHAPTER: "chapter",
  VERSE: "verse",
  MEANING_LAYER: "meaningLayer",
  CONCEPT: "concept",
  COMMENTARY: "commentary",
  SOURCE: "source",
  KNOWLEDGE_NODE: "knowledgeNode",
  KNOWLEDGE_EDGE: "knowledgeEdge",
  RELATED_CONCEPT: "relatedConcept",
} as const satisfies Record<ContentEntityType, string>;

export async function recordReviewDecision(_state: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  const reviewer = await requireReviewerAccess();
  const parsed = reviewDecisionSchema.safeParse({
    entityType: formData.get("entityType"),
    entityId: formData.get("entityId"),
    status: formData.get("status"),
    confidenceLevel: formData.get("confidenceLevel"),
    decisionNotes: formData.get("decisionNotes"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Review decision could not be validated.",
    };
  }

  const { entityType, entityId, status, confidenceLevel, decisionNotes } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await createRevisionSnapshot(tx, entityType, entityId, reviewer.id, decisionNotes);
    await updateVerification(tx, entityType, entityId, status, confidenceLevel, reviewer.id, decisionNotes);
    await tx.contentReview.create({
      data: {
        entityType,
        entityId,
        status,
        confidenceLevel,
        reviewerId: reviewer.id,
        decisionNotes,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: reviewer.id,
        action: status === "VERIFIED" ? "APPROVED" : status === "DISPUTED" ? "DISPUTED" : "ARCHIVED",
        entityType,
        entityId,
        message: `Review decision recorded: ${status.toLowerCase()}.`,
        metadata: { confidenceLevel, decisionNotes },
      },
    });
  });

  return {
    ok: true,
    message: "Review decision recorded with revision and audit history.",
  };
}

async function createRevisionSnapshot(
  tx: Prisma.TransactionClient,
  entityType: ContentEntityType,
  entityId: string,
  authorId: string,
  changeNote?: string,
) {
  const model = reviewableModels[entityType];
  const delegate = tx[model as keyof Prisma.TransactionClient] as unknown as {
    findUnique: (args: { where: { id: string } }) => Promise<unknown>;
  };
  const snapshot = await delegate.findUnique({ where: { id: entityId } });

  if (!snapshot) {
    throw new Error(`Cannot review missing ${entityType.toLowerCase()} entity.`);
  }

  const latest = await tx.revision.findFirst({
    where: { entityType, entityId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  await tx.revision.create({
    data: {
      entityType,
      entityId,
      version: (latest?.version ?? 0) + 1,
      title: `${entityType} review snapshot`,
      summary: changeNote,
      snapshot: snapshot as Prisma.InputJsonValue,
      changeNote,
      authorId,
    },
  });
}

async function updateVerification(
  tx: Prisma.TransactionClient,
  entityType: ContentEntityType,
  entityId: string,
  status: VerificationStatus,
  confidenceLevel: number,
  reviewerId: string,
  reviewNotes?: string,
) {
  const model = reviewableModels[entityType];
  const delegate = tx[model as keyof Prisma.TransactionClient] as unknown as {
    update: (args: {
      where: { id: string };
      data: {
        verificationStatus: VerificationStatus;
        confidenceLevel: number;
        reviewedById: string;
        reviewedAt: Date;
        reviewNotes?: string;
      };
    }) => Promise<unknown>;
  };

  await delegate.update({
    where: { id: entityId },
    data: {
      verificationStatus: status,
      confidenceLevel,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      reviewNotes,
    },
  });
}
