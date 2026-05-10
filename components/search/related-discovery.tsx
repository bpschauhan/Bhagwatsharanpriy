import Link from "next/link";
import type { Route } from "next";
import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RelatedDiscoveryItem } from "@/types/search";

type RelatedDiscoveryProps = {
  title?: string;
  items: RelatedDiscoveryItem[];
};

export function RelatedDiscovery({ title = "Related discovery", items }: RelatedDiscoveryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="size-5 text-primary" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href as Route}
            className="block rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{item.title}</span>
              <Badge variant="muted">{item.relationship}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
