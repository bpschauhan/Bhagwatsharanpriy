"use client";

import { useActionState } from "react";
import { signInWithCredentials, type SignInState } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: SignInState = {
  ok: true,
  message: "",
};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(signInWithCredentials, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="focus-ring-calm rounded-md border border-border bg-background px-3 py-3 text-sm outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="focus-ring-calm rounded-md border border-border bg-background px-3 py-3 text-sm outline-none"
        />
      </label>
      {!state.ok ? (
        <p className="rounded-md border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-foreground" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
