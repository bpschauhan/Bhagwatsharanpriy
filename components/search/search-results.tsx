import { RelatedDiscovery } from "@/components/search/related-discovery";
import { SearchGroup } from "@/components/search/search-group";
import { TrendingConcepts } from "@/components/search/trending-concepts";
import type { SearchResponse } from "@/types/search";

type SearchResultsProps = {
  response: SearchResponse;
};

export function SearchResults({ response }: SearchResultsProps) {
  if (!response.query.trim()) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="surface-calm rounded-lg p-6">
          <h2 className="font-serif text-2xl font-semibold">Begin with a question</h2>
          <p className="mt-3 leading-8 text-muted-foreground">
            Try searching for karma, anxiety, action, dharma, self, equanimity, meditation, or a verse reference.
          </p>
        </div>
        <TrendingConcepts />
      </div>
    );
  }

  if (response.groups.length === 0) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="surface-calm rounded-lg p-6">
          <h2 className="font-serif text-2xl font-semibold">No direct results yet</h2>
          <p className="mt-3 leading-8 text-muted-foreground">
            The library is still growing. Try a broader concept like karma, dharma, atma, yoga, or peace.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {["karma", "dharma", "atma", "samatva"].map((item) => (
              <a key={item} href={`/search?q=${item}`} className="rounded-full border border-border bg-background/70 px-3 py-2 transition-colors hover:border-primary/45">
                {item}
              </a>
            ))}
          </div>
        </div>
        <RelatedDiscovery title="Start nearby" items={response.relatedConcepts} />
      </div>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-10">
        {response.groups.map((group) => (
          <SearchGroup key={group.type} group={group} query={response.query} />
        ))}
      </div>
      <div className="space-y-5">
        <RelatedDiscovery items={response.relatedConcepts} />
        <RelatedDiscovery title="People also explore" items={response.peopleAlsoExplore} />
        <TrendingConcepts />
      </div>
    </div>
  );
}
