import { Program } from './Program';
import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';
import { EXTENDED_HOME_EXERCISES } from './HomeExercisesExtended';

// Функция для получения упражнения из массива EXTENDED_HOME_EXERCISES по имени
function getExerciseByName(name: string): Exercise | undefined {
  return EXTENDED_HOME_EXERCISES.find(ex => ex.name === name);
}

// Расширенная домашняя программа тренировок 
export const EXTENDED_HOME_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Комплексная домашняя тренировка',
  description: 'Полная программа тренировок для всего тела, которую можно выполнять дома без специального оборудования. Программа включает силовые и кардио упражнения для развития силы, выносливости и улучшения общей физической формы.',
  level: 'beginner',
  duration: 6, // 6 недель
  workoutsPerWeek: 3,
  createdBy: 'system',
  isPublic: true,
  workouts: [
    // День 1: Нижняя часть тела
    {
      id: uuidv4(),
      name: 'День 1: Нижняя часть тела',
      exercises: [
        // Разминка
        {
          exercise: getExerciseByName('Джампинг джек') || EXTENDED_HOME_EXERCISES[0],
          sets: 1,
          reps: '60 сек',
          rest: 30
        },
        {
          exercise: getExerciseByName('Приседания с собственным весом') || EXTENDED_HOME_EXERCISES[0],
          sets: 3,
          reps: 20,
          rest: 60
        },
        {
          exercise: getExerciseByName('Выпады на месте') || EXTENDED_HOME_EXERCISES[1],
          sets: 3,
          reps: 12,
          rest: 60
        },
        {
          exercise: getExerciseByName('Ягодичный мостик') || EXTENDED_HOME_EXERCISES[2],
          sets: 3,
          reps: 15,
          rest: 45
        },
        {
          exercise: getExerciseByName('Полуприседания в плие') || EXTENDED_HOME_EXERCISES[4],
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          exercise: getExerciseByName('Выпрыгивания из приседа') || EXTENDED_HOME_EXERCISES[29],
          sets: 3,
          reps: 12,
          rest: 90
        },
        {
          exercise: getExerciseByName('Подъемы на носки') || EXTENDED_HOME_EXERCISES[3],
          sets: 3,
          reps: 20,
          rest: 30
        }
      ]
    },
    
    // День 2: Верхняя часть тела
    {
      id: uuidv4(),
      name: 'День 2: Верхняя часть тела',
      exercises: [
        // Разминка
        {
          exercise: getExerciseByName('Бег на месте с высоким подниманием колен') || EXTENDED_HOME_EXERCISES[30],
          sets: 1,
          reps: '60 сек',
          rest: 30
        },
        {
          exercise: getExerciseByName('Отжимания от пола') || EXTENDED_HOME_EXERCISES[5],
          sets: 3,
          reps: 12,
          rest: 60
        },
        {
          exercise: getExerciseByName('Тяга в наклоне с бутылками воды') || EXTENDED_HOME_EXERCISES[13],
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          exercise: getExerciseByName('Отжимания с узкой постановкой рук') || EXTENDED_HOME_EXERCISES[6],
          sets: 3,
          reps: 10,
          rest: 60
        },
        {
          exercise: getExerciseByName('Отведение рук в стороны с бутылками') || EXTENDED_HOME_EXERCISES[14],
          sets: 3,
          reps: 12,
          rest: 60
        },
        {
          exercise: getExerciseByName('Подъемы рук вперед') || EXTENDED_HOME_EXERCISES[15],
          sets: 3,
          reps: 12,
          rest: 60
        },
        {
          exercise: getExerciseByName('Обратные отжимания от стула') || EXTENDED_HOME_EXERCISES[8],
          sets: 3,
          reps: 12,
          rest: 60
        }
      ]
    },
    
    // День 3: Ядро и кардио
    {
      id: uuidv4(),
      name: 'День 3: Ядро и кардио',
      exercises: [
        // Разминка
        {
          exercise: getExerciseByName('Прыжки на месте') || EXTENDED_HOME_EXERCISES[25],
          sets: 1,
          reps: '60 сек',
          rest: 30
        },
        {
          exercise: getExerciseByName('Скручивания') || EXTENDED_HOME_EXERCISES[19],
          sets: 3,
          reps: 20,
          rest: 45
        },
        {
          exercise: getExerciseByName('Русские скручивания') || EXTENDED_HOME_EXERCISES[20],
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          exercise: getExerciseByName('Планка на локтях') || EXTENDED_HOME_EXERCISES[21],
          sets: 3,
          reps: '45 сек',
          rest: 60
        },
        {
          exercise: getExerciseByName('Подъемы ног лежа') || EXTENDED_HOME_EXERCISES[23],
          sets: 3,
          reps: 15,
          rest: 60
        },
        {
          exercise: getExerciseByName('Боковая планка') || EXTENDED_HOME_EXERCISES[22],
          sets: 3,
          reps: '30 сек',
          rest: 45
        },
        {
          exercise: getExerciseByName('Берпи') || EXTENDED_HOME_EXERCISES[26],
          sets: 3,
          reps: 10,
          rest: 90
        },
        {
          exercise: getExerciseByName('Альпинист') || EXTENDED_HOME_EXERCISES[24],
          sets: 3,
          reps: '40 сек',
          rest: 60
        }
      ]
    }
  ]
};

// Функция для добавления расширенной домашней программы в существующие программы
export function addExtendedHomeProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    // Проверяем, есть ли уже такая программа по имени
    const existingProgram = userPrograms.find((p: Program) => p.name === EXTENDED_HOME_PROGRAM.name);
    
    if (!existingProgram) {
      // Если программы еще нет, добавляем ее
      userPrograms.push(EXTENDED_HOME_PROGRAM);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Расширенная домашняя программа тренировок добавлена');
    } else {
      console.log('Расширенная домашняя программа тренировок уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении расширенной домашней программы:', error);
  }
} 