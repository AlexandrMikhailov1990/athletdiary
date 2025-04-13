import type { NextApiRequest, NextApiResponse } from 'next';
import { KETTLEBELL_DAILY_PROGRAM } from '../../models/KettlebellProgram';

type ResponseData = {
  success: boolean;
  message: string;
  updated?: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Метод не поддерживается' 
    });
  }

  // Здесь мы не можем использовать localStorage напрямую, так как это серверный код
  // Этот API маршрут будет только возвращать актуальную версию программы,
  // а обновление в localStorage будет происходить на клиенте

  try {
    res.status(200).json({
      success: true,
      message: 'Актуальная программа получена успешно',
      updated: ['Программа на каждый день с гирей']
    });
  } catch (error) {
    console.error('Ошибка при обновлении программы:', error);
    res.status(500).json({
      success: false,
      message: 'Произошла ошибка при обновлении программы'
    });
  }
} 