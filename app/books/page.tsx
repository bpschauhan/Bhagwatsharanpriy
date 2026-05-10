import type { Metadata } from "next";
import { Search } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { books } from "@/lib/content/gita";

export const metadata: Metadata = {
  title: "Books | Bhagwatsharanpriy",
  description: "Study sacred wisdom texts through calm, structured, beginner-friendly learning paths.",
  openGraph: {
    title: "Books | Bhagwatsharanpriy",
    description: "Calm guided study of wisdom texts, beginning with the Bhagavad Gita.",
    type: "website",
  },
};

export default function BooksPage() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container>
        <SectionHeader
          eyebrow="Study library"
          title="Wisdom texts for deep, careful learning"
          description="Begin with one text, move slowly, and let each chapter become understandable before going deeper."
        />

        <div className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground">
          <Search className="size-4" aria-hidden="true" />
          <span className="text-sm">Search books, chapters, verses, or concepts</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
