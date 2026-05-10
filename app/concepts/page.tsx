import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Search } from "lucide-react";
import { ConceptGraph } from "@/components/wisdom-tree/concept-graph";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConceptProfiles } from "@/lib/queries/concepts";

export const metadata: Metadata = {
  title: "Concepts | Bhagwatsharanpriy",
  description: "Explore core wisdom concepts and how they connect across scripture, philosophy, and practice.",
  openGraph: {
    title: "Concepts | Bhagwatsharanpriy",
    description: "A calm concept graph for studying relationships between wisdom ideas.",
    type: "website",
  },
};

export default async function ConceptsPage() {
  const conceptProfiles = await getConceptProfiles();

  return (
    <>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <SectionHeader
            eyebrow="Concept graph"
            title="Study ideas as living relationships"
            description="Concepts become easier when they are not isolated definitions. Each one opens into verses, books, schools, practices, and neighboring ideas."
          />
          <div className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground">
            <Search className="size-4" aria-hidden="true" />
            <span className="text-sm">Search concepts such as Karma, Dharma, Atma, Samatva</span>
          </div>
        </Container>
      </Section>

      <Section className="bg-card/45 pt-0">
        <Container>
          <ConceptGraph />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conceptProfiles.map((concept) => (
              <Link key={concept.slug} href={`/concepts/${concept.slug}` as Route} className="group block">
                <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <CardHeader>
                    <Badge variant="outline">{concept.category}</Badge>
                    <CardTitle className="mt-4">{concept.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-muted-foreground">{concept.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      Open concept
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
