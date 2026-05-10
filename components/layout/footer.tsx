import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-8">
      <Container className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Bhagwatsharanpriy</p>
        <p>Nonprofit wisdom learning with truth, kindness, and depth.</p>
      </Container>
    </footer>
  );
}
