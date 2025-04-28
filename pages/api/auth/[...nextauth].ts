import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string || token.sub || "";
      }
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = String(dbUser.id);
          session.user.name = dbUser.name;
          session.user.birthDate = dbUser.birthDate ? dbUser.birthDate.toISOString().split('T')[0] : null;
          session.user.gender = dbUser.gender;
          session.user.city = dbUser.city;
          session.user.goals = dbUser.goals;
          session.user.bio = dbUser.bio;
          session.user.favorites = dbUser.favorites;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); 