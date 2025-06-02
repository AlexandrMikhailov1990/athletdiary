import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]";
import prisma from "../../../utils/prisma";
import type { Session } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions) as Session | null;
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.method === "POST") {
    const { date, workoutName, duration, exercises, notes, rating } = req.body;
    
    // Временное решение: добавим информацию о продолжительности в поле notes
    let updatedNotes = notes || '';
    if (duration) {
      updatedNotes = `Продолжительность: ${duration} сек.\n${updatedNotes}`;
    }
    
    const history = await prisma.workoutHistory.create({
      data: {
        userId: Number(session.user.id),
        date: new Date(date),
        workoutName,
        exercises: exercises || [],
        notes: updatedNotes,
        rating,
        programId: null,
        programName: null,
        workoutId: null
      } as any, // Using type assertion to bypass TypeScript error
    });
    return res.status(201).json(history);
  }

  if (req.method === "GET") {
    const history = await prisma.workoutHistory.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { date: "desc" },
    });
    return res.status(200).json(history);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 