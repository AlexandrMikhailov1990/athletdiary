import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed?: boolean;
  completedSets?: {
    reps?: number;
    weight?: number;
    duration?: number;
  }[];
}

export interface Workout {
  id: string;
  programId: string;
  name?: string;
  date?: string;
  exercises: WorkoutExercise[];
  notes?: string;
  completed?: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
  exercises?: WorkoutExercise[];
  isPublic?: boolean;
  createdBy?: string;
  restBetweenSets?: number;
  restBetweenExercises?: number;
  isSample?: boolean;
  isImported?: boolean;
  category?: string;
  difficulty?: number;
  weeks?: number;
  isShared?: boolean;
}

interface CompletedWorkout {
  id: string;
  workoutId: string;
  programId: string;
  date: string;
  exercises: WorkoutExercise[];
}

export function getPrograms(): Program[] {
  if (typeof window === 'undefined') return [];
  
  const programs = localStorage.getItem('programs');
  if (!programs) return [];
  
  return JSON.parse(programs);
}

export function getProgramById(id: string): Program | null {
  const programs = getPrograms();
  return programs.find(program => program.id === id) || null;
}

export function saveProgram(program: Program): void {
  const programs = getPrograms();
  const index = programs.findIndex(p => p.id === program.id);
  
  if (index >= 0) {
    programs[index] = program;
  } else {
    programs.push(program);
  }
  
  localStorage.setItem('programs', JSON.stringify(programs));
}

export function deleteProgram(id: string): void {
  const programs = getPrograms();
  const filteredPrograms = programs.filter(program => program.id !== id);
  localStorage.setItem('programs', JSON.stringify(filteredPrograms));
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  
  const completedWorkouts = localStorage.getItem('completedWorkouts');
  if (!completedWorkouts) return [];
  
  return JSON.parse(completedWorkouts);
}

export function saveCompletedWorkout(workout: CompletedWorkout): void {
  const completedWorkouts = getCompletedWorkouts();
  completedWorkouts.push(workout);
  localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
}

export function getCompletedWorkoutsByProgramId(programId: string): CompletedWorkout[] {
  const completedWorkouts = getCompletedWorkouts();
  return completedWorkouts.filter(workout => workout.programId === programId);
}

export function initializePrograms(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const programs = localStorage.getItem('programs');
    let userPrograms = programs ? JSON.parse(programs) : [];
    
    // Добавляем программу с прыжками на скакалке
    const { addJumpRopeAndResistanceProgramToUserPrograms } = require('./HomeExercises');
    addJumpRopeAndResistanceProgramToUserPrograms();
    
    // Если программ нет, инициализируем пустым массивом
    if (!programs) {
      localStorage.setItem('programs', JSON.stringify([]));
    }
  } catch (error) {
    console.error('Ошибка при инициализации программ:', error);
    // В случае ошибки, убедимся что есть хотя бы пустой массив
    localStorage.setItem('programs', JSON.stringify([]));
  }
}

// Функция для миграции старых данных программ
export function migratePrograms(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const programsStr = localStorage.getItem('programs');
    if (!programsStr) return;
    
    const programs = JSON.parse(programsStr);
    let needsUpdate = false;
    
    const updatedPrograms = programs.map((program: any) => {
      // Создаем новый объект без удаленных полей
      const { 
        level, 
        durationWeeks, 
        workoutsPerWeek, 
        ...updatedProgram 
      } = program;
      
      // Всегда помечаем, что есть обновления при удалении полей
      if (level !== undefined || durationWeeks !== undefined || workoutsPerWeek !== undefined) {
        needsUpdate = true;
      }
      
      return updatedProgram;
    });
    
    if (needsUpdate) {
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      console.log('Программы обновлены: удалены неиспользуемые поля');
    }
  } catch (error) {
    console.error('Ошибка при миграции программ:', error);
  }
}

// Обновим и демо-программы
export const SAMPLE_PROGRAMS: Program[] = [];

export function copyProgram(programId: string): Program {
  const program = getProgramById(programId);
  if (!program) {
    throw new Error('Программа не найдена');
  }

  // Создаем копию программы с новым ID
  const copiedProgram: Program = {
    ...program,
    id: uuidv4(),
    name: `${program.name} (копия)`,
    isPublic: false,
    createdBy: 'user'
  };

  // Сохраняем копию в localStorage
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  programs.push(copiedProgram);
  localStorage.setItem('programs', JSON.stringify(programs));

  return copiedProgram;
} 