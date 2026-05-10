import type { SearchResponse } from "@/types/search";
import { searchKnowledge } from "./search-engine";

export type SearchAdapter = {
  name: "local-static" | "postgres-fts" | "meilisearch";
  search: (query: string) => Promise<SearchResponse>;
  index?: () => Promise<void>;
};

export const localSearchAdapter: SearchAdapter = {
  name: "local-static",
  async search(query) {
    return searchKnowledge(query);
  },
};

export const postgresFtsSearchAdapter: SearchAdapter = {
  name: "postgres-fts",
  async search() {
    throw new Error("PostgreSQL full-text search adapter is not configured yet.");
  },
};

export const meilisearchAdapter: SearchAdapter = {
  name: "meilisearch",
  async search() {
    throw new Error("Meilisearch adapter is not configured yet.");
  },
};

export function getSearchAdapter(): SearchAdapter {
  return localSearchAdapter;
}
