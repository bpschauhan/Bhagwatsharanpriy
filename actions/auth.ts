"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/validation/auth";

export type SignInState = {
  ok: boolean;
  message: string;
};

export async function signInWithCredentials(_state: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid email and password.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "The email or password was not accepted.",
      };
    }

    throw error;
  }

  return {
    ok: true,
    message: "Signed in.",
  };
}

export async function signOutCurrentUser() {
  await signOut({ redirectTo: "/" });
}
