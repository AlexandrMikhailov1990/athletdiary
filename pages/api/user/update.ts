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

  if (req.method === 'POST') {
    try {
      if (!session.user.email) {
        return res.status(400).json({ error: 'User email is missing in session' });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: req.body.name,
          birthDate: req.body.birthDate ? new Date(req.body.birthDate) : null,
          gender: req.body.gender || null,
          city: req.body.city || null,
          goals: req.body.goals || null,
          bio: req.body.bio || null,
        },
      });
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user profile', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 