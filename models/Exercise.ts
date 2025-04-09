export interface BaseExercise {
  id: string;
  name: string;
  type: 'reps' | 'timed';
  sets: number;
  restTime: number; // в секундах
}

export interface RepsExercise extends BaseExercise {
  type: 'reps';
  reps: number;
  weight?: number;
}

export interface TimedExercise extends BaseExercise {
  type: 'timed';
  duration: number; // в секундах
}

export type Exercise = RepsExercise | TimedExercise;

// Примеры упражнений
export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Приседания',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 90
  },
  {
    id: '2',
    name: 'Жим лежа',
    type: 'reps',
    sets: 3,
    reps: 10,
    weight: 60,
    restTime: 120
  },
  {
    id: '3',
    name: 'Планка',
    type: 'timed',
    sets: 3,
    duration: 60, // 60 секунд
    restTime: 60
  }
]; 