import type { SearchGroup as SearchGroupType } from "@/types/search";
import { SearchCard } from "./search-card";

type SearchGroupProps = {
  group: SearchGroupType;
  query: string;
};

export function SearchGroup({ group, query }: SearchGroupProps) {
  return (
    <section aria-labelledby={`search-group-${group.type}`} className="space-y-4">
      <div>
        <h2 id={`search-group-${group.type}`} className="font-serif text-2xl font-semibold">
          {group.label}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{group.results.length} carefully ranked results</p>
      </div>
      <div className="grid gap-4">
        {group.results.map((result) => (
          <SearchCard key={result.id} result={result} query={query} />
        ))}
      </div>
    </section>
  );
}
