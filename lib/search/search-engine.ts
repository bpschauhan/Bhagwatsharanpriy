import { books } from "@/lib/content/gita";
import {
  conceptProfiles,
  getConceptProfile,
  getKnowledgeNode,
  getNeighborNodeIds,
  knowledgeNodes,
} from "@/lib/content/knowledge-graph";
import { normalizeSearchText, tokenizeSearchText } from "@/lib/search";
import type { SearchDocument, SearchGroup, SearchResponse, SearchResult, SearchResultType } from "@/types/search";

const groupLabels: Record<SearchResultType, string> = {
  verse: "Verses",
  concept: "Concepts",
  book: "Books",
  chapter: "Chapters",
  philosophy: "Philosophies",
  related: "Related Wisdom",
};

const groupOrder: SearchResultType[] = ["verse", "concept", "book", "chapter", "philosophy", "related"];

export const searchDocuments: SearchDocument[] = buildSearchDocuments();

export function searchKnowledge(query: string, limit = 24): SearchResponse {
  const normalizedQuery = normalizeSearchText(query);
  const tokens = tokenizeSearchText(query);

  if (!normalizedQuery) {
    return {
      query,
      total: 0,
      groups: [],
      relatedConcepts: getDefaultDiscoveryItems(),
      peopleAlsoExplore: getPeopleAlsoExplore(),
    };
  }

  const directResults = searchDocuments
    .map((document) => scoreDocument(document, normalizedQuery, tokens))
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const relationshipResults = buildRelationshipResults(normalizedQuery, tokens, directResults);
  const merged = mergeResults([...directResults, ...relationshipResults])
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    query,
    total: merged.length,
    groups: groupResults(merged),
    relatedConcepts: buildRelatedConcepts(normalizedQuery, tokens, merged),
    peopleAlsoExplore: getPeopleAlsoExplore(normalizedQuery),
  };
}

export function getSuggestions(query: string, limit = 7) {
  return searchKnowledge(query, limit).groups.flatMap((group) => group.results).slice(0, limit);
}

function buildSearchDocuments(): SearchDocument[] {
  const documents: SearchDocument[] = [];

  for (const book of books) {
    documents.push({
      id: `book:${book.slug}`,
      type: "book",
      title: book.title,
      subtitle: book.subtitle,
      body: `${book.summary} ${book.beginnerSummary}`,
      href: `/books/${book.slug}`,
      keywords: [book.tradition, book.difficulty, ...book.tags],
      conceptSlugs: book.concepts.map((concept) => concept.slug),
      nodeId: book.slug,
      boost: 18,
    });

    for (const chapter of book.chapters) {
      documents.push({
        id: `chapter:${book.slug}:${chapter.number}`,
        type: "chapter",
        title: `${book.title} ${chapter.number}: ${chapter.title}`,
        subtitle: book.title,
        body: `${chapter.summary} ${chapter.overview}`,
        href: `/books/${book.slug}/chapters/${chapter.number}`,
        keywords: [book.title, chapter.slug],
        conceptSlugs: chapter.verses.flatMap((verse) => verse.conceptSlugs),
        nodeId: book.slug,
        boost: 14,
      });

      for (const verse of chapter.verses) {
        documents.push({
          id: `verse:${book.slug}:${chapter.number}:${verse.number}`,
          type: "verse",
          title: `${book.title} ${chapter.number}.${verse.number}`,
          subtitle: chapter.title,
          body: [
            verse.sanskrit,
            verse.transliteration,
            verse.wordByWord,
            verse.practicalApplication,
            verse.philosophyInsight,
            ...verse.meaningLayers.flatMap((layer) => [layer.title, layer.body, layer.type]),
            ...verse.commentaries.flatMap((commentary) => [
              commentary.title,
              commentary.author,
              commentary.tradition,
              commentary.body,
            ]),
          ].join(" "),
          href: `/books/${book.slug}/chapters/${chapter.number}/verses/${verse.number}`,
          keywords: [book.title, chapter.title, verse.slug, ...verse.conceptSlugs],
          conceptSlugs: verse.conceptSlugs,
          nodeId: book.slug,
          boost: 20,
        });
      }
    }
  }

  for (const concept of conceptProfiles) {
    documents.push({
      id: `concept:${concept.slug}`,
      type: "concept",
      title: concept.title,
      subtitle: concept.category,
      body: `${concept.summary} ${concept.explanation} ${concept.parallels.map((parallel) => parallel.note).join(" ")}`,
      href: `/concepts/${concept.slug}`,
      keywords: [concept.category, ...concept.relatedConceptSlugs],
      conceptSlugs: [concept.slug, ...concept.relatedConceptSlugs],
      nodeId: concept.graphFocusNodeId,
      boost: 22,
    });
  }

  for (const node of knowledgeNodes) {
    if (node.id === "concepts") {
      continue;
    }

    const isPhilosophy =
      node.nodeType === "PHILOSOPHY_SCHOOL" || node.nodeType === "PRACTICE" || node.nodeType === "TRADITION";

    documents.push({
      id: `node:${node.id}`,
      type: isPhilosophy ? "philosophy" : "related",
      title: node.title,
      subtitle: node.nodeType.replaceAll("_", " ").toLowerCase(),
      body: node.summary,
      href: node.href ?? `/explore`,
      keywords: [node.slug, ...(node.tags ?? [])],
      conceptSlugs: node.nodeType === "CONCEPT" ? [node.slug] : [],
      nodeId: node.id,
      boost: isPhilosophy ? 12 : 8,
    });
  }

  return documents;
}

function scoreDocument(document: SearchDocument, normalizedQuery: string, tokens: string[]) {
  const title = normalizeSearchText(document.title);
  const subtitle = normalizeSearchText(document.subtitle ?? "");
  const body = normalizeSearchText(document.body);
  const keywords = normalizeSearchText(document.keywords.join(" "));
  const haystack = `${title} ${subtitle} ${keywords} ${body}`;

  let score = document.boost;
  let reason = "related meaning";

  if (title === normalizedQuery) {
    score += 100;
    reason = "exact title match";
  } else if (title.includes(normalizedQuery)) {
    score += 70;
    reason = "title match";
  }

  if (keywords.includes(normalizedQuery)) {
    score += 48;
    reason = "concept match";
  }

  if (subtitle.includes(normalizedQuery)) {
    score += 24;
    reason = "context match";
  }

  if (body.includes(normalizedQuery)) {
    score += 20;
    reason = "meaning match";
  }

  const tokenMatches = tokens.filter((token) => haystack.includes(token)).length;
  score += tokenMatches * 12;

  if (tokens.some((token) => fuzzyIncludes(title, token))) {
    score += 12;
    reason = "close title match";
  }

  if (tokenMatches === 0 && !haystack.includes(normalizedQuery) && !fuzzyIncludes(title, normalizedQuery)) {
    return null;
  }

  return {
    ...document,
    score,
    reason,
  } satisfies SearchResult;
}

function buildRelationshipResults(normalizedQuery: string, tokens: string[], directResults: SearchResult[]) {
  const matchedConcept = conceptProfiles.find((concept) => {
    const conceptText = normalizeSearchText(`${concept.title} ${concept.slug} ${concept.summary}`);
    return conceptText.includes(normalizedQuery) || tokens.some((token) => conceptText.includes(token));
  });

  const focusNodeId = matchedConcept?.graphFocusNodeId ?? directResults.find((result) => result.nodeId)?.nodeId;

  if (!focusNodeId) {
    return [];
  }

  return getNeighborNodeIds(focusNodeId)
    .map((nodeId) => getKnowledgeNode(nodeId))
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => ({
      id: `relationship:${focusNodeId}:${node.id}`,
      type: node.nodeType === "CONCEPT" ? "concept" : "related",
      title: node.title,
      subtitle: "Relationship discovery",
      body: node.summary,
      href: node.href ?? "/explore",
      keywords: [node.slug, node.nodeType],
      conceptSlugs: node.nodeType === "CONCEPT" ? [node.slug] : [],
      nodeId: node.id,
      boost: 0,
      score: 34,
      reason: "connected in wisdom graph",
    }) satisfies SearchResult);
}

function buildRelatedConcepts(normalizedQuery: string, tokens: string[], results: SearchResult[]) {
  const focus =
    conceptProfiles.find((concept) => normalizeSearchText(`${concept.title} ${concept.slug}`).includes(normalizedQuery)) ??
    conceptProfiles.find((concept) => tokens.some((token) => normalizeSearchText(concept.summary).includes(token))) ??
    conceptProfiles.find((concept) => results.some((result) => result.conceptSlugs.includes(concept.slug)));

  if (!focus) {
    return getDefaultDiscoveryItems();
  }

  return focus.relatedConceptSlugs
    .map((slug) => getConceptProfile(slug))
    .filter((concept): concept is NonNullable<typeof concept> => Boolean(concept))
    .map((concept) => ({
      title: concept.title,
      summary: concept.summary,
      href: `/concepts/${concept.slug}`,
      relationship: `Related to ${focus.title}`,
    }));
}

function getDefaultDiscoveryItems() {
  return conceptProfiles.slice(0, 4).map((concept) => ({
    title: concept.title,
    summary: concept.summary,
    href: `/concepts/${concept.slug}`,
    relationship: concept.category,
  }));
}

function getPeopleAlsoExplore(normalizedQuery = "") {
  return knowledgeNodes
    .filter((node) => ["yoga", "vedanta", "sankhya", "bhagavad-gita", "upanishads"].includes(node.id))
    .filter((node) => normalizeSearchText(node.title) !== normalizedQuery)
    .map((node) => ({
      title: node.title,
      summary: node.summary,
      href: node.href ?? "/explore",
      relationship: node.nodeType.replaceAll("_", " ").toLowerCase(),
    }));
}

function groupResults(results: SearchResult[]): SearchGroup[] {
  return groupOrder
    .map((type) => ({
      type,
      label: groupLabels[type],
      results: results.filter((result) => result.type === type).slice(0, 6),
    }))
    .filter((group) => group.results.length > 0);
}

function mergeResults(results: SearchResult[]) {
  const byId = new Map<string, SearchResult>();

  for (const result of results) {
    const existing = byId.get(result.id);

    if (!existing || result.score > existing.score) {
      byId.set(result.id, result);
    }
  }

  return Array.from(byId.values());
}

function fuzzyIncludes(value: string, query: string) {
  if (!query) {
    return false;
  }

  let queryIndex = 0;

  for (const character of value) {
    if (character === query[queryIndex]) {
      queryIndex += 1;
    }

    if (queryIndex === query.length) {
      return true;
    }
  }

  return false;
}
