import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterCard } from "@/components/books/chapter-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { books, getBookBySlug } from "@/lib/content/gita";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

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
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

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
