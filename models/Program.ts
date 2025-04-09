import { Exercise } from './Exercise';

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number | string; // Может быть "до отказа" или конкретное число
  rest: number; // Отдых в секундах
  weight?: number; // Вес в кг, опциональный
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // Длительность в неделях
  workoutsPerWeek: number;
  workouts: Workout[];
  createdBy: string;
  isPublic: boolean;
  restBetweenSets?: number; // Время отдыха между подходами в секундах
  restBetweenExercises?: number; // Время отдыха между упражнениями в секундах
}

// Примеры программ
export const SAMPLE_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Программа на массу для начинающих',
    description: 'Базовая программа для набора мышечной массы с акцентом на основные упражнения',
    level: 'beginner',
    duration: 8,
    workoutsPerWeek: 3,
    workouts: [],
    createdBy: 'admin',
    isPublic: true
  },
  {
    id: '2',
    name: 'Программа для похудения',
    description: 'Интенсивная программа с акцентом на жиросжигание и поддержание мышечной массы',
    level: 'intermediate',
    duration: 6,
    workoutsPerWeek: 4,
    workouts: [],
    createdBy: 'admin',
    isPublic: true
  }
]; 