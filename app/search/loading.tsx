import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function SearchLoading() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container>
        <div className="surface-calm rounded-lg p-6">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="mt-5 h-8 w-2/3 rounded bg-muted" />
          <div className="mt-8 grid gap-3">
            <div className="h-24 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
