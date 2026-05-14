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
  title: "Explore Sanatana Dharma Archive | Bhagwatsharanpriy",
  description: "Explore a progressive archive of Shruti, Smriti, Darshanas, Sampradayas, Yogas, Practices, Concepts, and Acharyas.",
  openGraph: {
    title: "Explore Sanatana Dharma Archive | Bhagwatsharanpriy",
    description: "A calm progressive knowledge archive for unfolding scripture, philosophy, practice, concepts, lineages, and teachers.",
    type: "website",
  },
};

export default function ExplorePage() {
  return (
    <>
      <Section className="bg-wisdom-radial pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <Badge>Civilization archive</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              Sanatana Dharma unfolds layer by layer
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
              Begin with the root, enter Shruti or Smriti, and let scriptures, philosophies, practices, concepts, lineages, and teachers reveal themselves in sequence.
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
            title="Knowledge unfolds progressively"
            description="The archive reveals only the current layer, the path that brought you there, and a few meaningful relationships for context."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Start from Sanatana Dharma, then enter one knowledge world.",
              "Use the breadcrumb to return to earlier layers.",
              "Open deeper study pages when a topic has dedicated content.",
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
