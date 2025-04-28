import { Program, WorkoutExercise } from './Program';
import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';
import { HOME_EXERCISES } from './HomeExercises';

// Функция для получения упражнения из массива HOME_EXERCISES по имени
function getExerciseByName(name: string): Exercise | undefined {
  return HOME_EXERCISES.find(ex => ex.name === name);
}

// Вспомогательная функция для создания упражнения с правильным форматом
function createWorkoutExercise(
  exercise: Exercise, 
  sets: number, 
  restTime: number, 
  options?: { reps?: number, duration?: number, weight?: number }
): WorkoutExercise {
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise,
    sets,
    restTime,
    ...(options?.reps !== undefined ? { reps: options.reps } : {}),
    ...(options?.duration !== undefined ? { duration: options.duration } : {}),
    ...(options?.weight !== undefined ? { weight: options.weight } : {}),
  };
}

// Домашняя программа тренировок
export const HOME_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Домашняя программа',
  description: 'Базовая программа тренировок с собственным весом, которую можно выполнять в домашних условиях без специального оборудования.',
  createdBy: 'system',
  isPublic: true,
  restBetweenExercises: 120, // 120 секунд отдыха между упражнениями
  workouts: [
    // День 1: Ноги и плечи
    {
      id: uuidv4(),
      programId: uuidv4(), // ID программы, к которой относится тренировка
      name: 'День 1: Ноги и плечи',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Приседания с гантелями') || HOME_EXERCISES[0],
          4,
          90,
          { reps: 15, weight: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Выпады с гантелями') || HOME_EXERCISES[1],
          3,
          90,
          { reps: 10, weight: 8 }
        ),
        createWorkoutExercise(
          getExerciseByName('Разведение рук с гантелями стоя') || HOME_EXERCISES[5],
          3,
          60,
          { reps: 15, weight: 6 }
        ),
        createWorkoutExercise(
          getExerciseByName('Гиперэкстензия на полу') || HOME_EXERCISES[9],
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Планка с подъемом руки') || HOME_EXERCISES[7],
          3,
          60,
          { duration: 40 }
        )
      ]
    },
    
    // День 2: Грудь и трицепс
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Грудь и трицепс',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Жим гантелей лёжа') || HOME_EXERCISES[2],
          4,
          90,
          { reps: 10, weight: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Французский жим с гантелями') || HOME_EXERCISES[4],
          3,
          90,
          { reps: 12, weight: 8 }
        ),
        createWorkoutExercise(
          getExerciseByName('Скручивания с гантелей') || HOME_EXERCISES[8],
          3,
          60,
          { reps: 15, weight: 5 }
        )
      ]
    },
    
    // День 3: Спина и бицепс
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Спина и бицепс',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Тяга гантелей в наклоне') || HOME_EXERCISES[3],
          4,
          90,
          { reps: 12, weight: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Подъемы на бицепс с гантелями') || HOME_EXERCISES[6],
          3,
          60,
          { reps: 12, weight: 10 }
        ),
        createWorkoutExercise(
          getExerciseByName('Планка с подъемом руки') || HOME_EXERCISES[7],
          3,
          60,
          { duration: 40 }
        ),
        createWorkoutExercise(
          getExerciseByName('Гиперэкстензия на полу') || HOME_EXERCISES[9],
          3,
          60,
          { reps: 15 }
        )
      ]
    }
  ]
};

// Функция для добавления домашней программы в существующие программы
export function addHomeProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    // Проверяем, есть ли уже такая программа по имени
    const existingProgram = userPrograms.find((p: Program) => p.name === HOME_PROGRAM.name);
    
    if (!existingProgram) {
      // Если программы еще нет, добавляем ее
      userPrograms.push(HOME_PROGRAM);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Домашняя программа тренировок добавлена');
    } else {
      console.log('Домашняя программа тренировок уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении домашней программы:', error);
  }
} 