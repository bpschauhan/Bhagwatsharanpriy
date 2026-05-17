export type KnowledgeNodeType =
  | "TRADITION"
  | "SCRIPTURE"
  | "BOOK"
  | "CHAPTER"
  | "CONCEPT"
  | "PHILOSOPHY_SCHOOL"
  | "PRACTICE"
  | "COMMENTARY";

export type KnowledgeRelationshipType =
  | "BELONGS_TO"
  | "INFLUENCED"
  | "RELATED_TO"
  | "EXPLAINS"
  | "COMMENTARY_ON"
  | "DERIVED_FROM"
  | "EXPANDS_UPON"
  | "REFERENCES"
  | "PHILOSOPHICALLY_SIMILAR"
  | "PHILOSOPHICALLY_OPPOSED"
  | "PRACTICAL_PARALLEL"
  | "CONTEXTUALIZES";

export type KnowledgeDifficulty = "beginner" | "intermediate" | "advanced";

export type KnowledgeNodeGuidance = {
  whyItMatters: string;
  levelNote?: string;
  emerged?: string;
  prerequisiteIds?: string[];
  recommendedNextIds?: string[];
};

export type KnowledgeNode = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  nodeType: KnowledgeNodeType;
  parentId?: string;
  era?: string;
  century?: string;
  region?: string;
  difficulty?: KnowledgeDifficulty;
  guidance?: KnowledgeNodeGuidance;
  zone?: string;
  depth?: number;
  x: number;
  y: number;
  href?: string;
  tags?: string[];
};

export type KnowledgeEdge = {
  id: string;
  source: string;
  target: string;
  relationshipType: KnowledgeRelationshipType;
  label: string;
  summary: string;
  explanation?: string;
  tradition?: string;
  school?: string;
  bidirectional?: boolean;
  weight: number;
};

export type GuidedExplorationPath = {
  id: string;
  title: string;
  summary: string;
  difficulty: KnowledgeDifficulty;
  nodeIds: string[];
};

export type ConceptDefinitionProfile = {
  title: string;
  definition: string;
  context: string;
  tradition?: string;
  school?: string;
  sourceLabel?: string;
};

export type ConceptTraditionViewProfile = {
  title: string;
  positionSummary: string;
  nuance: string;
  tradition?: string;
  school?: string;
  differsFrom?: string;
};

export type ConceptMisconceptionProfile = {
  title: string;
  correction: string;
  whyItMatters: string;
};

export type ConceptPracticeProfile = {
  title: string;
  description: string;
  caution?: string;
};

export type ConceptEvolutionProfile = {
  period: string;
  description: string;
};

export type ConceptSemanticNeighborProfile = {
  label: string;
  relationshipType: KnowledgeRelationshipType;
  explanation: string;
  href?: string;
  caution?: string;
};

export type ConceptProfile = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  explanation: string;
  definitions?: ConceptDefinitionProfile[];
  traditionViews?: ConceptTraditionViewProfile[];
  misconceptions?: ConceptMisconceptionProfile[];
  practices?: ConceptPracticeProfile[];
  historicalEvolution?: ConceptEvolutionProfile[];
  semanticNeighbors?: ConceptSemanticNeighborProfile[];
  relatedConceptSlugs: string[];
  relatedBooks: Array<{
    title: string;
    href: string;
    note: string;
  }>;
  relatedVerses: Array<{
    label: string;
    href: string;
    note: string;
  }>;
  relatedPhilosophies: Array<{
    title: string;
    note: string;
  }>;
  parallels: Array<{
    title: string;
    note: string;
  }>;
  graphFocusNodeId: string;
};
