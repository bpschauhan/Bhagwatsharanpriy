"use client";

import Link from "next/link";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const storageKey = "bhagwatsharanpriy:recent-searches";

type RecentSearchesProps = {
  onSelect?: (query: string) => void;
  compact?: boolean;
};

export function RecentSearches({ onSelect, compact = false }: RecentSearchesProps) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(getRecentSearches());
  }, []);

  function clear() {
    window.localStorage.removeItem(storageKey);
    setItems([]);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={compact ? "space-y-3" : "rounded-lg border border-border bg-card p-5"}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          Recent searches
        </p>
        <Button type="button" variant="ghost" size="icon" aria-label="Clear recent searches" onClick={clear}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) =>
          onSelect ? (
            <button key={item} type="button" onClick={() => onSelect(item)}>
              <Badge variant="outline">{item}</Badge>
            </button>
          ) : (
            <Link key={item} href={`/search?q=${encodeURIComponent(item)}`}>
              <Badge variant="outline">{item}</Badge>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export function saveRecentSearch(query: string) {
  const clean = query.trim();

  if (!clean || typeof window === "undefined") {
    return;
  }

  const items = getRecentSearches();
  const next = [clean, ...items.filter((item) => item.toLocaleLowerCase("en-IN") !== clean.toLocaleLowerCase("en-IN"))];
  window.localStorage.setItem(storageKey, JSON.stringify(next.slice(0, 6)));
}

function getRecentSearches() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
