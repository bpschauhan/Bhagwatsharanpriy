import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { ReadingExperienceFrame } from "@/components/books/reading-experience";
import { ChapterVerseSidebar, MobileVerseDock, VerseNavigation } from "@/components/books/scripture-navigation";
import { SaveReadingPosition } from "@/components/books/reading-state";
import { CommentaryTabs } from "@/components/shloka/commentary-tabs";
import { ConceptPill } from "@/components/shloka/concept-pill";
import { MeaningAccordion } from "@/components/shloka/meaning-accordion";
import { VerseDisplay } from "@/components/shloka/verse-display";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBook,
  getBooks,
  getChapter,
  getConceptsForVerseContent,
  getSourcesForVerseContent,
  getVerse,
  getVersePositionFromContent,
} from "@/lib/queries/books";
import { verseRouteParamsSchema } from "@/lib/validation/content";

type VersePageProps = {
  params: Promise<{ slug: string; chapter: string; verse: string }>;
};

export async function generateStaticParams() {
  const books = await getBooks();
  return books.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.verses.map((verse) => ({
        slug: book.slug,
        chapter: String(chapter.number),
        verse: String(verse.number),
      })),
    ),
  );
}

export async function generateMetadata({ params }: VersePageProps): Promise<Metadata> {
  const { slug, chapter, verse } = await params;
  const parsed = verseRouteParamsSchema.safeParse({ slug, chapter, verse });

  if (!parsed.success) {
    return {};
  }

  const book = await getBook(parsed.data.slug);
  const currentChapter = await getChapter(parsed.data.slug, parsed.data.chapter);
  const currentVerse = await getVerse(parsed.data.slug, parsed.data.chapter, parsed.data.verse);

  if (!book || !currentChapter || !currentVerse) {
    return {};
  }

  return {
    title: `${book.title} ${currentChapter.number}.${currentVerse.number} | Bhagwatsharanpriy`,
    description: currentVerse.meaningLayers.find((layer) => layer.type === "SIMPLE")?.body ?? currentChapter.summary,
    openGraph: {
      title: `${book.title} ${currentChapter.number}.${currentVerse.number}`,
      description: currentVerse.practicalApplication,
      type: "article",
    },
  };
}

export default async function VersePage({ params }: VersePageProps) {
  const { slug, chapter, verse } = await params;
  const parsed = verseRouteParamsSchema.safeParse({ slug, chapter, verse });

  if (!parsed.success) {
    notFound();
  }

  const book = await getBook(parsed.data.slug);
  const currentChapter = await getChapter(parsed.data.slug, parsed.data.chapter);
  const currentVerse = await getVerse(parsed.data.slug, parsed.data.chapter, parsed.data.verse);

  if (!book || !currentChapter || !currentVerse) {
    notFound();
  }

  const concepts = await getConceptsForVerseContent(book.slug, currentChapter.number, currentVerse.number);
  const sources = await getSourcesForVerseContent(book.slug, currentChapter.number, currentVerse.number);
  const reference = `${book.title} ${currentChapter.number}.${currentVerse.number}`;
  const position = await getVersePositionFromContent(book.slug, currentChapter.number, currentVerse.number);
  const chapterHref = `/books/${book.slug}/chapters/${currentChapter.number}`;
  const chapterProgress = position?.chapterProgress ?? 0;
  const verseIndex = position?.verseIndex ?? 0;

  return (
    <>
      <SaveReadingPosition
        bookTitle={book.title}
        bookSlug={book.slug}
        chapterNumber={currentChapter.number}
        chapterTitle={currentChapter.title}
        verseNumber={currentVerse.number}
        href={`/books/${book.slug}/chapters/${currentChapter.number}/verses/${currentVerse.number}`}
        label={reference}
        progress={chapterProgress}
      />
      <div className="sticky top-0 z-40 h-1 bg-muted">
        <div className="h-full bg-primary" style={{ width: `${chapterProgress}%` }} />
      </div>

      <Section className="pt-24 sm:pt-28">
        <Container className="max-w-4xl">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href={`/books/${book.slug}` as Route} className="hover:text-foreground">{book.title}</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href={chapterHref as Route} className="hover:text-foreground">Chapter {currentChapter.number}</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="font-medium text-foreground">Verse {currentVerse.number}</span>
          </nav>
          <div className="mb-7 flex flex-wrap gap-2">
            <Badge>{book.title}</Badge>
            <Badge variant="outline">Chapter {currentChapter.number}</Badge>
            <Badge variant="outline">Verse {currentVerse.number}</Badge>
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{reference}</h1>
          <p className="mt-5 leading-8 text-foreground/78">
            Chapter {currentChapter.number} / Verse {verseIndex + 1} of {currentChapter.verses.length}. Read the verse, then move through meaning and commentary without losing your place.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted" aria-label={`Chapter progress ${Math.round(chapterProgress)} percent`}>
            <div className="h-full rounded-full bg-primary" style={{ width: `${chapterProgress}%` }} />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="pb-16 lg:pb-0">
          <ReadingExperienceFrame
            sidebar={
              <ChapterVerseSidebar bookSlug={book.slug} chapter={currentChapter} currentVerseNumber={currentVerse.number} />
            }
          >
            <article className="reading-measure space-y-8">
              <VerseNavigation previous={position?.previous} next={position?.next} chapterHref={chapterHref} keyboard />
              <section id="verse" className="scroll-mt-24">
                <VerseDisplay verse={currentVerse} reference={reference} />
              </section>

            <Card id="word-meaning" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Word-by-word meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="reading-copy text-foreground/78">{currentVerse.wordByWord}</p>
              </CardContent>
            </Card>

            <section id="layers" aria-labelledby="meaning-layers" className="scroll-mt-24">
              <SectionHeader
                eyebrow="Progressive depth"
                title="Meaning layers"
                description="These layers are interpretations for study. They are separated from the Sanskrit verse so the source text stays clear."
                className="mb-5"
              />
              <MeaningAccordion layers={currentVerse.meaningLayers} />
            </section>

            <div id="practice" className="grid scroll-mt-24 gap-5 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Practical application</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="reading-copy text-foreground/78">{currentVerse.practicalApplication}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Philosophy insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="reading-copy text-foreground/78">{currentVerse.philosophyInsight}</p>
                </CardContent>
              </Card>
            </div>

            <Card id="related-concepts" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Related concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((concept) => (
                    <ConceptPill key={concept.slug} concept={concept} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <section id="commentary" aria-labelledby="commentary" className="reading-commentary scroll-mt-24">
              <SectionHeader
                eyebrow="Commentary"
                title="Study notes and interpretive views"
                description="Commentary helps understanding, but it is not the same category as scripture."
                className="mb-5"
              />
              <CommentaryTabs commentaries={currentVerse.commentaries} />
            </section>

            <Card id="sources" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Source references</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {sources.map((source) => (
                    <li key={source.slug} className="leading-7 text-foreground/72">
                      <span className="font-medium text-foreground">{source.title}</span>
                      <span className="block text-sm">{source.citation}</span>
                      {source.url ? (
                        <a className="text-sm text-primary hover:underline" href={source.url}>
                          {source.url}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {currentVerse.relationships && currentVerse.relationships.length > 0 ? (
              <Card id="cross-scripture" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle>Cross-scripture relationships</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentVerse.relationships.map((relationship) => (
                    <div
                      key={`${relationship.targetLabel}-${relationship.relationshipType}`}
                      className="rounded-lg border border-border bg-background/60 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{relationship.relationshipType.replaceAll("_", " ").toLowerCase()}</Badge>
                        {relationship.school ? <Badge variant="muted">{relationship.school}</Badge> : null}
                        {relationship.confidenceLevel ? (
                          <Badge variant="outline">{relationship.confidenceLevel}% reviewed</Badge>
                        ) : null}
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-semibold">{relationship.targetLabel}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{relationship.targetTextTitle}</p>
                      <p className="mt-3 leading-7 text-foreground/76">{relationship.explanation}</p>
                      {relationship.philosophicalContext ? (
                        <p className="mt-3 border-l-2 border-primary/40 pl-4 text-sm leading-7 text-foreground/68">
                          {relationship.philosophicalContext}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-primary/25 bg-card">
              <CardHeader>
                <CardTitle>Parallel teachings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="reading-copy text-foreground/78">
                  Study this verse beside teachings connected by concept, practice, and philosophical theme.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {concepts.map((concept) => (
                    <Link key={concept.slug} href={`/concepts/${concept.slug}` as Route} className="rounded-full border border-border bg-background/70 px-3 py-2 text-sm transition-colors hover:border-primary/45">
                      {concept.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <VerseNavigation previous={position?.previous} next={position?.next} chapterHref={chapterHref} className="mb-2" />
            </article>
          </ReadingExperienceFrame>
        </Container>
      </Section>
      <MobileVerseDock previous={position?.previous} next={position?.next} chapterHref={chapterHref} />
    </>
  );
}
