"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpenText, History } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "bhagwatsharanpriy:continue-reading";
const COMPLETED_KEY = "bhagwatsharanpriy:completed-verses";
const RECENT_KEY = "bhagwatsharanpriy:recent-study";
const STUDY_DAYS_KEY = "bhagwatsharanpriy:study-days";

type ReadingState = {
  bookTitle: string;
  bookSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  verseNumber: number;
  href: string;
  label: string;
  progress: number;
  savedAt: number;
};

type SaveReadingPositionProps = Omit<ReadingState, "savedAt">;
type ContinueReadingCardProps = {
  fallbackHref?: string;
  fallbackLabel?: string;
};

export function SaveReadingPosition(position: SaveReadingPositionProps) {
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...position, savedAt: Date.now() }));
    let saved: string[] = [];

    try {
      saved = JSON.parse(window.localStorage.getItem(COMPLETED_KEY) ?? "[]") as string[];
    } catch {
      saved = [];
    }

    const completed = new Set<string>(saved);
    completed.add(`${position.bookSlug}:${position.chapterNumber}:${position.verseNumber}`);
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
    saveRecentStudy({ ...position, savedAt: Date.now() });
    saveStudyDay();
  }, [position]);

  return null;
}

export function ContinueReadingCard({ fallbackHref, fallbackLabel = "Begin the next verse" }: ContinueReadingCardProps) {
  const [position, setPosition] = useState<ReadingState | null>(null);
  const [recent, setRecent] = useState<ReadingState[]>([]);
  const [studyDays, setStudyDays] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const recentSaved = window.localStorage.getItem(RECENT_KEY);
    const daysSaved = window.localStorage.getItem(STUDY_DAYS_KEY);

    if (saved) {
      try {
        setPosition(JSON.parse(saved) as ReadingState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (recentSaved) {
      try {
        setRecent((JSON.parse(recentSaved) as ReadingState[]).slice(0, 3));
      } catch {
        window.localStorage.removeItem(RECENT_KEY);
      }
    }

    if (daysSaved) {
      try {
        setStudyDays((JSON.parse(daysSaved) as string[]).length);
      } catch {
        window.localStorage.removeItem(STUDY_DAYS_KEY);
      }
    }
  }, []);

  if (!position) {
    if (!fallbackHref) {
      return null;
    }

    return (
      <Card className="border-primary/25">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <BookOpenText className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Begin contemplation</p>
              <h3 className="mt-2 font-serif text-xl font-semibold leading-tight">{fallbackLabel}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/72">
                Your place will be remembered quietly as you read.
              </p>
            </div>
          </div>
          <Link
            href={fallbackHref as Route}
            className="focus-ring-calm mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open verse
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/35">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <BookOpenText className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Resume contemplation</p>
            <h3 className="mt-2 font-serif text-xl font-semibold leading-tight">{position.label}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/72">
              {position.bookTitle} / Chapter {position.chapterNumber}, {position.chapterTitle}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${position.progress}%` }} />
            </div>
          </div>
        </div>
        <Link
          href={position.href as Route}
          className="focus-ring-calm mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Resume verse
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        {recent.length > 1 || studyDays > 0 ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <History className="size-3.5 text-primary" aria-hidden="true" />
              Recently studied
            </p>
            <div className="grid gap-2">
              {recent
                .filter((item) => item.href !== position.href)
                .slice(0, 2)
                .map((item) => (
                  <Link
                    key={`${item.href}-${item.savedAt}`}
                    href={item.href as Route}
                    className="focus-ring-calm rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground/78 transition-colors hover:border-primary/45 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
            {studyDays > 0 ? (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {studyDays === 1 ? "One quiet study day remembered." : `${studyDays} quiet study days remembered.`}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function saveRecentStudy(position: ReadingState) {
  let recent: ReadingState[] = [];

  try {
    recent = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]") as ReadingState[];
  } catch {
    recent = [];
  }

  const next = [position, ...recent.filter((item) => item.href !== position.href)].slice(0, 5);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function saveStudyDay() {
  let days: string[] = [];

  try {
    days = JSON.parse(window.localStorage.getItem(STUDY_DAYS_KEY) ?? "[]") as string[];
  } catch {
    days = [];
  }

  const today = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(STUDY_DAYS_KEY, JSON.stringify(Array.from(new Set([today, ...days])).slice(0, 30)));
}
