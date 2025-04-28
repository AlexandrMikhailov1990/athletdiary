import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Метод не разрешён' });

  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: 'Все поля обязательны' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: 'Пользователь уже существует' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, name }
  });

  res.status(201).json({ id: user.id, email: user.email, name: user.name });
} 