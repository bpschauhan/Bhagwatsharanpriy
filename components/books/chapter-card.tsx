import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChapterContent } from "@/types/gita";

type ChapterCardProps = {
  bookSlug: string;
  chapter: ChapterContent;
};

export function ChapterCard({ bookSlug, chapter }: ChapterCardProps) {
  const href = `/books/${bookSlug}/chapters/${chapter.number}` as Route;

  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1">
        <CardHeader>
          <p className="text-sm text-primary">Chapter {chapter.number}</p>
          <CardTitle>{chapter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-7 text-muted-foreground">{chapter.summary}</p>
          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{chapter.verses.length} seeded verses</span>
            <span className="inline-flex items-center gap-2 font-medium">
              Study
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
