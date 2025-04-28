import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions) as Session | null;

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Первым делом найдем пользователя по email
  if (!session.user.email) {
    return res.status(400).json({ error: 'User email is missing in session' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // GET запрос - получение истории тренировок
  if (req.method === 'GET') {
    try {
      const workoutHistory = await prisma.workoutHistory.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        include: { exercises: true }
      });
      
      return res.status(200).json(workoutHistory);
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch workout history',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // POST запрос - добавление новой тренировки в историю
  if (req.method === 'POST') {
    try {
      const { date, programId, programName, workoutId, workoutName, exercises } = req.body;
      
      if (!date || !exercises || !Array.isArray(exercises)) {
        return res.status(400).json({ error: 'Invalid workout data' });
      }

      // Создаем новую запись истории тренировки
      const workout = await prisma.workoutHistory.create({
        data: {
          userId: user.id,
          date: new Date(date),
          programId,
          programName,
          workoutId,
          workoutName,
          exercises: {
            create: exercises.map((ex: any) => ({
              exerciseId: ex.exerciseId || ex.id,
              name: ex.name || ex.exercise?.name,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              duration: ex.duration,
              restTime: ex.restTime,
              muscleGroups: ex.muscleGroups || ex.exercise?.muscleGroups || [],
              note: ex.note
            }))
          }
        },
        include: {
          exercises: true
        }
      });
      
      return res.status(200).json({ 
        success: true, 
        workout 
      });
    } catch (error) {
      console.error('Error saving workout history:', error);
      return res.status(500).json({ 
        error: 'Failed to save workout history', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  
  // DELETE запрос - удаление тренировки из истории
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid workout ID' });
      }
      
      // Проверяем, что тренировка принадлежит пользователю
      const workout = await prisma.workoutHistory.findFirst({
        where: { 
          id: id,
          userId: user.id 
        }
      });
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found or access denied' });
      }
      
      // Удаляем тренировку
      await prisma.workoutHistory.delete({
        where: { id: id }
      });
      
      return res.status(200).json({ 
        success: true
      });
    } catch (error) {
      console.error('Error deleting workout history:', error);
      return res.status(500).json({ 
        error: 'Failed to delete workout history', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 