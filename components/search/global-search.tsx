"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "./search-overlay";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="hidden h-10 min-w-44 justify-start text-muted-foreground md:inline-flex"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <Search className="size-4" aria-hidden="true" />
        Search wisdom
        <span className="ml-auto text-xs text-muted-foreground">Ctrl K</span>
      </Button>
      <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open search">
        <Search className="size-4" aria-hidden="true" />
      </Button>
      <SearchOverlay open={open} onOpenChange={setOpen} />
    </>
  );
}
