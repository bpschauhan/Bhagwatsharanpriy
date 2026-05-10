export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type MeaningLayerType =
  | "SIMPLE"
  | "BEGINNER"
  | "DEEP"
  | "PRACTICAL"
  | "PHILOSOPHICAL"
  | "SCIENTIFIC_PARALLEL";

export type SourceType = "SCRIPTURE" | "COMMENTARY" | "TRANSLATION" | "REFERENCE" | "SCHOLARLY" | "HISTORICAL" | "MODERN_ANALYSIS";

export type ConceptContent = {
  slug: string;
  name: string;
  category: string;
  description: string;
};

export type MeaningLayerContent = {
  type: MeaningLayerType;
  title: string;
  body: string;
};

export type CommentaryContent = {
  author: string;
  tradition: string;
  title: string;
  body: string;
  interpretationNote: string;
  sourceSlug?: string;
};

export type SourceContent = {
  slug: string;
  title: string;
  sourceType: SourceType;
  citation: string;
  url?: string;
  author?: string;
  translator?: string;
  publisher?: string;
};

export type VerseContent = {
  number: number;
  slug: string;
  sanskrit: string;
  transliteration: string;
  wordByWord: string;
  practicalApplication: string;
  philosophyInsight: string;
  meaningLayers: MeaningLayerContent[];
  conceptSlugs: string[];
  commentaries: CommentaryContent[];
  sourceSlugs: string[];
};

export type ChapterContent = {
  number: number;
  slug: string;
  title: string;
  summary: string;
  overview: string;
  verses: VerseContent[];
};

export type BookContent = {
  slug: string;
  title: string;
  subtitle: string;
  tradition: string;
  difficulty: DifficultyLevel;
  summary: string;
  beginnerSummary: string;
  tags: string[];
  chapters: ChapterContent[];
  concepts: ConceptContent[];
  sources: SourceContent[];
};
