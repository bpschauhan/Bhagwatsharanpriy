import Link from "next/link";
import type { Route } from "next";
import { FlameKindling } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conceptProfiles } from "@/lib/content/knowledge-graph";

const trending = ["karma", "dharma", "samatva", "atma", "moksha"];

export function TrendingConcepts() {
  const concepts = trending
    .map((slug) => conceptProfiles.find((concept) => concept.slug === slug))
    .filter((concept): concept is NonNullable<typeof concept> => Boolean(concept));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlameKindling className="size-5 text-primary" aria-hidden="true" />
          Trending concepts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <Link key={concept.slug} href={`/concepts/${concept.slug}` as Route}>
            <Badge variant="outline" className="transition-colors hover:border-primary/45 hover:text-foreground">
              {concept.title}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
