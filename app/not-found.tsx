import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>That page is not in the archive yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-8 text-foreground/72">
              The library may not contain this text, verse, or concept yet.
            </p>
            <Link href="/books" className="mt-5 inline-flex text-sm font-medium text-primary hover:underline">
              Return to books
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
