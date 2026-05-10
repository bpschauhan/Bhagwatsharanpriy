"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Search, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getSuggestions } from "@/lib/search/search-engine";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { RecentSearches, saveRecentSearch } from "./recent-searches";

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 140);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  const suggestions = useMemo(() => getSuggestions(debouncedQuery, 6), [debouncedQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch();
  }

  function runSearch() {
    const clean = query.trim();

    if (!clean) {
      return;
    }

    saveRecentSearch(clean);
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(clean)}` as Route);
  }

  function openSuggestion(index: number) {
    const suggestion = suggestions[index];

    if (!suggestion) {
      runSearch();
      return;
    }

    saveRecentSearch(query || suggestion.title);
    onOpenChange(false);
    router.push(suggestion.href as Route);
  }

  function selectRecent(value: string) {
    setQuery(value);
    saveRecentSearch(value);
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(value)}` as Route);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] bg-background/82 p-4 backdrop-blur-xl"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search wisdom library"
        >
          <button className="absolute inset-0 cursor-default" type="button" aria-label="Close search" onClick={() => onOpenChange(false)} />
          <motion.div
            className="surface-calm relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-lg sm:mt-16"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
          >
            <form onSubmit={submit} className="flex items-center gap-3 border-b border-border bg-background/35 p-4 sm:p-5">
              <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.min(index + 1, Math.max(suggestions.length - 1, 0)));
                  }

                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.max(index - 1, 0));
                  }

                  if (event.key === "Enter" && suggestions.length > 0 && activeIndex >= 0) {
                    event.preventDefault();
                    openSuggestion(activeIndex);
                  }
                }}
                className="min-h-12 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                placeholder="Search verses, concepts, Sanskrit, meanings..."
                aria-label="Search query"
              />
              <Button type="button" variant="ghost" size="icon" aria-label="Close search" onClick={() => onOpenChange(false)}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </form>

            <div className="max-h-[72vh] overflow-y-auto p-3 [scrollbar-color:hsl(var(--border))_transparent] sm:p-5">
              {query.trim() ? (
                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                      Semantic matches, relationships, and nearby concepts
                    </span>
                    <span>Use arrow keys and Enter</span>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <Link
                      key={suggestion.id}
                      href={suggestion.href as Route}
                      className={cn(
                        "focus-ring-calm group grid gap-3 rounded-lg border border-border/70 bg-background/55 p-4 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/80 hover:shadow-glow sm:grid-cols-[minmax(0,1fr)_auto]",
                        index === activeIndex && "border-primary/40 bg-primary/10",
                      )}
                      onClick={() => {
                        saveRecentSearch(query);
                        onOpenChange(false);
                      }}
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-lg font-semibold leading-tight">{suggestion.title}</span>
                          <span className="rounded-full bg-muted px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {suggestion.type}
                          </span>
                          <span className="rounded-full bg-background/75 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {suggestion.reason}
                          </span>
                        </span>
                        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-muted-foreground">
                          {suggestion.body}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="focus-ring-calm mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-primary/90"
                    onClick={runSearch}
                  >
                    Search all results for {query}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <RecentSearches compact onSelect={selectRecent} />
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="size-4 text-primary" aria-hidden="true" />
                      Try exploring
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["karma", "dharma", "anxiety", "samatva", "atma"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="rounded-full border border-border bg-background/70 px-3 py-2 text-sm transition-colors hover:border-primary/45"
                          onClick={() => setQuery(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
