import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { RecentSearches } from "@/components/search/recent-searches";
import { SearchResults } from "@/components/search/search-results";
import { searchKnowledge } from "@/lib/search/search-engine";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  return {
    title: query ? `Search "${query}" | Bhagwatsharanpriy` : "Search | Bhagwatsharanpriy",
    description: "Search scriptures, concepts, Sanskrit, transliteration, commentary, and wisdom relationships.",
    openGraph: {
      title: query ? `Search "${query}" | Bhagwatsharanpriy` : "Search | Bhagwatsharanpriy",
      description: "A calm semantic search experience for wisdom study.",
      type: "website",
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";
  const response = searchKnowledge(query);

  return (
    <>
      <Section className="bg-wisdom-radial pt-24 sm:pt-28">
        <Container>
          <SectionHeader
            eyebrow="Semantic search"
            title="Find wisdom by meaning, not only by words"
            description="Search verses, concepts, Sanskrit text, transliteration, commentary, and relationships across the wisdom map."
          />
          <form action="/search" className="max-w-3xl">
            <label className="sr-only" htmlFor="search-page-query">
              Search wisdom library
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-soft">
              <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <input
                id="search-page-query"
                name="q"
                defaultValue={query}
                className="min-h-12 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                placeholder="Try karma, dharma, anxiety, samatva, Sanskrit, or a verse idea..."
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
            </div>
          </form>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {query.trim() ? `${response.total} results and relationship suggestions` : "Begin with a word, question, or state of mind"}
              </p>
              {query.trim() ? <h1 className="mt-2 font-serif text-3xl font-semibold">Results for {query}</h1> : null}
            </div>
            <RecentSearches compact />
          </div>
          <SearchResults response={response} />
        </Container>
      </Section>
    </>
  );
}
