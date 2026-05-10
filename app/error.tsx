"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="pt-24 sm:pt-28">
      <Container className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Something interrupted the reading path</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-8 text-foreground/72">
              The platform could not complete this request. Please try again, or return to the library.
            </p>
            <button
              type="button"
              className="focus-ring-calm mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={reset}
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
