"use server";

import { prisma } from "@/lib/db/prisma";
import { requireEditorAccess } from "@/lib/auth/rbac";
import { bookEditorSchema, sourceEditorSchema } from "@/lib/validation/content";

export type EditorState = {
  ok: boolean;
  message: string;
};

export async function saveEditorDraft(_state: EditorState, formData: FormData): Promise<EditorState> {
  const editor = await requireEditorAccess();
  const mode = String(formData.get("mode") ?? "");

  if (mode === "book") {
    const parsed = bookEditorSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return { ok: false, message: "Book draft did not pass validation." };
    }

    await prisma.$transaction(async (tx) => {
      const book = await tx.book.upsert({
        where: { slug: parsed.data.slug },
        update: {
          title: parsed.data.title,
          tradition: parsed.data.tradition,
          summary: parsed.data.summary,
          difficulty: parsed.data.difficulty,
          verificationStatus: parsed.data.verificationStatus,
          confidenceLevel: parsed.data.confidenceLevel,
          interpretationLabel: parsed.data.interpretationLabel,
          reviewNotes: parsed.data.reviewNotes,
        },
        create: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          tradition: parsed.data.tradition,
          summary: parsed.data.summary,
          beginnerSummary: parsed.data.summary,
          difficulty: parsed.data.difficulty,
          verificationStatus: parsed.data.verificationStatus,
          confidenceLevel: parsed.data.confidenceLevel,
          interpretationLabel: parsed.data.interpretationLabel,
          reviewNotes: parsed.data.reviewNotes,
          status: "DRAFT",
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: editor.id,
          action: "UPDATED",
          entityType: "BOOK",
          entityId: book.id,
          message: "Book draft saved through validated editor action.",
        },
      });
    });

    return { ok: true, message: "Book draft saved." };
  }

  if (mode === "source") {
    const parsed = sourceEditorSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return { ok: false, message: "Source draft did not pass validation." };
    }

    await prisma.$transaction(async (tx) => {
      const source = await tx.source.upsert({
        where: { slug: slugFromTitle(parsed.data.title) },
        update: {
          title: parsed.data.title,
          author: parsed.data.author,
          sourceType: parsed.data.sourceType,
          citation: parsed.data.citation,
          url: parsed.data.url,
          verificationStatus: parsed.data.verificationStatus,
          confidenceLevel: parsed.data.confidenceLevel,
          reviewNotes: parsed.data.reviewNotes,
        },
        create: {
          slug: slugFromTitle(parsed.data.title),
          title: parsed.data.title,
          author: parsed.data.author,
          sourceType: parsed.data.sourceType,
          citation: parsed.data.citation,
          url: parsed.data.url,
          verificationStatus: parsed.data.verificationStatus,
          confidenceLevel: parsed.data.confidenceLevel,
          reviewNotes: parsed.data.reviewNotes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: editor.id,
          action: "UPDATED",
          entityType: "SOURCE",
          entityId: source.id,
          message: "Source draft saved through validated editor action.",
        },
      });
    });

    return { ok: true, message: "Source draft saved." };
  }

  return {
    ok: false,
    message: "This editor mode is not connected to a mutation yet.",
  };
}

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}
