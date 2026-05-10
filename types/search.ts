export type SearchResultType = "verse" | "concept" | "book" | "chapter" | "philosophy" | "related";

export type SearchDocument = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  body: string;
  href: string;
  keywords: string[];
  conceptSlugs: string[];
  nodeId?: string;
  boost: number;
};

export type SearchResult = SearchDocument & {
  score: number;
  reason: string;
};

export type SearchGroup = {
  type: SearchResultType;
  label: string;
  results: SearchResult[];
};

export type RelatedDiscoveryItem = {
  title: string;
  summary: string;
  href: string;
  relationship: string;
};

export type SearchResponse = {
  query: string;
  total: number;
  groups: SearchGroup[];
  relatedConcepts: RelatedDiscoveryItem[];
  peopleAlsoExplore: RelatedDiscoveryItem[];
};
