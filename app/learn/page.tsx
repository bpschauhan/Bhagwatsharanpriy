import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLearningPaths } from "@/lib/queries/learning-paths";

export const metadata: Metadata = {
  title: "Learning Paths | Bhagwatsharanpriy",
  description: "Gentle scripture-first journeys through concepts, verses, practices, and commentary comparison.",
};

export default async function LearningPathsPage() {
  const paths = await getLearningPaths();

  return (
    <>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <SectionHeader
            eyebrow="Learning paths"
            title="Study in a considered sequence"
            description="Paths gather verses, concepts, comparisons, and practices into quiet journeys. They guide without turning scripture into a checklist."
          />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((path) => (
              <Link key={path.slug} href={`/learn/${path.slug}` as Route} className="group block">
                <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{path.difficulty.toLowerCase()}</Badge>
                      <Badge variant="outline">{path.kind.replaceAll("_", " ").toLowerCase()}</Badge>
                    </div>
                    <CardTitle className="mt-4">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-muted-foreground">{path.summary}</p>
                    {path.guidanceNote ? <p className="mt-4 text-sm leading-6 text-foreground/68">{path.guidanceNote}</p> : null}
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      Open path
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
