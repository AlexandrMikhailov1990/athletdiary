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

  // GET запрос - получение избранных программ
  if (req.method === 'GET') {
    return res.status(200).json({ 
      favorites: user.favorites || [] 
    });
  }
  
  // POST запрос - обновление избранных программ
  if (req.method === 'POST') {
    try {
      const { favorites } = req.body;
      
      if (!Array.isArray(favorites)) {
        return res.status(400).json({ error: 'Invalid favorites format. Array expected.' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          favorites: favorites
        },
      });
      
      return res.status(200).json({ 
        success: true, 
        favorites: updatedUser.favorites 
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
      return res.status(500).json({ 
        error: 'Failed to update favorites', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 