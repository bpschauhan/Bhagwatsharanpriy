export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type MeaningLayerType =
  | "SIMPLE"
  | "BEGINNER"
  | "DEEP"
  | "PRACTICAL"
  | "PHILOSOPHICAL"
  | "SCIENTIFIC_PARALLEL";

export type SourceType = "SCRIPTURE" | "COMMENTARY" | "TRANSLATION" | "REFERENCE" | "SCHOLARLY" | "HISTORICAL" | "MODERN_ANALYSIS";

export type CommentaryLayerType =
  | "TEXTUAL"
  | "PHILOLOGICAL"
  | "PHILOSOPHICAL"
  | "DEVOTIONAL"
  | "PRACTICAL"
  | "HISTORICAL"
  | "COMPARATIVE";

export type ScriptureRelationshipType =
  | "EXPANDS_UPON"
  | "REFERENCES"
  | "PHILOSOPHICALLY_SIMILAR"
  | "PHILOSOPHICALLY_OPPOSED"
  | "DERIVED_FROM"
  | "COMMENTARY_ON"
  | "PRACTICAL_PARALLEL"
  | "CONTEXTUALIZES";

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
  school?: string;
  title: string;
  body: string;
  interpretationNote: string;
  sourceSlug?: string;
  layerType?: CommentaryLayerType;
  language?: string;
  historicalPeriod?: string;
  sourceLocator?: string;
  attributionNote?: string;
  layers?: Array<{
    type: CommentaryLayerType;
    title: string;
    body: string;
  }>;
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
  language?: string;
  edition?: string;
  historicalDate?: string;
  provenanceNote?: string;
};

export type VerseRelationshipContent = {
  targetLabel: string;
  targetTextTitle: string;
  targetLocator?: string;
  relationshipType: ScriptureRelationshipType;
  label: string;
  explanation: string;
  philosophicalContext?: string;
  tradition?: string;
  school?: string;
  confidenceLevel?: number;
  sourceSlug?: string;
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
  relationships?: VerseRelationshipContent[];
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
