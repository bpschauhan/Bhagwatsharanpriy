import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Unauthorized | Bhagwatsharanpriy",
};

export default function UnauthorizedPage() {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Access is restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-8 text-foreground/72">
              Your account does not have permission to open this internal workspace.
            </p>
            <Link href="/" className="mt-5 inline-flex text-sm font-medium text-primary hover:underline">
              Return to the public library
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
