import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchResult } from "@/types/search";
import { HighlightedText } from "./highlighted-text";

type SearchCardProps = {
  result: SearchResult;
  query: string;
};

export function SearchCard({ result, query }: SearchCardProps) {
  const excerpt = createExcerpt(result.body, query);
  const breadcrumb = getBreadcrumb(result);

  return (
    <Link href={result.href as Route} className="group block">
      <Card className="transition-transform duration-500 ease-premium group-hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{result.type}</Badge>
            <Badge variant="muted">{result.reason}</Badge>
          </div>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{breadcrumb}</p>
          <h3 className="font-serif text-xl font-semibold">
            <HighlightedText text={result.title} query={query} />
          </h3>
          {result.subtitle ? <p className="mt-1 text-sm text-muted-foreground">{result.subtitle}</p> : null}
          <p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">
            <HighlightedText text={excerpt} query={query} />
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
            Open
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function getBreadcrumb(result: SearchResult) {
  if (result.type === "verse") {
    return "Scripture / Verse / Meaning";
  }

  if (result.type === "chapter") {
    return "Scripture / Chapter / Study path";
  }

  if (result.type === "concept") {
    return "Concept archive / Related teachings";
  }

  if (result.type === "philosophy") {
    return "Darshana / Practice / Tradition";
  }

  return "Wisdom graph / Nearby relationship";
}

function createExcerpt(body: string, query: string) {
  const normalizedBody = body.toLocaleLowerCase("en-IN");
  const normalizedQuery = query.toLocaleLowerCase("en-IN").trim();
  const index = normalizedQuery ? normalizedBody.indexOf(normalizedQuery) : -1;

  if (index < 0) {
    return body.slice(0, 220);
  }

  const start = Math.max(0, index - 80);
  const end = Math.min(body.length, index + 180);
  return `${start > 0 ? "... " : ""}${body.slice(start, end)}${end < body.length ? " ..." : ""}`;
}
