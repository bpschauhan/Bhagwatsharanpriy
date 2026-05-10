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
  | "DERIVED_FROM";

export type KnowledgeNode = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  nodeType: KnowledgeNodeType;
  parentId?: string;
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
  bidirectional?: boolean;
  weight: number;
};

export type ConceptProfile = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  explanation: string;
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
