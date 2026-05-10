import Image from "next/image";
import { ArrowRight, BookOpen, Compass, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { MotionDiv } from "@/components/animations/motion-div";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ShlokaDemo } from "@/components/shloka/shloka-demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WisdomTreePreview } from "@/components/wisdom-tree/wisdom-tree-preview";

const learningPaths = [
  {
    title: "Learn Gita",
    description: "Study timeless teachings through context, verse, meaning, and reflection.",
    icon: BookOpen,
  },
  {
    title: "Learn Meditation",
    description: "Build a gentle inner practice with clarity, patience, and self-observation.",
    icon: Leaf,
  },
  {
    title: "Learn Dharma",
    description: "Explore duty, conduct, compassion, and truth in everyday life.",
    icon: Compass,
  },
  {
    title: "Learn Sanskrit Basics",
    description: "Read sacred vocabulary with simple foundations and careful pronunciation.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-24 sm:pt-32 lg:pb-28">
        <Image
          src="/images/hero-wisdom-texture.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-70 dark:opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-background/70 dark:bg-background/82" />
        <div className="absolute left-1/2 top-16 -z-10 size-[26rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <Container className="relative">
          <MotionDiv
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-inner-calm backdrop-blur">
              <HeartHandshake className="size-4 text-secondary" aria-hidden="true" />
              Nonprofit learning for sincere seekers
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
              Understand Wisdom Deeply
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Study ancient wisdom in the simplest and deepest way possible.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="group">
                Start Learning
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Wisdom
              </Button>
            </div>
          </MotionDiv>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Wisdom map</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              A calm structure for vast knowledge
            </h2>
          </div>
          <WisdomTreePreview />
        </Container>
      </Section>

      <Section className="bg-card/45">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Shloka study</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                Meaning unfolds in layers
              </h2>
              <p className="mt-5 text-muted-foreground">
                Each verse can be explored through sound, word meaning, essence, and contemplative reflection.
              </p>
            </div>
            <ShlokaDemo />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Learning paths</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              Begin where your attention feels alive
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningPaths.map((path) => (
              <Card key={path.title} className="h-full">
                <CardHeader>
                  <path.icon className="mb-5 size-6 text-primary" aria-hidden="true" />
                  <CardTitle>{path.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{path.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="mission" className="bg-wisdom-radial">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="bg-background/75">
              <CardHeader>
                <CardTitle>Daily Wisdom</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="font-serif text-2xl leading-10">
                  “Let understanding become gentle, and let gentleness become strength.”
                </blockquote>
                <p className="mt-6 text-sm text-muted-foreground">
                  A daily reflection space for clear thought, quiet practice, and honest self-study.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/75">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-8 text-muted-foreground">
                  Bhagwatsharanpriy exists to make authentic wisdom easier to approach without reducing its depth. The
                  platform is built around kindness, truth, careful study, and nonprofit access for modern learners.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
