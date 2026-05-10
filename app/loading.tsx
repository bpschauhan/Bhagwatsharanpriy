import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function Loading() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container>
        <div className="surface-calm max-w-3xl rounded-lg p-6">
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Preparing library</p>
          <div className="mt-5 space-y-3">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
