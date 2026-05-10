import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WisdomTree } from "@/components/wisdom-tree/wisdom-tree";

export const metadata: Metadata = {
  title: "Explore Wisdom Tree | Bhagwatsharanpriy",
  description: "Explore an interactive wisdom tree connecting Vedas, Upanishads, Bhagavad Gita, Yoga, Vedanta, Sankhya, Tantra, Darshanas, and core concepts.",
  openGraph: {
    title: "Explore Wisdom Tree | Bhagwatsharanpriy",
    description: "A calm interactive knowledge graph for seeing how wisdom traditions connect.",
    type: "website",
  },
};

export default function ExplorePage() {
  return (
    <>
      <Section className="bg-wisdom-radial pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <Badge>Interactive wisdom universe</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              Everything is connected
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
              Open one node, follow one relationship, and watch the map become understandable without becoming noisy.
            </p>
            <Link
              href="/concepts"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore concepts
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <WisdomTree />
        </Container>
      </Section>

      <Section className="bg-card/45">
        <Container>
          <SectionHeader
            eyebrow="How to read the map"
            title="Relationships are shown gently"
            description="The graph opens progressively. Scripture, concepts, schools, and practices are visually distinct, while the side panel explains the selected relationship in plain language."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Click a node to expand nearby knowledge.",
              "Use the breadcrumb to return to the larger context.",
              "Open a study page when a node has deeper content.",
            ].map((item) => (
              <Card key={item}>
                <CardContent className="flex gap-3 p-5">
                  <Sparkles className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
