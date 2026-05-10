import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { bhagavadGita } from "../lib/content/gita";
import { conceptProfiles, knowledgeEdges, knowledgeNodes } from "../lib/content/knowledge-graph";
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

  const schoolBySlug = new Map(
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

      await prisma.commentary.createMany({
        data: verse.commentaries.map((commentary, index) => ({
          verseId: createdVerse.id,
          sourceId: commentary.sourceSlug ? sourceBySlug.get(commentary.sourceSlug) : undefined,
          author: commentary.author,
          tradition: commentary.tradition,
          title: commentary.title,
          body: commentary.body,
          interpretationNote: commentary.interpretationNote,
          order: index,
        })),
      });
    }
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
        bidirectional: edge.bidirectional ?? true,
        weight: edge.weight,
      };
    });

  if (relatedConceptRows.length > 0) {
    await prisma.relatedConcept.createMany({
      data: relatedConceptRows,
    });
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
