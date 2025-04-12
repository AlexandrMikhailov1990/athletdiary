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
  rest: number;
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
  level: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  workoutsPerWeek: number;
  workouts: Workout[];
  exercises?: WorkoutExercise[];
  isPublic?: boolean;
  createdBy?: string;
  restBetweenSets?: number;
  restBetweenExercises?: number;
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
  
  const programs = localStorage.getItem('programs');
  if (programs && JSON.parse(programs).length > 0) return;
  
  const demoPrograms: Program[] = [];
  
  localStorage.setItem('programs', JSON.stringify(demoPrograms));
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
      // Проверяем, есть ли у программы свойство duration, но нет durationWeeks
      if (program.duration !== undefined && program.durationWeeks === undefined) {
        needsUpdate = true;
        return {
          ...program,
          durationWeeks: program.duration
        };
      }
      return program;
    });
    
    if (needsUpdate) {
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      console.log('Программы обновлены: duration → durationWeeks');
    }
  } catch (error) {
    console.error('Ошибка при миграции программ:', error);
  }
}

// Обновим и демо-программы
export const SAMPLE_PROGRAMS: Program[] = []; 