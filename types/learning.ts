import type { DifficultyLevel } from "./gita";

export type LearningPathKind =
  | "BEGINNER"
  | "KARMA_YOGA"
  | "BHAKTI"
  | "MEDITATION"
  | "VEDANTA"
  | "PEACE_GUIDANCE"
  | "DHARMA";

export type LearningStepKind =
  | "SCRIPTURE_READING"
  | "CONCEPT_STUDY"
  | "COMMENTARY_COMPARISON"
  | "PRACTICE_REFLECTION"
  | "CROSS_REFERENCE"
  | "REVIEW_PAUSE";

export type LearningPathStepContent = {
  kind: LearningStepKind;
  title: string;
  summary: string;
  contemplationPrompt?: string;
  practiceNote?: string;
  href?: string;
  verseLabel?: string;
  conceptSlug?: string;
};

export type LearningPathContent = {
  slug: string;
  title: string;
  summary: string;
  kind: LearningPathKind;
  difficulty: DifficultyLevel;
  tradition?: string;
  school?: string;
  guidanceNote?: string;
  steps: LearningPathStepContent[];
};
