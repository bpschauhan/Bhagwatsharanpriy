import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import type { VerseContent } from "@/types/gita";

type VerseRowProps = {
  bookSlug: string;
  chapterNumber: number;
  verse: VerseContent;
};

export function VerseRow({ bookSlug, chapterNumber, verse }: VerseRowProps) {
  const simpleLayer = verse.meaningLayers.find((layer) => layer.type === "SIMPLE");
  const href = `/books/${bookSlug}/chapters/${chapterNumber}/verses/${verse.number}` as Route;

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-primary">Verse {chapterNumber}.{verse.number}</p>
          <p className="mt-2 font-devanagari text-xl leading-9">{verse.sanskrit.split("\n").at(-1)}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{simpleLayer?.body}</p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
