import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ConceptGraph } from "@/components/wisdom-tree/concept-graph";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConceptProfile, getConceptProfiles } from "@/lib/queries/concepts";
import { conceptRouteParamsSchema } from "@/lib/validation/content";

type ConceptPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const conceptProfiles = await getConceptProfiles();
  return conceptProfiles.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = conceptRouteParamsSchema.safeParse({ slug });
  const concept = parsed.success ? await getConceptProfile(parsed.data.slug) : undefined;

  if (!concept) {
    return {};
  }

  return {
    title: `${concept.title} | Bhagwatsharanpriy Concepts`,
    description: concept.summary,
    openGraph: {
      title: `${concept.title} | Bhagwatsharanpriy`,
      description: concept.summary,
      type: "article",
    },
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const parsed = conceptRouteParamsSchema.safeParse({ slug });

  if (!parsed.success) {
    notFound();
  }

  const concept = await getConceptProfile(parsed.data.slug);

  if (!concept) {
    notFound();
  }

  return (
    <>
      <Section className="bg-wisdom-radial pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <Badge>{concept.category}</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{concept.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">{concept.summary}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Card>
              <CardHeader>
                <CardTitle>Concept explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">{concept.explanation}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Scientific and psychological parallels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {concept.parallels.map((parallel) => (
                    <div key={parallel.title}>
                      <p className="font-medium">{parallel.title}</p>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">{parallel.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <DetailList
              title="Definitions in context"
              items={(concept.definitions ?? []).map((item) => ({
                title: item.title,
                meta: [item.school, item.tradition, item.sourceLabel].filter(Boolean).join(" / "),
                body: `${item.definition} ${item.context}`,
              }))}
              empty="Definitions will expand as verified sources are added."
            />
            <DetailList
              title="Tradition differences"
              items={(concept.traditionViews ?? []).map((item) => ({
                title: item.title,
                meta: [item.school, item.tradition].filter(Boolean).join(" / "),
                body: `${item.positionSummary} ${item.nuance}${item.differsFrom ? ` Difference: ${item.differsFrom}` : ""}`,
              }))}
              empty="Tradition-specific interpretations are awaiting review."
            />
            <DetailList
              title="Misconceptions"
              items={(concept.misconceptions ?? []).map((item) => ({
                title: item.title,
                body: `${item.correction} ${item.whyItMatters}`,
              }))}
              empty="Misconception notes will appear after review."
            />
          </div>
        </Container>
      </Section>

      <Section className="bg-card/45">
        <Container>
          <SectionHeader
            eyebrow="Relationship visualization"
            title={`${concept.title} in the wisdom map`}
            description="The graph keeps the selected concept in focus and shows nearby scriptures, schools, and neighboring concepts."
          />
          <ConceptGraph focusNodeId={concept.graphFocusNodeId} />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <RelationshipList title="Related verses" items={concept.relatedVerses} empty="Verse links will expand as the scripture library grows." />
            <RelationshipList title="Related books" items={concept.relatedBooks} empty="Book links will expand as the library grows." />
            <Card>
              <CardHeader>
                <CardTitle>Related philosophies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {concept.relatedPhilosophies.map((item) => (
                  <div key={item.title}>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <DetailList
              title="Practice notes"
              items={(concept.practices ?? []).map((item) => ({
                title: item.title,
                body: `${item.description}${item.caution ? ` Caution: ${item.caution}` : ""}`,
              }))}
              empty="Practice notes will remain modest and source-aware."
            />
            <DetailList
              title="Historical evolution"
              items={(concept.historicalEvolution ?? []).map((item) => ({
                title: item.period,
                body: item.description,
              }))}
              empty="Historical notes are awaiting source review."
            />
            <DetailList
              title="Semantic neighbors"
              items={(concept.semanticNeighbors ?? []).map((item) => ({
                title: item.label,
                meta: item.relationshipType.replaceAll("_", " ").toLowerCase(),
                body: `${item.explanation}${item.caution ? ` Note: ${item.caution}` : ""}`,
                href: item.href,
              }))}
              empty="Meaningful neighboring concepts will appear as relationships are verified."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function DetailList({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ title: string; meta?: string; body: string; href?: string }>;
  empty: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const content = (
              <>
                <span className="font-medium">{item.title}</span>
                {item.meta ? <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.meta}</span> : null}
                <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.body}</span>
              </>
            );

            return item.href ? (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href as Route}
                className="group block rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/45"
              >
                {content}
              </Link>
            ) : (
              <div key={item.title} className="rounded-lg border border-border bg-background/60 p-4">
                {content}
              </div>
            );
          })
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RelationshipList({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ title?: string; label?: string; href: string; note: string }>;
  empty: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={`${item.href}-${item.title ?? item.label}`}
              href={item.href as Route}
              className="group block rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/45"
            >
              <span className="flex items-center justify-between gap-3 font-medium">
                {item.title ?? item.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="mt-2 block text-sm leading-7 text-muted-foreground">{item.note}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}
