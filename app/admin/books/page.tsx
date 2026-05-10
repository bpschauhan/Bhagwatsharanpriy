import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { VerificationBadge } from "@/components/admin/verification-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { books } from "@/lib/content/gita";

export const metadata: Metadata = {
  title: "Admin Books | Bhagwatsharanpriy",
  description: "Manage scripture books and verification workflow.",
};

export default function AdminBooksPage() {
  return (
    <>
      <AdminHeader
        title="Books"
        description="Manage book metadata, chapter structure, source transparency, and publish readiness."
      />
      <Link
        href="/admin/books/new"
        className="mb-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        <Plus className="size-4" aria-hidden="true" />
        New book
      </Link>
      <div className="grid gap-4">
        {books.map((book) => (
          <Link key={book.slug} href={`/admin/books/${book.slug}`} className="group block">
            <Card className="transition-transform duration-300 group-hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>{book.title}</CardTitle>
                  <VerificationBadge status="REVIEW" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{book.summary}</p>
                <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{book.chapters.length} chapters in current seed</span>
                  <span className="inline-flex items-center gap-2 font-medium">
                    Edit
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
