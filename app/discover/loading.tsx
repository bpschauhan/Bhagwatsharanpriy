import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function DiscoverLoading() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="surface-calm min-h-40 rounded-lg p-6">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-5 h-6 w-2/3 rounded bg-muted" />
              <div className="mt-4 h-4 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
