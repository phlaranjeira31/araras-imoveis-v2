import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!email || !password || !adminEmail || !adminPassword) return null;

        if (email !== adminEmail) return null;
        if (password !== adminPassword) return null;

        return {
          id: "admin",
          email: adminEmail,
          role: "admin",
        } as any;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = (token as any).role;
      return session;
    },
  },

  pages: { signIn: "/login" },
};


