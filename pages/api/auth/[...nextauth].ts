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
        
        // Возвращаем только строковые и примитивные данные для токена
        return {
          id: String(user.id),
          email: user.email,
          name: user.name || ""
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    // Первый callback: преобразовываем информацию из authorize() в JWT токен
    async jwt({ token, user }) {
      // При первом входе добавляем данные пользователя в токен
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.userId = user.id; // Сохраняем id явно как userId
      }
      return token;
    },
    
    // Второй callback: создаем объект сессии из JWT токена
    async session({ session, token }: { session: Session; token: JWT }) {
      // Гарантируем, что email всегда доступен
      if (token.email) {
        session.user = session.user || {};
        session.user.email = token.email as string;
        session.user.name = token.name as string || '';
        
        // Добавляем userId из токена напрямую
        if (token.userId) {
          session.user.id = token.userId as string;
        }
        
        // Загружаем дополнительные данные пользователя по email
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
          });
          
          if (dbUser) {
            // Всегда гарантируем, что id доступен
            session.user.id = String(dbUser.id);
            session.user.name = dbUser.name || '';
            session.user.birthDate = dbUser.birthDate ? dbUser.birthDate.toISOString().split('T')[0] : null;
            session.user.gender = dbUser.gender;
            session.user.city = dbUser.city;
            session.user.goals = dbUser.goals;
            session.user.bio = dbUser.bio;
            session.user.favorites = dbUser.favorites;
          }
        } catch (error) {
          console.error("Error loading user data in session callback:", error);
        }
      }
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); 