import { Program, WorkoutExercise } from './Program';
import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';
import { EXTENDED_HOME_EXERCISES } from './HomeExercisesExtended';

// Функция для получения упражнения из массива EXTENDED_HOME_EXERCISES по имени
function getExerciseByName(name: string): Exercise | undefined {
  return EXTENDED_HOME_EXERCISES.find(ex => ex.name === name);
}

// Вспомогательная функция для создания упражнения с правильным форматом
function createWorkoutExercise(
  exercise: Exercise, 
  sets: number, 
  rest: number, 
  options?: { reps?: number, duration?: number }
): WorkoutExercise {
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise,
    sets,
    rest,
    ...(options?.reps !== undefined ? { reps: options.reps } : {}),
    ...(options?.duration !== undefined ? { duration: options.duration } : {}),
  };
}

// Расширенная домашняя программа тренировок
export const EXTENDED_HOME_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Расширенная домашняя программа',
  description: 'Расширенная программа тренировок для всего тела, которую можно выполнять дома. Включает разнообразные упражнения для развития силы и выносливости.',
  createdBy: 'system',
  isPublic: true,
  restBetweenExercises: 90,
  workouts: [
    // День 1: Нижняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(), // Генерируем уникальный ID для связи с программой
      name: 'День 1: Нижняя часть тела',
      exercises: [
        // Разминка
        createWorkoutExercise(
          getExerciseByName('Джампинг джек') || EXTENDED_HOME_EXERCISES[0],
          1,
          30,
          { duration: 60 }
        ),
        createWorkoutExercise(
          getExerciseByName('Приседания с собственным весом') || EXTENDED_HOME_EXERCISES[0],
          3,
          60,
          { reps: 20 }
        ),
        createWorkoutExercise(
          getExerciseByName('Выпады на месте') || EXTENDED_HOME_EXERCISES[1],
          3,
          60,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Ягодичный мостик') || EXTENDED_HOME_EXERCISES[2],
          3,
          45,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Полуприседания в плие') || EXTENDED_HOME_EXERCISES[4],
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Выпрыгивания из приседа') || EXTENDED_HOME_EXERCISES[29],
          3,
          90,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Подъемы на носки') || EXTENDED_HOME_EXERCISES[3],
          3,
          30,
          { reps: 20 }
        )
      ]
    },
    
    // День 2: Верхняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Верхняя часть тела',
      exercises: [
        // Разминка
        createWorkoutExercise(
          getExerciseByName('Бег на месте с высоким подниманием колен') || EXTENDED_HOME_EXERCISES[30],
          1,
          30,
          { duration: 60 }
        ),
        createWorkoutExercise(
          getExerciseByName('Отжимания от пола') || EXTENDED_HOME_EXERCISES[5],
          3,
          60,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Тяга в наклоне с бутылками воды') || EXTENDED_HOME_EXERCISES[13],
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Отжимания с узкой постановкой рук') || EXTENDED_HOME_EXERCISES[6],
          3,
          60,
          { reps: 10 }
        ),
        createWorkoutExercise(
          getExerciseByName('Отведение рук в стороны с бутылками') || EXTENDED_HOME_EXERCISES[14],
          3,
          60,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Подъемы рук вперед') || EXTENDED_HOME_EXERCISES[15],
          3,
          60,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Обратные отжимания от стула') || EXTENDED_HOME_EXERCISES[8],
          3,
          60,
          { reps: 12 }
        )
      ]
    },
    
    // День 3: Ядро и кардио
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Ядро и кардио',
      exercises: [
        // Разминка
        createWorkoutExercise(
          getExerciseByName('Прыжки на месте') || EXTENDED_HOME_EXERCISES[25],
          1,
          30,
          { duration: 60 }
        ),
        createWorkoutExercise(
          getExerciseByName('Скручивания') || EXTENDED_HOME_EXERCISES[19],
          3,
          45,
          { reps: 20 }
        ),
        createWorkoutExercise(
          getExerciseByName('Русские скручивания') || EXTENDED_HOME_EXERCISES[20],
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Планка на локтях') || EXTENDED_HOME_EXERCISES[21],
          3,
          60,
          { duration: 45 }
        ),
        createWorkoutExercise(
          getExerciseByName('Подъемы ног лежа') || EXTENDED_HOME_EXERCISES[23],
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Боковая планка') || EXTENDED_HOME_EXERCISES[22],
          3,
          45,
          { duration: 30 }
        ),
        createWorkoutExercise(
          getExerciseByName('Берпи') || EXTENDED_HOME_EXERCISES[26],
          3,
          90,
          { reps: 10 }
        ),
        createWorkoutExercise(
          getExerciseByName('Альпинист') || EXTENDED_HOME_EXERCISES[24],
          3,
          60,
          { duration: 40 }
        )
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