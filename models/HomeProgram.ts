import { Program } from './Program';
import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';
import { HOME_EXERCISES } from './HomeExercises';

// Функция для получения упражнения из массива HOME_EXERCISES по имени
function getExerciseByName(name: string): Exercise | undefined {
  return HOME_EXERCISES.find(ex => ex.name === name);
}

// Домашняя программа тренировок с гантелями
export const HOME_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Домашняя тренировка с гантелями',
  description: 'Полная программа тренировок для всего тела, которую можно выполнять дома с минимальным оборудованием (только гантели). Подходит для новичков и среднего уровня.',
  level: 'beginner',
  duration: 4, // 4 недели
  workoutsPerWeek: 3,
  createdBy: 'system',
  isPublic: true,
  workouts: [
    // День 1: Ноги и плечи
    {
      id: uuidv4(),
      name: 'День 1: Ноги и плечи',
      exercises: [
        {
          exercise: getExerciseByName('Приседания с гантелями') || HOME_EXERCISES[0],
          sets: 4,
          reps: 15,
          rest: 90,
          weight: 15
        },
        {
          exercise: getExerciseByName('Выпады с гантелями') || HOME_EXERCISES[1],
          sets: 3,
          reps: 10,
          rest: 90,
          weight: 8
        },
        {
          exercise: getExerciseByName('Разведение рук с гантелями стоя') || HOME_EXERCISES[5],
          sets: 3,
          reps: 15,
          rest: 60,
          weight: 6
        },
        {
          exercise: getExerciseByName('Гиперэкстензия на полу') || HOME_EXERCISES[9],
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          exercise: getExerciseByName('Планка с подъемом руки') || HOME_EXERCISES[7],
          sets: 3,
          reps: '40 сек',
          rest: 60
        }
      ]
    },
    
    // День 2: Грудь и трицепс
    {
      id: uuidv4(),
      name: 'День 2: Грудь и трицепс',
      exercises: [
        {
          exercise: getExerciseByName('Жим гантелей лёжа') || HOME_EXERCISES[2],
          sets: 4,
          reps: 10,
          rest: 90,
          weight: 12
        },
        {
          exercise: getExerciseByName('Французский жим с гантелями') || HOME_EXERCISES[4],
          sets: 3,
          reps: 12,
          rest: 90,
          weight: 8
        },
        {
          exercise: getExerciseByName('Скручивания с гантелей') || HOME_EXERCISES[8],
          sets: 3,
          reps: 15,
          rest: 60,
          weight: 5
        }
      ]
    },
    
    // День 3: Спина и бицепс
    {
      id: uuidv4(),
      name: 'День 3: Спина и бицепс',
      exercises: [
        {
          exercise: getExerciseByName('Тяга гантелей в наклоне') || HOME_EXERCISES[3],
          sets: 4,
          reps: 12,
          rest: 90,
          weight: 15
        },
        {
          exercise: getExerciseByName('Подъемы на бицепс с гантелями') || HOME_EXERCISES[6],
          sets: 3,
          reps: 12,
          rest: 60,
          weight: 10
        },
        {
          exercise: getExerciseByName('Планка с подъемом руки') || HOME_EXERCISES[7],
          sets: 3,
          reps: '40 сек',
          rest: 60
        },
        {
          exercise: getExerciseByName('Гиперэкстензия на полу') || HOME_EXERCISES[9],
          sets: 3,
          reps: 15,
          rest: 60
        }
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