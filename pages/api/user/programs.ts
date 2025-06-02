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

  if (!session.user.email) {
    return res.status(400).json({ error: 'User email is missing in session' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // GET: получить все программы пользователя
  if (req.method === 'GET') {
    try {
      const programs = await prisma.program.findMany({
        where: { userId: user.id },
        include: { workouts: { include: { exercises: true } } }
      });
      return res.status(200).json(programs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch programs', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // POST: создать новую программу
  if (req.method === 'POST') {
    try {
      const { name, description, workouts, exercises, ...rest } = req.body;
      const program = await prisma.program.create({
        data: {
          name,
          description,
          userId: user.id,
          ...rest,
          workouts: {
            create: workouts?.map((w: any) => ({
              name: w.name,
              exercises: {
                create: w.exercises?.map((ex: any) => ({
                  exerciseId: ex.exerciseId,
                  sets: ex.sets,
                  reps: ex.reps,
                  weight: ex.weight,
                  duration: ex.duration,
                  restTime: ex.restTime
                })) || []
              }
            })) || []
          }
        },
        include: { workouts: { include: { exercises: true } } }
      });
      return res.status(201).json(program);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create program', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // PUT: обновить программу
  if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;
      const program = await prisma.program.update({
        where: { id },
        data,
        include: { workouts: { include: { exercises: true } } }
      });
      return res.status(200).json(program);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update program', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // DELETE: удалить программу
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await prisma.program.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete program', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 