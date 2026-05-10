import Link from "next/link";
import type { Route } from "next";
import { BookOpen, ClipboardCheck, FileClock, GitBranch, Home, Library, ScrollText, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/books", label: "Books", icon: Library },
  { href: "/admin/verses", label: "Verses", icon: ScrollText },
  { href: "/admin/concepts", label: "Concepts", icon: GitBranch },
  { href: "/admin/sources", label: "Sources", icon: BookOpen },
  { href: "/admin/review", label: "Review", icon: ClipboardCheck },
  { href: "/admin/revisions", label: "Revisions", icon: FileClock },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-border bg-card p-3 shadow-soft lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-4 flex items-center gap-2 px-3 py-2">
        <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
        <div>
          <p className="font-serif text-lg font-semibold">Truth CMS</p>
          <p className="text-xs text-muted-foreground">Internal workflow</p>
        </div>
      </div>
      <nav aria-label="Admin navigation" className="grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as Route}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
