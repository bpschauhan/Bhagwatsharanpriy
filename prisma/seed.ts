import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { bhagavadGita } from "../lib/content/gita";
import { conceptProfiles, knowledgeEdges, knowledgeNodes } from "../lib/content/knowledge-graph";
import { learningPaths } from "../lib/content/learning-paths";
import { env } from "../lib/env";

const prisma = new PrismaClient();

async function main() {
  if (env.INITIAL_ADMIN_EMAIL && env.INITIAL_ADMIN_PASSWORD) {
    await prisma.user.upsert({
      where: { email: env.INITIAL_ADMIN_EMAIL.toLowerCase() },
      update: {
        name: env.INITIAL_ADMIN_NAME ?? "Bhagwatsharanpriy Admin",
        role: "ADMIN",
        active: true,
      },
      create: {
        email: env.INITIAL_ADMIN_EMAIL.toLowerCase(),
        name: env.INITIAL_ADMIN_NAME ?? "Bhagwatsharanpriy Admin",
        passwordHash: await hash(env.INITIAL_ADMIN_PASSWORD, 12),
        role: "ADMIN",
        active: true,
      },
    });
  }

  await prisma.userLearningProgress.deleteMany();
  await prisma.learningPathStep.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.citation.deleteMany();
  await prisma.conceptSemanticNeighbor.deleteMany();
  await prisma.conceptEvolution.deleteMany();
  await prisma.conceptPractice.deleteMany();
  await prisma.conceptMisconception.deleteMany();
  await prisma.conceptTraditionView.deleteMany();
  await prisma.conceptDefinition.deleteMany();
  await prisma.scriptureRelationship.deleteMany();
  await prisma.canonicalReference.deleteMany();
  await prisma.commentaryLayer.deleteMany();
  await prisma.knowledgeEdge.deleteMany();
  await prisma.knowledgeNode.deleteMany();
  await prisma.relatedConcept.deleteMany();
  await prisma.philosophySchool.deleteMany();
  await prisma.tradition.deleteMany();
  await prisma.verseSource.deleteMany();
  await prisma.verseConcept.deleteMany();
  await prisma.commentary.deleteMany();
  await prisma.meaningLayer.deleteMany();
  await prisma.verse.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.book.deleteMany({ where: { slug: bhagavadGita.slug } });
  const seedConcepts = new Map(
    [
      ...bhagavadGita.concepts.map((concept) => [concept.slug, concept] as const),
      ...conceptProfiles.map((concept) => [
        concept.slug,
        {
          slug: concept.slug,
          name: concept.title,
          category: concept.category,
          description: concept.summary,
        },
      ] as const),
    ].reverse(),
  );

  await prisma.concept.deleteMany({
    where: {
      slug: {
        in: Array.from(seedConcepts.keys()),
      },
    },
  });
  await prisma.source.deleteMany({
    where: {
      slug: {
        in: bhagavadGita.sources.map((source) => source.slug),
      },
    },
  });

  const sourceBySlug = new Map(
    await Promise.all(
      bhagavadGita.sources.map(async (source) => {
        const created = await prisma.source.create({
          data: source,
        });

        return [source.slug, created.id] as const;
      }),
    ),
  );

  const conceptBySlug = new Map(
    await Promise.all(
      Array.from(seedConcepts.values()).map(async (concept) => {
        const created = await prisma.concept.create({
          data: concept,
        });

        return [concept.slug, created.id] as const;
      }),
    ),
  );

  const sanatanaTradition = await prisma.tradition.create({
    data: {
      slug: "sanatana-dharma",
      name: "Sanatana Dharma",
      summary: "A broad wisdom tradition containing many scriptures, schools, practices, and interpretive lineages.",
    },
  });

  const schoolBySlug = new Map<string, string>(
    await Promise.all(
      knowledgeNodes
        .filter((node) => node.nodeType === "PHILOSOPHY_SCHOOL")
        .map(async (node) => {
          const school = await prisma.philosophySchool.create({
            data: {
              traditionId: sanatanaTradition.id,
              slug: node.slug,
              name: node.title,
              summary: node.summary,
            },
          });

          return [node.slug, school.id] as const;
        }),
    ),
  );
  const schoolByName = new Map<string, string>();

  for (const node of knowledgeNodes.filter((item) => item.nodeType === "PHILOSOPHY_SCHOOL")) {
    const schoolId = schoolBySlug.get(node.slug);

    if (!schoolId) {
      throw new Error(`Missing seeded philosophy school for ${node.slug}.`);
    }

    registerSchoolAliases(node.title, node.slug, schoolId, schoolByName);
  }

  const ensureSchoolId = async (schoolName?: string) => {
    if (!schoolName) {
      return undefined;
    }

    const key = schoolName.toLowerCase();
    const existingByName = schoolByName.get(key);

    if (existingByName) {
      return existingByName;
    }

    const slug = slugify(schoolName);
    const existingBySlug = schoolBySlug.get(slug);

    if (existingBySlug) {
      registerSchoolAliases(schoolName, slug, existingBySlug, schoolByName);
      return existingBySlug;
    }

    const vedantaShortSlug = slug.endsWith("-vedanta") ? slug.replace(/-vedanta$/, "") : undefined;
    const existingVedantaSchool = vedantaShortSlug ? schoolBySlug.get(vedantaShortSlug) : undefined;

    if (vedantaShortSlug && existingVedantaSchool) {
      registerSchoolAliases(schoolName, vedantaShortSlug, existingVedantaSchool, schoolByName);
      return existingVedantaSchool;
    }

    const created = await prisma.philosophySchool.create({
      data: {
        traditionId: sanatanaTradition.id,
        slug,
        name: schoolName,
        summary: `${schoolName} is referenced by seeded study, commentary, or relationship content.`,
      },
    });

    schoolBySlug.set(slug, created.id);
    registerSchoolAliases(schoolName, slug, created.id, schoolByName);
    return created.id;
  };

  const getSchoolId = (schoolName?: string) => {
    if (!schoolName) {
      return undefined;
    }

    const schoolId = schoolByName.get(schoolName.toLowerCase());

    if (!schoolId) {
      throw new Error(`Missing philosophy school "${schoolName}" after seed normalization.`);
    }

    return schoolId;
  };

  const schoolLabels = new Set<string>();
  for (const chapter of bhagavadGita.chapters) {
    for (const verse of chapter.verses) {
      verse.commentaries.forEach((commentary) => addOptional(schoolLabels, commentary.school));
      verse.relationships?.forEach((relationship) => addOptional(schoolLabels, relationship.school));
    }
  }
  conceptProfiles.forEach((profile) => {
    profile.definitions?.forEach((definition) => addOptional(schoolLabels, definition.school));
    profile.traditionViews?.forEach((view) => addOptional(schoolLabels, view.school));
  });
  knowledgeEdges.forEach((edge) => addOptional(schoolLabels, edge.school));
  learningPaths.forEach((path) => addOptional(schoolLabels, path.school));

  for (const schoolName of schoolLabels) {
    await ensureSchoolId(schoolName);
  }

  const book = await prisma.book.create({
    data: {
      slug: bhagavadGita.slug,
      title: bhagavadGita.title,
      subtitle: bhagavadGita.subtitle,
      tradition: bhagavadGita.tradition,
      difficulty: bhagavadGita.difficulty,
      summary: bhagavadGita.summary,
      beginnerSummary: bhagavadGita.beginnerSummary,
      chapters: {
        create: bhagavadGita.chapters.map((chapter) => ({
          number: chapter.number,
          slug: chapter.slug,
          title: chapter.title,
          summary: chapter.summary,
          overview: chapter.overview,
        })),
      },
    },
    include: {
      chapters: true,
    },
  });

  const chapterByNumber = new Map(book.chapters.map((chapter) => [chapter.number, chapter.id] as const));
  const verseByReference = new Map<string, string>();

  for (const chapter of bhagavadGita.chapters) {
    const chapterId = chapterByNumber.get(chapter.number);

    if (!chapterId) {
      throw new Error(`Missing chapter ${chapter.number} after seed create.`);
    }

    for (const verse of chapter.verses) {
      const createdVerse = await prisma.verse.create({
        data: {
          chapterId,
          number: verse.number,
          slug: verse.slug,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          wordByWord: verse.wordByWord,
          practicalApplication: verse.practicalApplication,
          philosophyInsight: verse.philosophyInsight,
          meaningLayers: {
            create: verse.meaningLayers.map((layer, index) => ({
              type: layer.type,
              title: layer.title,
              body: layer.body,
              order: index,
            })),
          },
        },
      });
      verseByReference.set(`${chapter.number}.${verse.number}`, createdVerse.id);

      await prisma.verseConcept.createMany({
        data: verse.conceptSlugs.map((slug, index) => {
          const conceptId = conceptBySlug.get(slug);

          if (!conceptId) {
            throw new Error(`Missing concept ${slug}.`);
          }

          return {
            verseId: createdVerse.id,
            conceptId,
            relevance: "Related concept for layered verse study.",
            order: index,
          };
        }),
      });

      await prisma.verseSource.createMany({
        data: verse.sourceSlugs.map((slug) => {
          const sourceId = sourceBySlug.get(slug);

          if (!sourceId) {
            throw new Error(`Missing source ${slug}.`);
          }

          return {
            verseId: createdVerse.id,
            sourceId,
            locator: `${chapter.number}.${verse.number}`,
            note: "Used to verify scripture text and verse reference.",
          };
        }),
      });

      for (const [index, commentary] of verse.commentaries.entries()) {
        const createdCommentary = await prisma.commentary.create({
          data: {
            verseId: createdVerse.id,
            sourceId: commentary.sourceSlug ? sourceBySlug.get(commentary.sourceSlug) : undefined,
            traditionId: sanatanaTradition.id,
            schoolId: getSchoolId(commentary.school),
            author: commentary.author,
            tradition: commentary.tradition,
            title: commentary.title,
            body: commentary.body,
            interpretationNote: commentary.interpretationNote,
            layerType: commentary.layerType ?? "PHILOSOPHICAL",
            language: commentary.language,
            historicalPeriod: commentary.historicalPeriod,
            sourceLocator: commentary.sourceLocator,
            attributionNote: commentary.attributionNote,
            order: index,
            layers: commentary.layers
              ? {
                  create: commentary.layers.map((layer, layerIndex) => ({
                    type: layer.type,
                    title: layer.title,
                    body: layer.body,
                    order: layerIndex,
                  })),
                }
              : undefined,
          },
        });

        if (commentary.sourceSlug) {
          await prisma.citation.create({
            data: {
              sourceId: sourceBySlug.get(commentary.sourceSlug),
              entityType: "COMMENTARY",
              entityId: createdCommentary.id,
              commentaryId: createdCommentary.id,
              role: "COMMENTARY",
              locator: commentary.sourceLocator ?? `${chapter.number}.${verse.number}`,
              contextNote: "Commentary attribution anchor for comparison view.",
              provenanceNote: commentary.attributionNote,
            },
          });
        }
      }

      for (const relationship of verse.relationships ?? []) {
        const sourceId = relationship.sourceSlug ? sourceBySlug.get(relationship.sourceSlug) : undefined;
        const reference = await prisma.canonicalReference.upsert({
          where: {
            slug: slugify(`${relationship.targetTextTitle}-${relationship.targetLocator ?? relationship.targetLabel}`),
          },
          update: {
            label: relationship.targetLabel,
            textTitle: relationship.targetTextTitle,
            locator: relationship.targetLocator,
            sourceId,
          },
          create: {
            slug: slugify(`${relationship.targetTextTitle}-${relationship.targetLocator ?? relationship.targetLabel}`),
            label: relationship.targetLabel,
            textTitle: relationship.targetTextTitle,
            locator: relationship.targetLocator,
            traditionId: sanatanaTradition.id,
            sourceId,
            note: "Canonical cross-scripture reference seeded for relationship review.",
          },
        });

        const createdRelationship = await prisma.scriptureRelationship.create({
          data: {
            verseId: createdVerse.id,
            targetReferenceId: reference.id,
            relationshipType: relationship.relationshipType,
            label: relationship.label,
            explanation: relationship.explanation,
            philosophicalContext: relationship.philosophicalContext,
            traditionId: sanatanaTradition.id,
            schoolId: getSchoolId(relationship.school),
            confidenceLevel: relationship.confidenceLevel ?? 0,
            sourceNotes: relationship.sourceSlug ? `Seeded from ${relationship.sourceSlug}.` : undefined,
            weight: 3,
          },
        });

        if (sourceId) {
          await prisma.citation.create({
            data: {
              sourceId,
              entityType: "SCRIPTURE_RELATIONSHIP",
              entityId: createdRelationship.id,
              verseId: createdVerse.id,
              canonicalReferenceId: reference.id,
              scriptureRelationshipId: createdRelationship.id,
              role: "CROSS_REFERENCE",
              locator: relationship.targetLocator,
              contextNote: relationship.explanation,
            },
          });
        }
      }
    }
  }

  for (const profile of conceptProfiles) {
    const conceptId = conceptBySlug.get(profile.slug);

    if (!conceptId) {
      continue;
    }

    await prisma.conceptDefinition.createMany({
      data:
        profile.definitions?.map((definition, index) => ({
          conceptId,
          traditionId: sanatanaTradition.id,
          schoolId: getSchoolId(definition.school),
          title: definition.title,
          definition: definition.definition,
          context: definition.context,
          sourceLabel: definition.sourceLabel,
          order: index,
        })) ?? [],
    });

    await prisma.conceptTraditionView.createMany({
      data:
        profile.traditionViews?.map((view, index) => ({
          conceptId,
          traditionId: sanatanaTradition.id,
          schoolId: getSchoolId(view.school),
          title: view.title,
          positionSummary: view.positionSummary,
          nuance: view.nuance,
          differsFrom: view.differsFrom,
          order: index,
        })) ?? [],
    });

    await prisma.conceptMisconception.createMany({
      data:
        profile.misconceptions?.map((item, index) => ({
          conceptId,
          title: item.title,
          correction: item.correction,
          whyItMatters: item.whyItMatters,
          order: index,
        })) ?? [],
    });

    await prisma.conceptPractice.createMany({
      data:
        profile.practices?.map((item, index) => ({
          conceptId,
          title: item.title,
          description: item.description,
          caution: item.caution,
          order: index,
        })) ?? [],
    });

    await prisma.conceptEvolution.createMany({
      data:
        profile.historicalEvolution?.map((item, index) => ({
          conceptId,
          period: item.period,
          description: item.description,
          order: index,
        })) ?? [],
    });

    await prisma.conceptSemanticNeighbor.createMany({
      data:
        profile.semanticNeighbors?.map((item) => ({
          conceptId,
          relatedConceptId: item.href?.startsWith("/concepts/")
            ? conceptBySlug.get(item.href.replace("/concepts/", ""))
            : undefined,
          label: item.label,
          relationshipType: item.relationshipType,
          explanation: item.explanation,
          caution: item.caution,
          weight: 3,
        })) ?? [],
    });
  }

  const nodeById = new Map(
    await Promise.all(
      knowledgeNodes.map(async (node) => {
        const conceptId = conceptBySlug.get(node.slug);
        const schoolId = schoolBySlug.get(node.slug);

        const created = await prisma.knowledgeNode.create({
          data: {
            slug: node.slug,
            title: node.title,
            subtitle: node.subtitle,
            summary: node.summary,
            nodeType: node.nodeType,
            traditionId: sanatanaTradition.id,
            schoolId,
            conceptId,
            bookId: node.slug === bhagavadGita.slug ? book.id : undefined,
          },
        });

        return [node.id, created.id] as const;
      }),
    ),
  );

  await prisma.knowledgeEdge.createMany({
    data: knowledgeEdges.map((edge) => {
      const sourceNodeId = nodeById.get(edge.source);
      const targetNodeId = nodeById.get(edge.target);

      if (!sourceNodeId || !targetNodeId) {
        throw new Error(`Missing graph node for edge ${edge.id}.`);
      }

      return {
        sourceNodeId,
        targetNodeId,
        relationshipType: edge.relationshipType,
        label: edge.label,
        summary: edge.summary,
        explanation: edge.explanation,
        traditionId: edge.tradition ? sanatanaTradition.id : undefined,
        schoolId: getSchoolId(edge.school),
        bidirectional: edge.bidirectional ?? false,
        weight: edge.weight,
      };
    }),
  });

  const relatedConceptRows = knowledgeEdges
    .filter((edge) => {
      const source = knowledgeNodes.find((node) => node.id === edge.source);
      const target = knowledgeNodes.find((node) => node.id === edge.target);

      return source?.nodeType === "CONCEPT" && target?.nodeType === "CONCEPT";
    })
    .map((edge) => {
      const fromConceptId = conceptBySlug.get(edge.source);
      const toConceptId = conceptBySlug.get(edge.target);

      if (!fromConceptId || !toConceptId) {
        throw new Error(`Missing concept relation for edge ${edge.id}.`);
      }

      return {
        fromConceptId,
        toConceptId,
        relationshipType: edge.relationshipType,
        label: edge.label,
        summary: edge.summary,
        explanation: edge.explanation,
        traditionId: edge.tradition ? sanatanaTradition.id : undefined,
        schoolId: getSchoolId(edge.school),
        bidirectional: edge.bidirectional ?? true,
        weight: edge.weight,
      };
    });

  if (relatedConceptRows.length > 0) {
    await prisma.relatedConcept.createMany({
      data: relatedConceptRows,
    });
  }

  for (const path of learningPaths) {
    const createdPath = await prisma.learningPath.create({
      data: {
        slug: path.slug,
        title: path.title,
        summary: path.summary,
        kind: path.kind,
        difficulty: path.difficulty,
        traditionId: sanatanaTradition.id,
        schoolId: getSchoolId(path.school),
        guidanceNote: path.guidanceNote,
        status: "PUBLISHED",
      },
    });

    await prisma.learningPathStep.createMany({
      data: path.steps.map((step, index) => ({
        learningPathId: createdPath.id,
        kind: step.kind,
        title: step.title,
        summary: step.summary,
        contemplationPrompt: step.contemplationPrompt,
        practiceNote: step.practiceNote,
        order: index,
        verseId: step.verseLabel?.startsWith("Bhagavad Gita ")
          ? verseByReference.get(step.verseLabel.replace("Bhagavad Gita ", ""))
          : undefined,
        conceptId: step.conceptSlug ? conceptBySlug.get(step.conceptSlug) : undefined,
      })),
    });
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addOptional(values: Set<string>, value?: string) {
  if (value) {
    values.add(value);
  }
}

function registerSchoolAliases(name: string, slug: string, id: string, schoolByName: Map<string, string>) {
  schoolByName.set(name.toLowerCase(), id);

  if (slug.endsWith("-vedanta")) {
    schoolByName.set(name.replace(/\s+vedanta$/i, "").toLowerCase(), id);
  } else if (slug === "vishishtadvaita") {
    schoolByName.set("vishishtadvaita vedanta", id);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
