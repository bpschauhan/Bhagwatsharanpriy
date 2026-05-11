import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLearningPath, getLearningPaths } from "@/lib/queries/learning-paths";
import { slugSchema } from "@/lib/validation/content";

type LearningPathPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const paths = await getLearningPaths();
  return paths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: LearningPathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = slugSchema.safeParse(slug);
  const path = parsed.success ? await getLearningPath(parsed.data) : undefined;

  if (!path) {
    return {};
  }

  return {
    title: `${path.title} | Bhagwatsharanpriy Learning Path`,
    description: path.summary,
  };
}

export default async function LearningPathPage({ params }: LearningPathPageProps) {
  const { slug } = await params;
  const parsed = slugSchema.safeParse(slug);

  if (!parsed.success) {
    notFound();
  }

  const path = await getLearningPath(parsed.data);

  if (!path) {
    notFound();
  }

  return (
    <>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <Badge>{path.difficulty.toLowerCase()}</Badge>
              <Badge variant="outline">{path.kind.replaceAll("_", " ").toLowerCase()}</Badge>
              {path.school ? <Badge variant="outline">{path.school}</Badge> : null}
            </div>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{path.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">{path.summary}</p>
            {path.guidanceNote ? <p className="mt-5 border-l-2 border-primary/45 pl-4 leading-8 text-foreground/70">{path.guidanceNote}</p> : null}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            {path.steps.map((step, index) => (
              <Card key={`${path.slug}-${step.title}`}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    <Badge variant="muted">{step.kind.replaceAll("_", " ").toLowerCase()}</Badge>
                    {step.verseLabel ? <Badge variant="outline">{step.verseLabel}</Badge> : null}
                  </div>
                  <h2 className="mt-4 font-serif text-2xl font-semibold">{step.title}</h2>
                  <p className="mt-3 leading-8 text-muted-foreground">{step.summary}</p>
                  {step.contemplationPrompt ? (
                    <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm leading-7 text-foreground/70">
                      {step.contemplationPrompt}
                    </p>
                  ) : null}
                  {step.practiceNote ? <p className="mt-3 text-sm leading-7 text-foreground/68">{step.practiceNote}</p> : null}
                  {step.href ? (
                    <Link
                      href={step.href as Route}
                      className="mt-5 inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:border-primary/45"
                    >
                      Continue study
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
