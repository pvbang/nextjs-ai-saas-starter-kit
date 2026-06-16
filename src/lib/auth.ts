import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/prisma";

/**
 * Auth.js (NextAuth v5) configuration.
 * - Database sessions via Prisma adapter.
 * - Email magic-link sign-in (passwordless) + optional GitHub OAuth.
 * - `session.user.id` is augmented so server code can read the user id.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  providers: [
    Nodemailer({
      // A non-empty server string keeps the provider valid at build time.
      // Override EMAIL_SERVER / EMAIL_FROM in your environment for real sending.
      server:
        process.env.EMAIL_SERVER ||
        "smtp://user:pass@localhost:587",
      from: process.env.EMAIL_FROM || "noreply@example.com",
    }),
    ...(process.env.AUTH_GITHUB_ID
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // expose subscription state to the client
        session.user.stripeCurrentPeriodEnd = (
          user as { stripeCurrentPeriodEnd?: Date | null }
        ).stripeCurrentPeriodEnd;
      }
      return session;
    },
  },
});
