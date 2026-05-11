export type AdminRole = "ADMIN" | "EDITOR" | "REVIEWER" | "CONTRIBUTOR";

export type VerificationStatus = "DRAFT" | "REVIEW" | "VERIFIED" | "DISPUTED" | "ARCHIVED";

export type ContentEntityType =
  | "BOOK"
  | "CHAPTER"
  | "VERSE"
  | "MEANING_LAYER"
  | "CONCEPT"
  | "COMMENTARY"
  | "SOURCE"
  | "KNOWLEDGE_NODE"
  | "KNOWLEDGE_EDGE"
  | "RELATED_CONCEPT"
  | "COMMENTARY_LAYER"
  | "CITATION"
  | "CANONICAL_REFERENCE"
  | "SCRIPTURE_RELATIONSHIP"
  | "CONCEPT_DEFINITION"
  | "CONCEPT_TRADITION_VIEW"
  | "CONCEPT_MISCONCEPTION"
  | "CONCEPT_PRACTICE"
  | "CONCEPT_EVOLUTION"
  | "CONCEPT_SEMANTIC_NEIGHBOR"
  | "LEARNING_PATH"
  | "LEARNING_PATH_STEP";

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
  status: VerificationStatus;
};

export type ReviewQueueItem = {
  id: string;
  entityType: ContentEntityType;
  title: string;
  summary: string;
  status: VerificationStatus;
  confidenceLevel: number;
  sourceCount: number;
  updatedAt: string;
  href: string;
};

export type RevisionEntry = {
  id: string;
  version: number;
  title: string;
  author: string;
  changeNote: string;
  createdAt: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  message: string;
  createdAt: string;
};

export type AdminSource = {
  id: string;
  title: string;
  author?: string;
  sourceType: "SCRIPTURE" | "COMMENTARY" | "SCHOLARLY" | "HISTORICAL" | "MODERN_ANALYSIS";
  citation: string;
  credibilityScore: number;
  status: VerificationStatus;
};
