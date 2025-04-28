import NextAuth from "next-auth";

// Расширяем типы NextAuth для поддержки user.id

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      birthDate?: string | null;
      gender?: string | null;
      city?: string | null;
      goals?: string | null;
      bio?: string | null;
      favorites?: string[];
    }
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    birthDate?: string | null;
    gender?: string | null;
    city?: string | null;
    goals?: string | null;
    bio?: string | null;
    favorites?: string[];
  }
} 