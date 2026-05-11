import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { books as staticBooks, getBookBySlug as getStaticBookBySlug } from "@/lib/content/gita";
import type { BookContent, ChapterContent, ConceptContent, SourceContent, VerseContent } from "@/types/gita";

const verseInclude = {
  meaningLayers: {
    orderBy: { order: "asc" as const },
  },
  concepts: {
    orderBy: { order: "asc" as const },
    include: { concept: true },
  },
  commentaries: {
    orderBy: { order: "asc" as const },
    include: {
      school: true,
      layers: {
        orderBy: { order: "asc" as const },
      },
    },
  },
  sources: {
    include: { source: true },
  },
  relationships: {
    orderBy: { weight: "desc" as const },
    include: {
      targetReference: true,
      tradition: true,
      school: true,
    },
  },
};

export const getBooks = cache(async (): Promise<BookContent[]> => {
  if (!env.DATABASE_URL) {
    return [...staticBooks];
  }

  try {
    const books = await prisma.book.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      include: {
        chapters: {
          orderBy: { number: "asc" },
          include: {
            verses: {
              orderBy: { number: "asc" },
              include: verseInclude,
            },
          },
        },
      },
    });

    if (books.length === 0) {
      return [...staticBooks];
    }

    return books.map(mapBook);
  } catch {
    return [...staticBooks];
  }
});

export const getBook = cache(async (slug: string): Promise<BookContent | undefined> => {
  if (!env.DATABASE_URL) {
    return getStaticBookBySlug(slug);
  }

  try {
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { number: "asc" },
          include: {
            verses: {
              orderBy: { number: "asc" },
              include: verseInclude,
            },
          },
        },
      },
    });

    return book ? mapBook(book) : getStaticBookBySlug(slug);
  } catch {
    return getStaticBookBySlug(slug);
  }
});

export const getChapter = cache(async (bookSlug: string, chapterNumber: number): Promise<ChapterContent | undefined> => {
  const book = await getBook(bookSlug);
  return book?.chapters.find((chapter) => chapter.number === chapterNumber);
});

export const getVerse = cache(
  async (bookSlug: string, chapterNumber: number, verseNumber: number): Promise<VerseContent | undefined> => {
    const chapter = await getChapter(bookSlug, chapterNumber);
    return chapter?.verses.find((verse) => verse.number === verseNumber);
  },
);

export const getConceptsForVerseContent = cache(async (bookSlug: string, chapterNumber: number, verseNumber: number) => {
  const book = await getBook(bookSlug);
  const verse = book?.chapters
    .find((chapter) => chapter.number === chapterNumber)
    ?.verses.find((item) => item.number === verseNumber);

  if (!book || !verse) {
    return [];
  }

  return verse.conceptSlugs
    .map((slug) => book.concepts.find((concept) => concept.slug === slug))
    .filter((concept): concept is ConceptContent => Boolean(concept));
});

export const getSourcesForVerseContent = cache(async (bookSlug: string, chapterNumber: number, verseNumber: number) => {
  const book = await getBook(bookSlug);
  const verse = book?.chapters
    .find((chapter) => chapter.number === chapterNumber)
    ?.verses.find((item) => item.number === verseNumber);

  if (!book || !verse) {
    return [];
  }

  return verse.sourceSlugs
    .map((slug) => book.sources.find((source) => source.slug === slug))
    .filter((source): source is SourceContent => Boolean(source));
});

export const getVersePositionFromContent = cache(async (bookSlug: string, chapterNumber: number, verseNumber: number) => {
  const book = await getBook(bookSlug);
  const chapter = book?.chapters.find((item) => item.number === chapterNumber);

  if (!book || !chapter) {
    return undefined;
  }

  const chapterIndex = book.chapters.findIndex((item) => item.number === chapterNumber);
  const verseIndex = chapter.verses.findIndex((item) => item.number === verseNumber);

  if (chapterIndex < 0 || verseIndex < 0) {
    return undefined;
  }

  const flatVerses = book.chapters.flatMap((item) =>
    item.verses.map((verse) => ({
      chapter: item,
      verse,
      href: `/books/${book.slug}/chapters/${item.number}/verses/${verse.number}`,
    })),
  );
  const flatIndex = flatVerses.findIndex(
    (item) => item.chapter.number === chapterNumber && item.verse.number === verseNumber,
  );

  return {
    chapterIndex,
    verseIndex,
    chapterVerseCount: chapter.verses.length,
    chapterProgress: ((verseIndex + 1) / chapter.verses.length) * 100,
    totalVerseCount: flatVerses.length,
    totalProgress: ((flatIndex + 1) / flatVerses.length) * 100,
    previous: flatVerses[flatIndex - 1],
    next: flatVerses[flatIndex + 1],
  };
});

function mapBook(book: Awaited<ReturnType<typeof prisma.book.findMany>>[number] & { chapters: Array<ChapterRecord> }): BookContent {
  const concepts = new Map<string, ConceptContent>();
  const sources = new Map<string, SourceContent>();

  const chapters = book.chapters.map((chapter) =>
    mapChapter(chapter, (concept) => concepts.set(concept.slug, concept), (source) => sources.set(source.slug, source)),
  );

  return {
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle ?? "",
    tradition: book.tradition,
    difficulty: book.difficulty,
    summary: book.summary,
    beginnerSummary: book.beginnerSummary,
    tags: Array.from(concepts.values()).map((concept) => concept.name),
    chapters,
    concepts: Array.from(concepts.values()),
    sources: Array.from(sources.values()),
  };
}

type ChapterRecord = {
  number: number;
  slug: string;
  title: string;
  summary: string;
  overview: string;
  verses: Array<VerseRecord>;
};

type VerseRecord = {
  number: number;
  slug: string;
  sanskrit: string;
  transliteration: string;
  wordByWord: string;
  practicalApplication: string;
  philosophyInsight: string;
  meaningLayers: Array<{ type: VerseContent["meaningLayers"][number]["type"]; title: string; body: string }>;
  concepts: Array<{ concept: ConceptContent; order: number }>;
  commentaries: Array<
    VerseContent["commentaries"][number] & {
      school?: string | { name: string } | null;
      layerType?: VerseContent["commentaries"][number]["layerType"];
      language?: string | null;
      historicalPeriod?: string | null;
      sourceLocator?: string | null;
      attributionNote?: string | null;
      layers?: NonNullable<VerseContent["commentaries"][number]["layers"]>;
    }
  >;
  sources: Array<{ source: SourceContent }>;
  relationships?: Array<{
    relationshipType: NonNullable<VerseContent["relationships"]>[number]["relationshipType"];
    label: string;
    explanation: string;
    philosophicalContext: string | null;
    confidenceLevel: number;
    targetReference: {
      label: string;
      textTitle: string;
      locator: string | null;
    };
    tradition: { name: string } | null;
    school: { name: string } | null;
  }>;
};

function mapChapter(
  chapter: ChapterRecord,
  addConcept: (concept: ConceptContent) => void,
  addSource: (source: SourceContent) => void,
): ChapterContent {
  return {
    number: chapter.number,
    slug: chapter.slug,
    title: chapter.title,
    summary: chapter.summary,
    overview: chapter.overview,
    verses: chapter.verses.map((verse) => mapVerse(verse, addConcept, addSource)),
  };
}

function mapVerse(
  verse: VerseRecord,
  addConcept: (concept: ConceptContent) => void,
  addSource: (source: SourceContent) => void,
): VerseContent {
  const concepts = verse.concepts.map((item) => item.concept);
  const sources = verse.sources.map((item) => item.source);

  concepts.forEach(addConcept);
  sources.forEach(addSource);

  return {
    number: verse.number,
    slug: verse.slug,
    sanskrit: verse.sanskrit,
    transliteration: verse.transliteration,
    wordByWord: verse.wordByWord,
    practicalApplication: verse.practicalApplication,
    philosophyInsight: verse.philosophyInsight,
    meaningLayers: verse.meaningLayers.map((layer) => ({
      type: layer.type,
      title: layer.title,
      body: layer.body,
    })),
    conceptSlugs: concepts.map((concept) => concept.slug),
    commentaries: verse.commentaries.map((commentary) => ({
      author: commentary.author,
      tradition: commentary.tradition,
      school: getCommentarySchoolName(commentary.school),
      title: commentary.title,
      body: commentary.body,
      interpretationNote: commentary.interpretationNote,
      layerType: "layerType" in commentary ? commentary.layerType : undefined,
      language: "language" in commentary ? commentary.language ?? undefined : undefined,
      historicalPeriod: "historicalPeriod" in commentary ? commentary.historicalPeriod ?? undefined : undefined,
      sourceLocator: "sourceLocator" in commentary ? commentary.sourceLocator ?? undefined : undefined,
      attributionNote: "attributionNote" in commentary ? commentary.attributionNote ?? undefined : undefined,
      layers:
        "layers" in commentary
          ? commentary.layers?.map((layer) => ({
              type: layer.type,
              title: layer.title,
              body: layer.body,
            }))
          : undefined,
    })),
    relationships: verse.relationships?.map((relationship) => ({
      targetLabel: relationship.targetReference.label,
      targetTextTitle: relationship.targetReference.textTitle,
      targetLocator: relationship.targetReference.locator ?? undefined,
      relationshipType: relationship.relationshipType,
      label: relationship.label,
      explanation: relationship.explanation,
      philosophicalContext: relationship.philosophicalContext ?? undefined,
      tradition: relationship.tradition?.name,
      school: relationship.school?.name,
      confidenceLevel: relationship.confidenceLevel,
    })),
    sourceSlugs: sources.map((source) => source.slug),
  };
}

function getCommentarySchoolName(school: string | { name: string } | null | undefined) {
  if (!school) {
    return undefined;
  }

  return typeof school === "string" ? school : school.name;
}
