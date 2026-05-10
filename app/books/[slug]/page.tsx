import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterCard } from "@/components/books/chapter-card";
import { ContinueReadingCard } from "@/components/books/reading-state";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBook, getBooks } from "@/lib/queries/books";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    return {};
  }

  return {
    title: `${book.title} | Bhagwatsharanpriy`,
    description: book.summary,
    openGraph: {
      title: `${book.title} | Bhagwatsharanpriy`,
      description: book.summary,
      type: "article",
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    notFound();
  }

  const firstVerse = book.chapters[0]?.verses[0];
  const firstVerseHref = firstVerse
    ? `/books/${book.slug}/chapters/${book.chapters[0].number}/verses/${firstVerse.number}`
    : undefined;

  return (
    <>
      <Section className="bg-wisdom-radial pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge>{book.difficulty.toLowerCase()}</Badge>
              <Badge variant="outline">{book.tradition}</Badge>
            </div>
            <h1 className="font-serif text-5xl font-semibold leading-tight sm:text-6xl">{book.title}</h1>
            <p className="mt-5 max-w-3xl text-xl leading-9 text-muted-foreground">{book.subtitle}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-6">
            <ContinueReadingCard fallbackHref={firstVerseHref} fallbackLabel={`Begin ${book.title}`} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Beginner-friendly path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">{book.beginnerSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Philosophy tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-card/45">
        <Container>
          <SectionHeader
            eyebrow="Chapters"
            title="Move from confusion toward clarity"
            description="Each chapter is treated as a study chamber with summary, verses, concepts, and layered interpretation."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {book.chapters.map((chapter) => (
              <ChapterCard key={chapter.number} bookSlug={book.slug} chapter={chapter} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
