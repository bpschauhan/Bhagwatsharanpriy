import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Heart, Layers, Route as RouteIcon, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { RelatedDiscovery } from "@/components/search/related-discovery";
import { TrendingConcepts } from "@/components/search/trending-concepts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conceptProfiles, knowledgeNodes } from "@/lib/content/knowledge-graph";
import { emotionalStates, learningPaths, lifeTopics } from "@/lib/search/discovery";
import { searchKnowledge } from "@/lib/search/search-engine";

export const metadata: Metadata = {
  title: "Discover | Bhagwatsharanpriy",
  description: "Discover wisdom by life topic, emotional state, concept, philosophy, and learning path.",
  openGraph: {
    title: "Discover | Bhagwatsharanpriy",
    description: "A calm discovery universe for related wisdom and meaningful study paths.",
    type: "website",
  },
};

export default function DiscoverPage() {
  const featured = searchKnowledge("karma").peopleAlsoExplore;
  const philosophies = knowledgeNodes.filter((node) =>
    ["vedanta", "sankhya", "yoga", "darshanas", "mimamsa", "nyaya"].includes(node.id),
  );

  return (
    <>
      <Section className="section-lit bg-wisdom-layered pt-24 sm:pt-28">
        <Container>
          <div className="max-w-4xl">
            <Badge>Discovery universe</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              Explore wisdom through the door that is open today
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
              Search is for when you know the word. Discovery is for when you only know the feeling, question, or direction.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Reveal className="grid gap-4 sm:grid-cols-6">
              <SectionHeader
                eyebrow="Featured concepts"
                title="Start with a living idea"
                description="Each concept connects to verses, books, philosophies, practices, and neighboring concepts."
                className="sm:col-span-6"
              />
              {conceptProfiles.slice(0, 4).map((concept, index) => (
                <DiscoveryCard
                  key={concept.slug}
                  title={concept.title}
                  summary={concept.summary}
                  href={`/concepts/${concept.slug}`}
                  icon="spark"
                  label={concept.category}
                  featured={index === 0}
                  wide={index === 0}
                  tall={index === 2}
                />
              ))}
            </Reveal>
            <Reveal className="space-y-5 lg:sticky lg:top-24" delay={0.08}>
              <TrendingConcepts />
              <RelatedDiscovery title="People also explore" items={featured} />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="section-lit bg-card/35">
        <Container>
          <SectionHeader
            eyebrow="Life topic discovery"
            title="Find wisdom by what life is asking"
            description="These are gentle entry points, not diagnoses or fixed prescriptions."
          />
          <Reveal className="grid auto-rows-[minmax(12rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {lifeTopics.map((topic, index) => (
              <DiscoveryCard
                key={topic.slug}
                title={topic.title}
                summary={topic.summary}
                href={`/search?q=${encodeURIComponent(topic.title)}`}
                icon="layers"
                label={`${topic.conceptSlugs.length} concepts`}
                wide={index === 0 || index === 5}
                tall={index === 2}
              />
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="How are you feeling?"
            title="Begin from the inner weather"
            description="The platform can guide a learner from emotion into relevant concepts, verses, and practices."
          />
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emotionalStates.map((state, index) => (
              <DiscoveryCard
                key={state.slug}
                title={state.title}
                summary={state.summary}
                href={`/search?q=${encodeURIComponent(state.title)}`}
                icon="heart"
                label={`${state.verseHrefs.length} verse path`}
                featured={index === 0}
                tall={index === 0}
              />
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section className="section-lit bg-card/35">
        <Container>
          <Reveal className="mb-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-calm rounded-lg p-7 sm:p-8">
              <Badge>Continue exploring</Badge>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">Return to karma, then follow it into samatva</h2>
              <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
                A rotating highlight can later use real exploration history. For now, this gives the library a living editorial rhythm without changing the data model.
              </p>
              <Link href="/concepts/karma" className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                Resume path
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="surface-calm rounded-lg p-7 sm:p-8">
              <Badge variant="outline">Seasonal theme</Badge>
              <h3 className="mt-4 font-serif text-2xl font-semibold">Steadiness in action</h3>
              <p className="mt-3 leading-7 text-muted-foreground">A quiet sequence through dharma, karma, and equanimity for moments that require responsibility without agitation.</p>
            </div>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow="Explore by philosophy" title="Schools as ways of seeing" />
              <div className="space-y-4">
                {philosophies.map((node) => (
                  <DiscoveryCard
                    key={node.id}
                    title={node.title}
                    summary={node.summary}
                    href="/explore"
                    icon="route"
                    label={node.nodeType.replaceAll("_", " ").toLowerCase()}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Learning paths" title="Quiet paths through the library" />
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <DiscoveryCard
                    key={path.title}
                    title={path.title}
                    summary={path.summary}
                    href={path.href}
                    icon="spark"
                    label="guided path"
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function DiscoveryCard({
  title,
  summary,
  href,
  icon,
  label,
  featured = false,
  wide = false,
  tall = false,
}: {
  title: string;
  summary: string;
  href: string;
  icon: "heart" | "layers" | "route" | "spark";
  label: string;
  featured?: boolean;
  wide?: boolean;
  tall?: boolean;
}) {
  const Icon = icon === "heart" ? Heart : icon === "layers" ? Layers : icon === "route" ? RouteIcon : Sparkles;

  return (
    <Link href={href as Route} className={`group block ${wide ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2"} ${featured || tall ? "sm:row-span-2" : ""}`}>
      <Card className={`h-full overflow-hidden transition-transform duration-500 ease-premium group-hover:-translate-y-1 ${featured ? "bg-wisdom-layered" : ""}`}>
        <CardHeader>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <Badge variant="outline">{label}</Badge>
          </div>
          <CardTitle className={featured ? "text-3xl leading-tight" : undefined}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`leading-7 text-muted-foreground ${featured ? "text-base" : "line-clamp-3 text-sm"}`}>{summary}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
            Explore
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
