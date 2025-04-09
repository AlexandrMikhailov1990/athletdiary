import { Exercise } from './Exercise';
import { Workout } from './Program';

export interface ExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutExerciseRecord {
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutRecord {
  id: string;
  workoutId: string; // Ссылка на workout из Program
  workoutName: string;
  date: string; // ISO format
  duration: number; // Длительность в минутах
  exercises: WorkoutExerciseRecord[];
  notes?: string;
  rating?: number; // 1-5 рейтинг
  userId: string;
}

// Примеры истории тренировок
export const SAMPLE_WORKOUT_HISTORY: WorkoutRecord[] = [
  {
    id: '1',
    workoutId: '101',
    workoutName: 'Тренировка груди и трицепса',
    date: '2023-10-15T10:30:00Z',
    duration: 75,
    exercises: [],
    notes: 'Хорошая тренировка, увеличил вес в жиме штанги',
    rating: 4,
    userId: 'user123'
  },
  {
    id: '2',
    workoutId: '102',
    workoutName: 'Тренировка ног',
    date: '2023-10-17T11:15:00Z',
    duration: 90,
    exercises: [],
    notes: 'Тяжелая тренировка, но справился',
    rating: 5,
    userId: 'user123'
  }
];

export interface WorkoutHistory {
  programId: string;
  date: string;
  week: number;
  day: number;
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
} 