import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Проверяем аутентификацию пользователя
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }
  
  const userId = parseInt(session.user.id as string, 10);

  if (req.method === 'GET') {
    try {
      // Получаем историю тренировок пользователя
      const workoutHistory = await prisma.workoutHistory.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      return res.status(200).json(workoutHistory);
    } catch (error) {
      console.error("Ошибка при получении истории тренировок:", error);
      return res.status(500).json({ message: "Ошибка сервера при получении истории тренировок" });
    }
  } else if (req.method === 'POST') {
    try {
      const workoutData = req.body;
      
      // Добавляем ID пользователя
      workoutData.userId = userId;
      
      // Сохраняем историю тренировки в базу данных
      const savedWorkout = await prisma.workoutHistory.create({
        data: workoutData
      });
      
      return res.status(200).json({ success: true, id: savedWorkout.id });
    } catch (error) {
      console.error("Ошибка при сохранении истории тренировки:", error);
      return res.status(500).json({ message: "Ошибка сервера при сохранении истории тренировки" });
    }
  } else {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }
} 