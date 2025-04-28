import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Метод не разрешён' });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ message: 'Не авторизован' });

  const { name, birthDate, gender, city, goals, bio } = req.body;

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        city,
        goals,
        bio,
      },
    });
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
} 