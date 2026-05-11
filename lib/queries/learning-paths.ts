import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { getLearningPath as getStaticLearningPath, learningPaths as staticLearningPaths } from "@/lib/content/learning-paths";
import type { LearningPathContent } from "@/types/learning";

export const getLearningPaths = cache(async (): Promise<LearningPathContent[]> => {
  if (!env.DATABASE_URL) {
    return staticLearningPaths;
  }

  try {
    const paths = await prisma.learningPath.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ difficulty: "asc" }, { title: "asc" }],
      include: {
        tradition: true,
        school: true,
        steps: {
          orderBy: { order: "asc" },
          include: {
            verse: {
              include: {
                chapter: { include: { book: true } },
              },
            },
            concept: true,
          },
        },
      },
    });

    if (paths.length === 0) {
      return staticLearningPaths;
    }

    return paths.map((path) => ({
      slug: path.slug,
      title: path.title,
      summary: path.summary,
      kind: path.kind,
      difficulty: path.difficulty,
      tradition: path.tradition?.name,
      school: path.school?.name,
      guidanceNote: path.guidanceNote ?? undefined,
      steps: path.steps.map((step) => {
        const verseHref = step.verse
          ? `/books/${step.verse.chapter.book.slug}/chapters/${step.verse.chapter.number}/verses/${step.verse.number}`
          : undefined;
        const conceptHref = step.concept ? `/concepts/${step.concept.slug}` : undefined;

        return {
          kind: step.kind,
          title: step.title,
          summary: step.summary,
          contemplationPrompt: step.contemplationPrompt ?? undefined,
          practiceNote: step.practiceNote ?? undefined,
          href: verseHref ?? conceptHref,
          verseLabel: step.verse
            ? `${step.verse.chapter.book.title} ${step.verse.chapter.number}.${step.verse.number}`
            : undefined,
          conceptSlug: step.concept?.slug,
        };
      }),
    }));
  } catch {
    return staticLearningPaths;
  }
});

export const getLearningPath = cache(async (slug: string): Promise<LearningPathContent | undefined> => {
  const paths = await getLearningPaths();
  return paths.find((path) => path.slug === slug) ?? getStaticLearningPath(slug);
});
