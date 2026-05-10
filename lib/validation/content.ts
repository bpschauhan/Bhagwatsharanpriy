import { z } from "zod";

export const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const positiveIntSchema = z.coerce.number().int().positive();

export const bookRouteParamsSchema = z.object({
  slug: slugSchema,
});

export const chapterRouteParamsSchema = bookRouteParamsSchema.extend({
  chapter: positiveIntSchema,
});

export const verseRouteParamsSchema = chapterRouteParamsSchema.extend({
  verse: positiveIntSchema,
});

export const conceptRouteParamsSchema = z.object({
  slug: slugSchema,
});

export const searchParamsSchema = z.object({
  q: z.string().trim().max(200).optional().default(""),
});

export const verificationSchema = z.object({
  interpretationLabel: z.string().trim().max(160).optional(),
  reviewNotes: z.string().trim().max(4000).optional(),
  confidenceLevel: z.coerce.number().int().min(0).max(100),
  verificationStatus: z.enum(["DRAFT", "REVIEW", "VERIFIED", "DISPUTED", "ARCHIVED"]),
});

export const bookEditorSchema = verificationSchema.extend({
  title: z.string().trim().min(1).max(180),
  slug: slugSchema,
  tradition: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(4000),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export const sourceEditorSchema = verificationSchema.extend({
  title: z.string().trim().min(1).max(240),
  author: z.string().trim().max(180).optional(),
  sourceType: z.enum(["SCRIPTURE", "COMMENTARY", "TRANSLATION", "REFERENCE", "SCHOLARLY", "HISTORICAL", "MODERN_ANALYSIS"]),
  citation: z.string().trim().min(1).max(4000),
  url: z.string().trim().url().optional(),
});

export const reviewDecisionSchema = z.object({
  entityType: z.enum([
    "BOOK",
    "CHAPTER",
    "VERSE",
    "MEANING_LAYER",
    "CONCEPT",
    "COMMENTARY",
    "SOURCE",
    "KNOWLEDGE_NODE",
    "KNOWLEDGE_EDGE",
    "RELATED_CONCEPT",
  ]),
  entityId: z.string().cuid(),
  status: z.enum(["VERIFIED", "DISPUTED", "ARCHIVED"]),
  confidenceLevel: z.coerce.number().int().min(0).max(100),
  decisionNotes: z.string().trim().max(4000).optional(),
});
