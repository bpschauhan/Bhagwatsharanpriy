import NextAuth from "next-auth";
import { env } from "@/lib/env";

export const { auth: edgeAuth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: env.AUTH_SECRET,
  trustHost: env.AUTH_TRUST_HOST === "true",
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.active = token.active;
      }

      return session;
    },
  },
});
