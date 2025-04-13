import { Program, WorkoutExercise } from './Program';
import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';
import { kettlebellExercises } from '../data/kettlebell-exercises';
import { pullupExercises } from '../data/pullup-exercises';

// Функция для получения упражнения с гирей по имени
function getKettlebellExerciseByName(name: string): Exercise | undefined {
  return kettlebellExercises.find(ex => ex.name === name);
}

// Функция для получения упражнения с подтягиваниями по имени
function getPullupExerciseByName(name: string): Exercise | undefined {
  return pullupExercises.find(ex => ex.name === name);
}

// Вспомогательная функция для создания упражнения с правильным форматом
function createWorkoutExercise(
  exercise: Exercise, 
  sets: number, 
  rest: number, 
  options?: { reps?: number, duration?: number, weight?: number }
): WorkoutExercise {
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise,
    sets,
    rest,
    ...(options?.reps !== undefined ? { reps: options.reps } : {}),
    ...(options?.duration !== undefined ? { duration: options.duration } : {}),
    ...(options?.weight !== undefined ? { weight: options.weight } : {}),
  };
}

// Создаем новое упражнение, если его не существует
function createCircularKettlebellExercise(): Exercise {
  const circularKettlebellExercise: Exercise = {
    id: '27',
    name: 'Круговые движения гирей',
    description: 'Упражнение для укрепления плеч и мышц кора. Гиря выполняет круговое движение вокруг тела.',
    imageUrl: '/images/exercises/kettlebell-around.jpg',
    muscleGroups: ['shoulders', 'core', 'arms'],
    equipment: ['kettlebell'],
    difficulty: 'beginner',
    type: 'timed',
    duration: 30,
    restTime: 10,
    isPublic: true,
  };
  return circularKettlebellExercise;
}

// Программа тренировок с гирей на каждый день
export const KETTLEBELL_DAILY_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Программа на каждый день с гирей',
  description: 'Эффективная программа с использованием гири и подтягиваний для тренировки всего тела на каждый день.',
  createdBy: 'system',
  isPublic: true,
  restBetweenExercises: 60, // 60 секунд отдыха между упражнениями
  workouts: [
    // Тренировка на каждый день
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'Тренировка с гирей и подтягиваниями',
      exercises: [
        createWorkoutExercise(
          getPullupExerciseByName('Подтягивания прямым хватом') || pullupExercises[0],
          3,
          60,
          { reps: 5 }
        ),
        createWorkoutExercise(
          createCircularKettlebellExercise(),
          2,
          10,
          { duration: 30 }
        ),
        createWorkoutExercise(
          getKettlebellExerciseByName('Махи гирей (свинг)') || kettlebellExercises[0],
          3,
          60,
          { reps: 10 }
        ),
        createWorkoutExercise(
          getKettlebellExerciseByName('Приседания с гирей') || kettlebellExercises[3],
          3,
          60,
          { reps: 10 }
        ),
      ]
    }
  ]
};

// Функция для добавления программы с гирей в существующие программы
export function addKettlebellProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    // Проверяем, есть ли уже такая программа по имени
    const existingProgram = userPrograms.find((p: Program) => p.name === KETTLEBELL_DAILY_PROGRAM.name);
    
    if (!existingProgram) {
      // Если программы еще нет, добавляем ее
      userPrograms.push(KETTLEBELL_DAILY_PROGRAM);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа тренировок с гирей добавлена');
    } else {
      // Обновляем существующую программу
      const index = userPrograms.findIndex((p: Program) => p.name === KETTLEBELL_DAILY_PROGRAM.name);
      userPrograms[index] = KETTLEBELL_DAILY_PROGRAM;
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа тренировок с гирей обновлена');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы с гирей:', error);
  }
} 