import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function VerseLoading() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container className="max-w-4xl">
        <div className="surface-calm rounded-lg p-6 sm:p-10">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="mt-8 h-8 w-2/3 rounded bg-muted" />
          <div className="mt-8 space-y-4">
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-5 w-5/6 rounded bg-muted" />
            <div className="h-5 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
