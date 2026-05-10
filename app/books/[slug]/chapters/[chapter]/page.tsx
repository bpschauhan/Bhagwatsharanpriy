import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VerseRow } from "@/components/books/verse-row";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { books, getBookBySlug, getChapterByNumber } from "@/lib/content/gita";

type ChapterPageProps = {
  params: Promise<{ slug: string; chapter: string }>;
};

export function generateStaticParams() {
  return books.flatMap((book) =>
    book.chapters.map((chapter) => ({
      slug: book.slug,
      chapter: String(chapter.number),
    })),
  );
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapter } = await params;
  const book = getBookBySlug(slug);
  const currentChapter = getChapterByNumber(slug, Number(chapter));

  if (!book || !currentChapter) {
    return {};
  }

  return {
    title: `${book.title} ${currentChapter.number}: ${currentChapter.title} | Bhagwatsharanpriy`,
    description: currentChapter.summary,
    openGraph: {
      title: `${currentChapter.title} | ${book.title}`,
      description: currentChapter.summary,
      type: "article",
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapter } = await params;
  const book = getBookBySlug(slug);
  const currentChapter = getChapterByNumber(slug, Number(chapter));

  if (!book || !currentChapter) {
    notFound();
  }

  return (
    <>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <Badge>Chapter {currentChapter.number}</Badge>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              {currentChapter.title}
            </h1>
            <p className="mt-5 text-xl leading-9 text-muted-foreground">{currentChapter.summary}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-card/45">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="space-y-5">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-semibold">Chapter overview</h2>
                  <p className="mt-4 leading-8 text-muted-foreground">{currentChapter.overview}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-semibold">Progress</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {currentChapter.verses.length} guided verses available in this study seed.
                  </p>
                  <div className="mt-5 h-2 rounded-full bg-muted">
                    <div className="h-2 w-1/3 rounded-full bg-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <SectionHeader eyebrow="Verse list" title="Study one verse at a time" className="mb-5" />
              <div className="space-y-4">
                {currentChapter.verses.map((verse) => (
                  <VerseRow key={verse.number} bookSlug={book.slug} chapterNumber={currentChapter.number} verse={verse} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
