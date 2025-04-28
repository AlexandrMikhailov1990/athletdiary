import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Метод не разрешён' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Все поля обязательны' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Неверный пароль' });

  // Для простоты возвращаем данные пользователя (в реальном проекте лучше использовать JWT или сессии)
  res.status(200).json({ id: user.id, email: user.email, name: user.name });
} 