import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { adminMetrics as staticMetrics, auditEntries as staticAuditEntries, reviewQueue as staticReviewQueue } from "@/lib/content/admin";

export const getAdminDashboard = cache(async () => {
  if (!env.DATABASE_URL) {
    return {
      metrics: staticMetrics,
      reviewQueue: staticReviewQueue,
      auditEntries: staticAuditEntries,
    };
  }

  try {
    const [drafts, inReview, verified, disputed, commentaryReview, citationReview, relationshipReview, reviews, audits] = await Promise.all([
      prisma.verse.count({ where: { verificationStatus: "DRAFT" } }),
      prisma.verse.count({ where: { verificationStatus: "REVIEW" } }),
      prisma.verse.count({ where: { verificationStatus: "VERIFIED" } }),
      prisma.verse.count({ where: { verificationStatus: "DISPUTED" } }),
      prisma.commentary.count({ where: { verificationStatus: "REVIEW" } }),
      prisma.citation.count({ where: { verificationStatus: "REVIEW" } }),
      prisma.scriptureRelationship.count({ where: { verificationStatus: "REVIEW" } }),
      prisma.contentReview.findMany({
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { actor: true },
      }),
    ]);

    return {
      metrics: [
        { label: "Draft verses", value: String(drafts), detail: "Verse records not yet submitted for review.", status: "DRAFT" as const },
        { label: "In review", value: String(inReview), detail: "Verse records awaiting verification decisions.", status: "REVIEW" as const },
        { label: "Verified", value: String(verified), detail: "Verse records approved with reviewer confidence.", status: "VERIFIED" as const },
        {
          label: "Wisdom review",
          value: String(commentaryReview + citationReview + relationshipReview),
          detail: `${disputed} disputed verse records; commentaries, citations, and cross-scripture relationships awaiting verification.`,
          status: "REVIEW" as const,
        },
      ],
      reviewQueue:
        reviews.length > 0
          ? reviews.map((review) => ({
              id: review.id,
              entityType: review.entityType,
              title: `${review.entityType.toLowerCase()} review`,
              status: review.status,
              confidenceLevel: review.confidenceLevel,
              summary: review.decisionNotes ?? review.sourceNotes ?? "Awaiting reviewer notes.",
              sourceCount: 0,
              updatedAt: review.updatedAt.toISOString().slice(0, 10),
              href: "/admin/review",
            }))
          : staticReviewQueue,
      auditEntries:
        audits.length > 0
          ? audits.map((audit) => ({
              id: audit.id,
              action: audit.action,
              actor: audit.actor?.name ?? audit.actor?.email ?? "System",
              entity: audit.entityType,
              message: audit.message,
              createdAt: audit.createdAt.toISOString(),
            }))
          : staticAuditEntries,
    };
  } catch {
    return {
      metrics: staticMetrics,
      reviewQueue: staticReviewQueue,
      auditEntries: staticAuditEntries,
    };
  }
});
