import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { conceptProfiles, getConceptProfile as getStaticConceptProfile } from "@/lib/content/knowledge-graph";
import type { ConceptProfile } from "@/types/knowledge";

export const getConceptProfiles = cache(async (): Promise<ConceptProfile[]> => {
  if (!env.DATABASE_URL) {
    return conceptProfiles;
  }

  try {
    const concepts = await prisma.concept.findMany({
      orderBy: { name: "asc" },
      include: {
        relatedFrom: {
          include: { toConcept: true },
          orderBy: { weight: "desc" },
        },
        verses: {
          include: {
            verse: {
              include: {
                chapter: {
                  include: { book: true },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (concepts.length === 0) {
      return conceptProfiles;
    }

    return concepts.map((concept) => {
      const fallback = getStaticConceptProfile(concept.slug);

      return {
        slug: concept.slug,
        title: concept.name,
        category: concept.category,
        summary: concept.description,
        explanation: fallback?.explanation ?? concept.description,
        relatedConceptSlugs: concept.relatedFrom.map((relation) => relation.toConcept.slug),
        relatedBooks: fallback?.relatedBooks ?? [],
        relatedVerses: concept.verses.map(({ verse }) => ({
          label: `${verse.chapter.book.title} ${verse.chapter.number}.${verse.number}`,
          href: `/books/${verse.chapter.book.slug}/chapters/${verse.chapter.number}/verses/${verse.number}`,
          note: verse.practicalApplication,
        })),
        relatedPhilosophies: fallback?.relatedPhilosophies ?? [],
        parallels: fallback?.parallels ?? [],
        graphFocusNodeId: fallback?.graphFocusNodeId ?? concept.slug,
      };
    });
  } catch {
    return conceptProfiles;
  }
});

export const getConceptProfile = cache(async (slug: string): Promise<ConceptProfile | undefined> => {
  const concepts = await getConceptProfiles();
  return concepts.find((concept) => concept.slug === slug) ?? getStaticConceptProfile(slug);
});
