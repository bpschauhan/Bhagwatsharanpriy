import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
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
  books,
  getBookBySlug,
  getChapterByNumber,
  getConceptsForVerse,
  getSourcesForVerse,
  getVerseByNumber,
} from "@/lib/content/gita";

type VersePageProps = {
  params: Promise<{ slug: string; chapter: string; verse: string }>;
};

export function generateStaticParams() {
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
  const book = getBookBySlug(slug);
  const currentChapter = getChapterByNumber(slug, Number(chapter));
  const currentVerse = getVerseByNumber(slug, Number(chapter), Number(verse));

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
  const book = getBookBySlug(slug);
  const currentChapter = getChapterByNumber(slug, Number(chapter));
  const currentVerse = getVerseByNumber(slug, Number(chapter), Number(verse));

  if (!book || !currentChapter || !currentVerse) {
    notFound();
  }

  const concepts = getConceptsForVerse(book, currentVerse);
  const sources = getSourcesForVerse(book, currentVerse);
  const reference = `${book.title} ${currentChapter.number}.${currentVerse.number}`;

  return (
    <>
      <div className="sticky top-0 z-40 h-1 bg-muted/60">
        <div className="h-full w-2/5 bg-primary" />
      </div>

      <Section className="section-lit pt-24 sm:pt-28">
        <Container className="max-w-4xl">
          <div className="mb-7 flex flex-wrap gap-2">
            <Badge>{book.title}</Badge>
            <Badge variant="outline">Chapter {currentChapter.number}</Badge>
            <Badge variant="outline">Verse {currentVerse.number}</Badge>
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{reference}</h1>
          <p className="mt-5 leading-8 text-muted-foreground">
            Scripture first, interpretation second. Move from simple meaning into deeper layers at your own pace.
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,760px)_260px] lg:items-start">
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <nav className="surface-calm rounded-lg p-4 text-sm" aria-label="Verse sections">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Reading path</p>
                {["Verse", "Word meaning", "Layers", "Practice", "Commentary", "Sources"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="block rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    {item}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="reading-measure space-y-8">
              <section id="verse" className="scroll-mt-24">
                <VerseDisplay verse={currentVerse} reference={reference} />
              </section>

            <Card id="word-meaning" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Word-by-word meaning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">{currentVerse.wordByWord}</p>
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
                  <p className="leading-8 text-muted-foreground">{currentVerse.practicalApplication}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Philosophy insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-8 text-muted-foreground">{currentVerse.philosophyInsight}</p>
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

            <section id="commentary" aria-labelledby="commentary" className="scroll-mt-24">
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
                    <li key={source.slug} className="leading-7 text-muted-foreground">
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

            <Card className="bg-wisdom-layered">
              <CardHeader>
                <CardTitle>Parallel teachings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">
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
            </article>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Side annotations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Focus mode:</span> scripture remains visually primary; interpretation is staged below it.</p>
                  <p><span className="font-medium text-foreground">Practice connection:</span> apply the teaching as a small observation before turning it into a conclusion.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inline references</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {sources.slice(0, 3).map((source) => (
                    <a key={source.slug} href="#sources" className="block rounded-md border border-border bg-background/60 p-3 transition-colors hover:border-primary/45">
                      <span className="font-medium">{source.title}</span>
                      <span className="mt-1 block text-muted-foreground">{source.citation}</span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
