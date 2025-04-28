import NextAuth from "next-auth";

// Расширяем типы NextAuth для поддержки user.id

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // любые другие поля
    }
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
} 