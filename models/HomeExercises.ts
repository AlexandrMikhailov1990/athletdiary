import { Exercise } from './Exercise';
import { Program } from './Program';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutExercise } from './Program';

// Домашние упражнения с гантелями
export const HOME_EXERCISES: Exercise[] = [
  // 1. Приседания с гантелями
  {
    id: uuidv4(),
    name: 'Приседания с гантелями',
    type: 'reps',
    sets: 4,
    reps: 15,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes'],
    description: 'Встаньте прямо, держа гантели в руках вдоль туловища. Опуститесь вниз, пока бедра не станут параллельны полу. Вернитесь в исходное положение.',
    equipment: ['dumbbell'],
    recommendations: ['Держите спину прямо', 'Колени не выходят за носки', 'Взгляд направлен вперед'],
    weight: 15
  },
  
  // 2. Выпады с гантелями
  {
    id: uuidv4(),
    name: 'Выпады с гантелями',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['glutes', 'quads'],
    description: 'Держите гантели в руках. Сделайте широкий шаг вперёд и опуститесь, пока оба колена не согнутся под углом 90 градусов. Вернитесь в исходное положение.',
    equipment: ['dumbbell'],
    recommendations: ['Следите, чтобы колено не выходило за носок', 'Держите корпус прямо'],
    weight: 8
  },
  
  // 3. Жим гантелей лёжа
  {
    id: uuidv4(),
    name: 'Жим гантелей лёжа',
    type: 'reps',
    sets: 4,
    reps: 10,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Ложитесь на пол или скамью, держа гантели в руках. Поднимайте гантели вертикально вверх, выпрямляя руки, затем опускайте обратно.',
    equipment: ['dumbbell'],
    recommendations: ['Сводите лопатки вместе', 'Не разводите локти слишком широко'],
    weight: 12
  },
  
  // 4. Тяга гантелей в наклоне
  {
    id: uuidv4(),
    name: 'Тяга гантелей в наклоне',
    type: 'reps',
    sets: 4,
    reps: 12,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['back', 'traps', 'lats'],
    description: 'Наклонитесь вперёд, сохраняя спину прямой. Поднимайте гантели к грудной клетке, сводя лопатки вместе.',
    equipment: ['dumbbell'],
    recommendations: ['Держите спину прямой', 'Тяните локти вверх и назад', 'Сводите лопатки при подъеме'],
    weight: 15
  },
  
  // 5. Французский жим с гантелями
  {
    id: uuidv4(),
    name: 'Французский жим с гантелями',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['triceps'],
    description: 'Лежа на спине, вытяните руки с гантелями вертикально вверх. Медленно опускайте гантели ко лбу, сгибая локти, затем возвращайтесь в исходное положение.',
    equipment: ['dumbbell'],
    recommendations: ['Держите локти неподвижно', 'Опускайте гантели за голову', 'Выполняйте движение плавно'],
    weight: 8
  },
  
  // 6. Разведение рук с гантелями стоя
  {
    id: uuidv4(),
    name: 'Разведение рук с гантелями стоя',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'traps'],
    description: 'Стоя, держите гантели у бедер. Поднимайте руки в стороны до уровня плеч, затем медленно опускайте.',
    equipment: ['dumbbell'],
    recommendations: ['Не используйте инерцию', 'Держите спину прямо', 'Поднимайте руки до уровня плеч'],
    weight: 6
  },
  
  // 7. Подъемы на бицепс с гантелями
  {
    id: uuidv4(),
    name: 'Подъемы на бицепс с гантелями',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['biceps', 'forearms'],
    description: 'Стоя, держите гантели в опущенных руках. Сгибайте руки в локтях, поднимая гантели к плечам, затем медленно опускайте.',
    equipment: ['dumbbell'],
    recommendations: ['Держите локти прижатыми к корпусу', 'Полностью разгибайте руки в нижней точке', 'Не используйте инерцию'],
    weight: 10
  },
  
  // 8. Планка с подъемом руки
  {
    id: uuidv4(),
    name: 'Планка с подъемом руки',
    type: 'timed',
    sets: 3,
    duration: 40,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['core', 'shoulders', 'abs'],
    description: 'Примите положение планки на прямых руках. Поочередно поднимайте одну руку вперед, удерживая баланс.',
    equipment: [],
    recommendations: ['Держите корпус стабильным', 'Не прогибайте поясницу', 'Дышите равномерно']
  },
  
  // 9. Скручивания с гантелей
  {
    id: uuidv4(),
    name: 'Скручивания с гантелей',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['abs', 'core'],
    description: 'Лежа на спине с согнутыми коленями, держите гантель обеими руками над грудью. Поднимайте верхнюю часть спины, направляя гантель к коленям.',
    equipment: ['dumbbell'],
    recommendations: ['Делайте движение за счет мышц пресса', 'Не тяните шею', 'Дышите ритмично'],
    weight: 5
  },
  
  // 10. Подъемы ног в висе
  {
    id: uuidv4(),
    name: 'Гиперэкстензия на полу',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'glutes', 'hamstrings'],
    description: 'Лежа на животе, руки вытянуты вперед. Одновременно поднимайте верхнюю часть тела и ноги от пола, задерживаясь на 1-2 секунды.',
    equipment: [],
    recommendations: ['Не запрокидывайте голову', 'Напрягайте ягодицы при подъеме', 'Движение должно быть плавным']
  }
];

// Функция для добавления домашних упражнений в существующий список упражнений
export function addHomeExercisesToUserExercises(): void {
  try {
    const savedExercises = localStorage.getItem('userExercises');
    let userExercises = savedExercises ? JSON.parse(savedExercises) : [];
    
    // Добавляем только те упражнения, которых еще нет (проверка по имени)
    const existingNames = userExercises.map((ex: Exercise) => ex.name);
    const newExercises = HOME_EXERCISES.filter(ex => !existingNames.includes(ex.name));
    
    if (newExercises.length > 0) {
      userExercises = [...userExercises, ...newExercises];
      localStorage.setItem('userExercises', JSON.stringify(userExercises));
      console.log(`Добавлено ${newExercises.length} новых домашних упражнений`);
    } else {
      console.log('Все домашние упражнения уже добавлены');
    }
  } catch (error) {
    console.error('Ошибка при добавлении домашних упражнений:', error);
  }
}

// Функция для создания объекта упражнения в тренировке
function createWorkoutExercise(
  exercise: Exercise, 
  sets: number, 
  rest: number, 
  options?: { reps?: number; weight?: number; duration?: number }
) {
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise: exercise,
    sets: sets,
    reps: options?.reps,
    weight: options?.weight,
    duration: options?.duration,
    rest: rest,
  };
}

// Функция для поиска упражнения по названию
function getExerciseByName(name: string): Exercise | undefined {
  // Ищем в домашних упражнениях
  let exercise = HOME_EXERCISES.find(ex => ex.name === name);
  
  // Если не найдено, ищем в упражнениях с резиновыми лентами
  if (!exercise) {
    try {
      // Импортируем упражнения с резиновыми лентами
      const { RESISTANCE_BAND_EXERCISES } = require('./Exercise');
      exercise = RESISTANCE_BAND_EXERCISES.find((ex: Exercise) => ex.name === name);
    } catch (error) {
      console.error('Ошибка при поиске упражнения с резиновыми лентами:', error);
    }
  }
  
  return exercise;
}

// Программа тренировок с резиновыми лентами
export const RESISTANCE_BAND_PROGRAM = {
  id: uuidv4(),
  name: 'Программа тренировок с резиновыми лентами',
  description: 'Эффективная программа тренировок с использованием резиновых лент для всех групп мышц',
  level: 'beginner',
  durationWeeks: 4,
  workoutsPerWeek: 3,
  restBetweenExercises: 60,
  workouts: [
    // День 1: Верхняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 1: Верхняя часть тела',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Тяга резиновой ленты к груди') || { id: 'rb-1', name: 'Тяга резиновой ленты к груди' } as Exercise,
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Боковые подъемы рук с резиновой лентой') || { id: 'rb-2', name: 'Боковые подъемы рук с резиновой лентой' } as Exercise,
          3,
          45,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Разгибание рук с резиновой лентой') || { id: 'rb-5', name: 'Разгибание рук с резиновой лентой' } as Exercise,
          3,
          45,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Сгибание рук на бицепс с резиновой лентой') || { id: 'rb-4', name: 'Сгибание рук на бицепс с резиновой лентой' } as Exercise,
          3,
          45,
          { reps: 12 }
        )
      ]
    },
    // День 2: Нижняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Нижняя часть тела',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Приседания с резиновой лентой') || { id: 'rb-3', name: 'Приседания с резиновой лентой' } as Exercise,
          3,
          60,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Подъемы ног в сторону с резиновой лентой') || { id: 'rb-7', name: 'Подъемы ног в сторону с резиновой лентой' } as Exercise,
          3,
          45,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Гиперэкстензия на полу') || HOME_EXERCISES[9],
          3,
          60,
          { reps: 15 }
        )
      ]
    },
    // День 3: Полное тело
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Полное тело',
      exercises: [
        createWorkoutExercise(
          getExerciseByName('Тяга резиновой ленты к поясу') || { id: 'rb-8', name: 'Тяга резиновой ленты к поясу' } as Exercise,
          3,
          60,
          { reps: 12 }
        ),
        createWorkoutExercise(
          getExerciseByName('Разведение рук с резиновой лентой') || { id: 'rb-6', name: 'Разведение рук с резиновой лентой' } as Exercise,
          3,
          45,
          { reps: 15 }
        ),
        createWorkoutExercise(
          getExerciseByName('Приседания с резиновой лентой') || { id: 'rb-3', name: 'Приседания с резиновой лентой' } as Exercise,
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
    }
  ],
  exercises: [] as WorkoutExercise[]
};

// Функция для добавления программы с резиновыми лентами в локальное хранилище
export function addResistanceBandProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    // Убедимся, что exercises не пустой - копируем из workouts
    const programCopy = {...RESISTANCE_BAND_PROGRAM};
    // Заполняем exercises из первой тренировки, если они отсутствуют
    if (!programCopy.exercises || programCopy.exercises.length === 0) {
      programCopy.exercises = programCopy.workouts[0].exercises;
    }
    
    // Проверяем, есть ли уже программа с таким именем
    const existingProgram = userPrograms.find((p: any) => p.name === programCopy.name);
    
    if (!existingProgram) {
      // Добавляем программу в список пользовательских программ
      userPrograms.push(programCopy);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа тренировок с резиновыми лентами добавлена');
    } else {
      console.log('Программа с таким названием уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы тренировок с резиновыми лентами:', error);
  }
}

// Базовая программа домашних тренировок
export const HOME_PROGRAM_BASIC: Program = {
  id: uuidv4(),
  name: 'Базовые домашние упражнения',
  description: 'Простая программа тренировок, которую можно выполнять дома без оборудования. Подходит для начинающих.',
  createdBy: 'system',
  isPublic: true,
  restBetweenExercises: 60,
  workouts: [
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'Базовая домашняя тренировка',
      exercises: [
        // ... existing exercises ...
      ]
    }
  ]
}; 