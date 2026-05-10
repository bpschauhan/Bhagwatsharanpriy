import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewQueueItem } from "@/types/admin";
import { VerificationBadge } from "./verification-badge";

type ReviewQueueProps = {
  items: ReviewQueueItem[];
};

export function ReviewQueue({ items }: ReviewQueueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href as Route}
            className="group block rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/45"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.entityType.replaceAll("_", " ").toLowerCase()}</p>
              </div>
              <VerificationBadge status={item.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="size-4 text-primary" aria-hidden="true" />
                {item.sourceCount} sources
              </span>
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                Review
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
