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
        definitions: {
          orderBy: { order: "asc" },
          include: { tradition: true, school: true },
        },
        traditionViews: {
          orderBy: { order: "asc" },
          include: { tradition: true, school: true },
        },
        misconceptions: {
          orderBy: { order: "asc" },
        },
        practices: {
          orderBy: { order: "asc" },
        },
        evolutionNotes: {
          orderBy: { order: "asc" },
        },
        semanticNeighbors: {
          orderBy: { weight: "desc" },
          include: { relatedConcept: true },
        },
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
        definitions:
          concept.definitions.length > 0
            ? concept.definitions.map((definition) => ({
                title: definition.title,
                definition: definition.definition,
                context: definition.context,
                tradition: definition.tradition?.name,
                school: definition.school?.name,
                sourceLabel: definition.sourceLabel ?? undefined,
              }))
            : fallback?.definitions,
        traditionViews:
          concept.traditionViews.length > 0
            ? concept.traditionViews.map((view) => ({
                title: view.title,
                positionSummary: view.positionSummary,
                nuance: view.nuance,
                tradition: view.tradition?.name,
                school: view.school?.name,
                differsFrom: view.differsFrom ?? undefined,
              }))
            : fallback?.traditionViews,
        misconceptions:
          concept.misconceptions.length > 0
            ? concept.misconceptions.map((item) => ({
                title: item.title,
                correction: item.correction,
                whyItMatters: item.whyItMatters,
              }))
            : fallback?.misconceptions,
        practices:
          concept.practices.length > 0
            ? concept.practices.map((item) => ({
                title: item.title,
                description: item.description,
                caution: item.caution ?? undefined,
              }))
            : fallback?.practices,
        historicalEvolution:
          concept.evolutionNotes.length > 0
            ? concept.evolutionNotes.map((item) => ({
                period: item.period,
                description: item.description,
              }))
            : fallback?.historicalEvolution,
        semanticNeighbors:
          concept.semanticNeighbors.length > 0
            ? concept.semanticNeighbors.map((neighbor) => ({
                label: neighbor.relatedConcept?.name ?? neighbor.label,
                relationshipType: neighbor.relationshipType,
                explanation: neighbor.explanation,
                href: neighbor.relatedConcept ? `/concepts/${neighbor.relatedConcept.slug}` : undefined,
                caution: neighbor.caution ?? undefined,
              }))
            : fallback?.semanticNeighbors,
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
