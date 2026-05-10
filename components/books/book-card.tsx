import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookContent } from "@/types/gita";

type BookCardProps = {
  book: BookContent;
};

export function BookCard({ book }: BookCardProps) {
  const href = `/books/${book.slug}` as Route;

  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1">
        <CardHeader>
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge>{book.difficulty.toLowerCase()}</Badge>
            <Badge variant="outline">{book.tradition}</Badge>
          </div>
          <CardTitle>{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-24 leading-7 text-muted-foreground">{book.summary}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            Begin study
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
