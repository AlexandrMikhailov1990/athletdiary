import { Program } from './Program';

export interface ActiveProgram {
  programId: string;
  userId: string;
  startDate: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: {
    week: number;
    day: number;
    date: string;
  }[];
}

// Пример активной программы для тестирования
export const SAMPLE_ACTIVE_PROGRAM: ActiveProgram = {
  programId: '1',
  userId: '1',
  startDate: new Date().toISOString(),
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: []
}; 