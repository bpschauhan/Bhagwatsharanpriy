import Link from "next/link";
import type { Route } from "next";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { Container } from "./container";

const navItems = [
  { href: "/books", label: "Books" },
  { href: "/explore", label: "Explore" },
  { href: "/concepts", label: "Concepts" },
  { href: "/discover", label: "Discover" },
  { href: "#wisdom", label: "Wisdom" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-normal">
          Bhagwatsharanpriy
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex" aria-label="Primary">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href as Route} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            )
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
