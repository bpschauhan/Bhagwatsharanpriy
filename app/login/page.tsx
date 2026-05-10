import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in | Bhagwatsharanpriy",
  description: "Protected contributor access for Bhagwatsharanpriy.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user?.active) {
    redirect((callbackUrl || "/admin") as Route);
  }

  return (
    <Section className="pt-24 sm:pt-28">
      <Container className="max-w-xl">
        <Card>
          <CardHeader>
            <Badge>Contributor access</Badge>
            <CardTitle className="mt-4 text-3xl">Sign in to the internal library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 leading-7 text-foreground/72">
              Access is currently invitation-only for editors, reviewers, and administrators.
            </p>
            <LoginForm callbackUrl={callbackUrl || "/admin"} />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
