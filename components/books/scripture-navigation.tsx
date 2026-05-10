"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, BookMarked, ListTree } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ChapterContent } from "@/types/gita";

const EMPTY_COMPLETED_VERSES: number[] = [];

type VerseLink = {
  href: string;
  chapter: ChapterContent;
  verse: ChapterContent["verses"][number];
};

type VerseNavigationProps = {
  previous?: VerseLink;
  next?: VerseLink;
  chapterHref: string;
  className?: string;
  keyboard?: boolean;
};

export function VerseNavigation({ previous, next, chapterHref, className, keyboard = false }: VerseNavigationProps) {
  useEffect(() => {
    if (!keyboard) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "ArrowLeft" && previous) {
        window.location.assign(previous.href);
      }

      if (event.key === "ArrowRight" && next) {
        window.location.assign(next.href);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboard, next, previous]);

  return (
    <nav
      className={cn(
        "grid gap-3 rounded-lg border border-border bg-card p-3 shadow-soft sm:grid-cols-[1fr_auto_1fr] sm:items-center",
        className,
      )}
      aria-label="Verse navigation"
    >
      <VerseNavLink direction="previous" item={previous} />
      <Link
        href={chapterHref as Route}
        className="focus-ring-calm inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-muted"
      >
        <ListTree className="size-4 text-primary" aria-hidden="true" />
        Chapter overview
      </Link>
      <VerseNavLink direction="next" item={next} />
    </nav>
  );
}

export function MobileVerseDock({ previous, next, chapterHref }: VerseNavigationProps) {
  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-[1fr_auto_1fr] gap-2 rounded-lg border border-border bg-card p-2 shadow-calm lg:hidden"
      aria-label="Mobile verse navigation"
    >
      <MobileDockLink direction="previous" item={previous} />
      <Link
        href={chapterHref as Route}
        className="focus-ring-calm inline-flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground"
        aria-label="Chapter overview"
      >
        <ListTree className="size-4 text-primary" aria-hidden="true" />
      </Link>
      <MobileDockLink direction="next" item={next} />
    </nav>
  );
}

function MobileDockLink({ direction, item }: { direction: "previous" | "next"; item?: VerseLink }) {
  const isPrevious = direction === "previous";

  if (!item) {
    return <span className="size-11 rounded-md border border-border/70 bg-muted/45" aria-hidden="true" />;
  }

  return (
    <Link
      href={item.href as Route}
      className={cn(
        "focus-ring-calm inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground",
        isPrevious ? "justify-start" : "justify-end",
      )}
      aria-label={isPrevious ? "Previous verse" : "Next verse"}
    >
      {isPrevious ? <ArrowLeft className="size-4 text-primary" aria-hidden="true" /> : null}
      <span>{item.chapter.number}.{item.verse.number}</span>
      {!isPrevious ? <ArrowRight className="size-4 text-primary" aria-hidden="true" /> : null}
    </Link>
  );
}

function VerseNavLink({ direction, item }: { direction: "previous" | "next"; item?: VerseLink }) {
  const isPrevious = direction === "previous";
  const label = isPrevious ? "Previous verse" : "Next verse";

  if (!item) {
    return (
      <span
        className={cn(
          "flex min-h-16 items-center gap-3 rounded-md border border-border/70 bg-muted/45 px-4 py-3 text-sm text-muted-foreground",
          !isPrevious && "justify-end text-right",
        )}
      >
        {isPrevious ? <ArrowLeft className="size-4" aria-hidden="true" /> : null}
        <span>{isPrevious ? "Beginning of guided path" : "End of guided path"}</span>
        {!isPrevious ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
      </span>
    );
  }

  return (
    <Link
      href={item.href as Route}
      className={cn(
        "focus-ring-calm group flex min-h-16 items-center gap-3 rounded-md border border-border bg-background px-4 py-3 transition-colors hover:border-primary/45 hover:bg-muted",
        !isPrevious && "justify-end text-right",
      )}
    >
      {isPrevious ? <ArrowLeft className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-x-1" aria-hidden="true" /> : null}
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="mt-1 block truncate font-serif text-base font-semibold">
          {item.chapter.number}.{item.verse.number}
        </span>
      </span>
      {!isPrevious ? <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /> : null}
    </Link>
  );
}

type ChapterVerseSidebarProps = {
  bookSlug: string;
  chapter: ChapterContent;
  currentVerseNumber: number;
  completedVerseNumbers?: number[];
};

export function ChapterVerseSidebar({
  bookSlug,
  chapter,
  currentVerseNumber,
  completedVerseNumbers = EMPTY_COMPLETED_VERSES,
}: ChapterVerseSidebarProps) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(() => new Set(completedVerseNumbers));

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("bhagwatsharanpriy:completed-verses") ?? "[]") as string[];
      setCompleted(
        new Set(
          saved
            .filter((key) => key.startsWith(`${bookSlug}:${chapter.number}:`))
            .map((key) => Number(key.split(":").at(-1)))
            .filter(Number.isFinite),
        ),
      );
    } catch {
      setCompleted(new Set(completedVerseNumbers));
    }
  }, [bookSlug, chapter.number, completedVerseNumbers]);

  return (
    <div className="surface-calm rounded-lg">
      <button
        type="button"
        className="focus-ring-calm flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left lg:hidden"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">Chapter navigation</span>
          <span className="font-serif text-lg font-semibold">Verse {currentVerseNumber}</span>
        </span>
        <BookMarked className="size-4 text-primary" aria-hidden="true" />
      </button>

      <div className={cn("border-t border-border p-4 lg:block lg:border-t-0", open ? "block" : "hidden")}>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Chapter {chapter.number}</p>
        <h2 className="mt-2 font-serif text-xl font-semibold">{chapter.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{chapter.summary}</p>
        <div className="mt-5 grid max-h-[52vh] gap-2 overflow-y-auto pr-1 [scrollbar-color:hsl(var(--border))_transparent]">
          {chapter.verses.map((verse) => {
            const active = verse.number === currentVerseNumber;
            const href = `/books/${bookSlug}/chapters/${chapter.number}/verses/${verse.number}`;

            return (
              <Link
                key={verse.number}
                href={href as Route}
                className={cn(
                  "focus-ring-calm flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-background/72 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="font-medium">Verse {chapter.number}.{verse.number}</span>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    active ? "bg-primary" : completed.has(verse.number) ? "bg-primary/55" : "bg-border",
                  )}
                  aria-label={completed.has(verse.number) ? "Completed" : undefined}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
