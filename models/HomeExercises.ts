import { Exercise } from './Exercise';
import { Program } from './Program';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutExercise } from './Program';

// Домашние упражнения с гантелями
export const HOME_EXERCISES: Exercise[] = [
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
    weight: 15,
    imageUrl: '',
    video: ''
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
    weight: 8,
    imageUrl: '',
    video: ''
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
    weight: 12,
    imageUrl: '',
    video: ''
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
    weight: 15,
    imageUrl: '',
    video: ''
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
    weight: 8,
    imageUrl: '',
    video: ''
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
    weight: 6,
    imageUrl: '',
    video: ''
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
    weight: 10,
    imageUrl: '',
    video: ''
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
    recommendations: ['Держите корпус стабильным', 'Не прогибайте поясницу', 'Дышите равномерно'],
    imageUrl: '',
    video: ''
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
    weight: 5,
    imageUrl: '',
    video: ''
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
    recommendations: ['Не запрокидывайте голову', 'Напрягайте ягодицы при подъеме', 'Движение должно быть плавным'],
    imageUrl: '',
    video: ''
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
  restTime: number, 
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
    restTime: restTime,
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

// Новая программа с прыжками на скакалке и упражнениями с резиновыми лентами
export const JUMP_ROPE_AND_RESISTANCE_PROGRAM = {
  id: uuidv4(),
  name: 'Программа с прыжками на скакалке и резиновыми лентами',
  description: 'Комбинированная программа тренировок с использованием скакалки и резиновых лент для развития выносливости и силы',
  level: 'intermediate',
  durationWeeks: 4,
  workoutsPerWeek: 3,
  restBetweenExercises: 60,
  workouts: [
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'Тренировка на все тело',
      exercises: [
        // Базовые прыжки на скакалке (начало)
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Базовые прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio', 'calves'],
            description: 'Базовые прыжки на скакалке для разогрева и кардио нагрузки',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Подтягивания прямым хватом
        createWorkoutExercise(
          {
            id: '11',
            name: 'Подтягивания прямым хватом',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['back', 'biceps'],
            description: 'Классические подтягивания прямым хватом на ширине плеч',
            equipment: ['pull-up bar']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Тяга резиновой ленты к груди
        createWorkoutExercise(
          getExerciseByName('Тяга резиновой ленты к груди') || { 
            id: 'rb-1',
            name: 'Тяга резиновой ленты к груди',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['back', 'shoulders'],
            description: 'Упражнение для развития мышц спины с использованием резиновой ленты',
            equipment: ['resistance bands']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Боковые подъемы рук с резиновой лентой
        createWorkoutExercise(
          getExerciseByName('Боковые подъемы рук с резиновой лентой') || {
            id: 'rb-2',
            name: 'Боковые подъемы рук с резиновой лентой',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['shoulders'],
            description: 'Упражнение для развития плечевых мышц с использованием резиновой ленты',
            equipment: ['resistance bands']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Приседания с резиновой лентой
        createWorkoutExercise(
          getExerciseByName('Приседания с резиновой лентой') || {
            id: 'rb-3',
            name: 'Приседания с резиновой лентой',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['legs', 'glutes'],
            description: 'Приседания с дополнительным сопротивлением резиновой ленты',
            equipment: ['resistance bands']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Сгибание рук на бицепс с резиновой лентой
        createWorkoutExercise(
          getExerciseByName('Сгибание рук на бицепс с резиновой лентой') || {
            id: 'rb-4',
            name: 'Сгибание рук на бицепс с резиновой лентой',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['biceps'],
            description: 'Упражнение для развития бицепсов с использованием резиновой ленты',
            equipment: ['resistance bands']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Разгибание рук с резиновой лентой
        createWorkoutExercise(
          getExerciseByName('Разгибание рук с резиновой лентой') || {
            id: 'rb-5',
            name: 'Разгибание рук с резиновой лентой',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['triceps'],
            description: 'Упражнение для развития трицепсов с использованием резиновой ленты',
            equipment: ['resistance bands']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Базовые прыжки на скакалке (конец)
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Базовые прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio', 'calves'],
            description: 'Базовые прыжки на скакалке для завершающей кардио нагрузки',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 300 }
        )
      ]
    }
  ],
  exercises: [] as WorkoutExercise[]
};

// Функция для добавления программы с прыжками на скакалке в локальное хранилище
export function addJumpRopeAndResistanceProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    const programCopy = {...JUMP_ROPE_AND_RESISTANCE_PROGRAM};
    if (!programCopy.exercises || programCopy.exercises.length === 0) {
      programCopy.exercises = programCopy.workouts[0].exercises;
    }
    
    const existingProgram = userPrograms.find((p: any) => p.name === programCopy.name);
    
    if (!existingProgram) {
      userPrograms.push(programCopy);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа с прыжками на скакалке и резиновыми лентами добавлена');
    } else {
      console.log('Программа с таким названием уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы:', error);
  }
}

// Программа для похудения
export const WEIGHT_LOSS_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Программа для похудения',
  description: 'Эффективная программа тренировок для снижения веса, сочетающая кардио и силовые нагрузки',
  createdBy: 'system',
  isPublic: true,
  isSample: true,
  category: 'weight-loss',
  difficulty: 2,
  weeks: 4,
  restBetweenSets: 60,
  restBetweenExercises: 90,
  workouts: [
    // День 1: Кардио + Верхняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 1: Кардио + Верхняя часть тела',
      exercises: [
        // Разминка - прыжки на скакалке
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Разминка с помощью прыжков на скакалке',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Отжимания
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Отжимания',
            type: 'reps',
            sets: 3,
            reps: 15,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['chest', 'triceps', 'shoulders'],
            description: 'Базовое упражнение для верхней части тела',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 15 }
        ),
        // Планка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Планка',
            type: 'timed',
            sets: 3,
            duration: 45,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['core'],
            description: 'Статическое упражнение для мышц кора',
            equipment: ['bodyweight']
          },
          3,
          60,
          { duration: 45 }
        ),
        // Бёрпи
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Бёрпи',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['full-body', 'cardio'],
            description: 'Комплексное упражнение для всего тела',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Завершающее кардио
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Завершающее кардио',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 300 }
        )
      ]
    },
    // День 2: Кардио + Нижняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Кардио + Нижняя часть тела',
      exercises: [
        // Разминка - бег на месте
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Бег на месте',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Разминка с помощью бега на месте',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Приседания
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Приседания',
            type: 'reps',
            sets: 3,
            reps: 20,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['legs', 'glutes'],
            description: 'Базовое упражнение для ног',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 20 }
        ),
        // Выпады
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Выпады',
            type: 'reps',
            sets: 3,
            reps: 15,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['legs', 'glutes'],
            description: 'Упражнение для ног и ягодиц',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 15 }
        ),
        // Прыжки с приседанием
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Прыжки с приседанием',
            type: 'reps',
            sets: 3,
            reps: 15,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['legs', 'cardio'],
            description: 'Взрывное упражнение для ног',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 15 }
        ),
        // Завершающее кардио
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Бег на месте',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Завершающее кардио',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        )
      ]
    },
    // День 3: Интервальная тренировка
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Интервальная тренировка',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Интервалы высокой интенсивности
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Интервалы высокой интенсивности',
            type: 'timed',
            sets: 4,
            duration: 30,
            restTime: 30,
            difficulty: 'intermediate',
            muscleGroups: ['cardio', 'full-body'],
            description: 'Интенсивные интервалы с максимальной нагрузкой',
            equipment: ['bodyweight']
          },
          4,
          30,
          { duration: 30 }
        ),
        // Отдых между интервалами
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Отдых',
            type: 'timed',
            sets: 4,
            duration: 30,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: [],
            description: 'Активный отдых между интервалами',
            equipment: []
          },
          4,
          0,
          { duration: 30 }
        ),
        // Завершающая растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    }
  ]
};

// Функция для добавления программы для похудения в локальное хранилище
export function addWeightLossProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    const programCopy = {...WEIGHT_LOSS_PROGRAM};
    if (!programCopy.exercises || programCopy.exercises.length === 0) {
      programCopy.exercises = programCopy.workouts[0].exercises;
    }
    
    const existingProgram = userPrograms.find((p: any) => p.name === programCopy.name);
    
    if (!existingProgram) {
      userPrograms.push(programCopy);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа для похудения добавлена');
    } else {
      console.log('Программа с таким названием уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы для похудения:', error);
  }
}

// Программа для начинающих
export const BEGINNER_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Программа для начинающих',
  description: 'Простая программа тренировок для начинающих, не требующая специального оборудования',
  createdBy: 'system',
  isPublic: true,
  isSample: true,
  category: 'beginner',
  difficulty: 1,
  weeks: 4,
  restBetweenSets: 90,
  restBetweenExercises: 120,
  workouts: [
    // День 1: Верхняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 1: Верхняя часть тела',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Отжимания от стены
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Отжимания от стены',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 90,
            difficulty: 'beginner',
            muscleGroups: ['chest', 'triceps', 'shoulders'],
            description: 'Упрощенная версия отжиманий для начинающих',
            equipment: ['bodyweight']
          },
          3,
          90,
          { reps: 10 }
        ),
        // Планка на коленях
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Планка на коленях',
            type: 'timed',
            sets: 3,
            duration: 20,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['core'],
            description: 'Упрощенная версия планки для начинающих',
            equipment: ['bodyweight']
          },
          3,
          60,
          { duration: 20 }
        ),
        // Подъемы рук в стороны
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Подъемы рук в стороны',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['shoulders'],
            description: 'Упражнение для укрепления плечевых мышц',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 12 }
        ),
        // Растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    },
    // День 2: Нижняя часть тела
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Нижняя часть тела',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Приседания с опорой
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Приседания с опорой',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 90,
            difficulty: 'beginner',
            muscleGroups: ['legs', 'glutes'],
            description: 'Упрощенная версия приседаний для начинающих',
            equipment: ['bodyweight']
          },
          3,
          90,
          { reps: 10 }
        ),
        // Подъемы на носки
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Подъемы на носки',
            type: 'reps',
            sets: 3,
            reps: 15,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['calves'],
            description: 'Упражнение для укрепления икроножных мышц',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 15 }
        ),
        // Подъемы ног лежа
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Подъемы ног лежа',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['abs', 'core'],
            description: 'Упражнение для укрепления мышц пресса',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    },
    // День 3: Общая физическая подготовка
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Общая физическая подготовка',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Ходьба на месте
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Ходьба на месте',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Легкое кардио упражнение',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Наклоны вперед
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Наклоны вперед',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['back', 'hamstrings'],
            description: 'Упражнение для растяжки и укрепления спины',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Круговые движения руками
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Круговые движения руками',
            type: 'reps',
            sets: 3,
            reps: 10,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['shoulders'],
            description: 'Упражнение для улучшения подвижности плечевых суставов',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 10 }
        ),
        // Растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    }
  ]
};

// Функция для добавления программы для начинающих в локальное хранилище
export function addBeginnerProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    const programCopy = {...BEGINNER_PROGRAM};
    if (!programCopy.exercises || programCopy.exercises.length === 0) {
      programCopy.exercises = programCopy.workouts[0].exercises;
    }
    
    const existingProgram = userPrograms.find((p: any) => p.name === programCopy.name);
    
    if (!existingProgram) {
      userPrograms.push(programCopy);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа для начинающих добавлена');
    } else {
      console.log('Программа с таким названием уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы для начинающих:', error);
  }
}

// Программа для развития выносливости
export const ENDURANCE_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Программа для развития выносливости',
  description: 'Программа тренировок для развития общей выносливости и кардио-подготовки',
  createdBy: 'system',
  isPublic: true,
  isSample: true,
  category: 'endurance',
  difficulty: 2,
  weeks: 4,
  restBetweenSets: 60,
  restBetweenExercises: 90,
  workouts: [
    // День 1: Кардио + Силовая выносливость
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 1: Кардио + Силовая выносливость',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Бег на месте
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Бег на месте',
            type: 'timed',
            sets: 1,
            duration: 600,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Базовое кардио упражнение',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 600 }
        ),
        // Берпи
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Берпи',
            type: 'reps',
            sets: 3,
            reps: 15,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['full-body', 'cardio'],
            description: 'Комплексное упражнение для всего тела',
            equipment: ['bodyweight']
          },
          3,
          60,
          { reps: 15 }
        ),
        // Прыжки на скакалке
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Упражнение для развития координации и выносливости',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Завершающая растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    },
    // День 2: Интервальная тренировка
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 2: Интервальная тренировка',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Интервалы высокой интенсивности
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Интервалы высокой интенсивности',
            type: 'timed',
            sets: 5,
            duration: 30,
            restTime: 30,
            difficulty: 'intermediate',
            muscleGroups: ['cardio', 'full-body'],
            description: 'Интенсивные интервалы с максимальной нагрузкой',
            equipment: ['bodyweight']
          },
          5,
          30,
          { duration: 30 }
        ),
        // Отдых между интервалами
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Отдых',
            type: 'timed',
            sets: 5,
            duration: 30,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: [],
            description: 'Активный отдых между интервалами',
            equipment: []
          },
          5,
          0,
          { duration: 30 }
        ),
        // Завершающая растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    },
    // День 3: Длительная кардио тренировка
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'День 3: Длительная кардио тренировка',
      exercises: [
        // Разминка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Разминка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Общая разминка для подготовки тела к тренировке',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 300 }
        ),
        // Бег на месте
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Бег на месте',
            type: 'timed',
            sets: 1,
            duration: 1200,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Длительное кардио упражнение',
            equipment: ['bodyweight']
          },
          1,
          60,
          { duration: 1200 }
        ),
        // Прыжки на скакалке
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Прыжки на скакалке',
            type: 'timed',
            sets: 1,
            duration: 600,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['cardio'],
            description: 'Упражнение для развития координации и выносливости',
            equipment: ['jump rope']
          },
          1,
          60,
          { duration: 600 }
        ),
        // Завершающая растяжка
        createWorkoutExercise(
          {
            id: uuidv4(),
            name: 'Растяжка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['flexibility'],
            description: 'Завершающая растяжка',
            equipment: ['bodyweight']
          },
          1,
          0,
          { duration: 300 }
        )
      ]
    }
  ]
};

// Функция для добавления программы для развития выносливости в локальное хранилище
export function addEnduranceProgramToUserPrograms(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    const programCopy = {...ENDURANCE_PROGRAM};
    if (!programCopy.exercises || programCopy.exercises.length === 0) {
      programCopy.exercises = programCopy.workouts[0].exercises;
    }
    
    const existingProgram = userPrograms.find((p: any) => p.name === programCopy.name);
    
    if (!existingProgram) {
      userPrograms.push(programCopy);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа для развития выносливости добавлена');
    } else {
      console.log('Программа с таким названием уже существует');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы для развития выносливости:', error);
  }
}

export const FULL_BODY_WORKOUT: Program = {
  id: uuidv4(),
  name: 'Полноценная тренировка всего тела',
  description: 'Комплексная тренировка для развития силы и выносливости всего тела',
  createdBy: 'system',
  isPublic: true,
  isSample: true,
  category: 'fullbody',
  difficulty: 2,
  weeks: 1,
  restBetweenSets: 60,
  restBetweenExercises: 120,
  workouts: [
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'Тренировка всего тела',
      exercises: [
        // Беговая дорожка
        createWorkoutExercise(
          {
            id: '1009',
            name: 'Беговая дорожка',
            type: 'timed',
            sets: 1,
            duration: 300,
            restTime: 0,
            difficulty: 'beginner',
            muscleGroups: ['cardio', 'legs'],
            description: 'Кардио-тренировка на беговой дорожке',
            equipment: ['treadmill'],
            recommendations: ['Держите ровную осанку', 'Постепенно увеличивайте скорость'],
            imageUrl: '/images/exercises/treadmill.jpg',
            isPublic: true
          },
          1,
          0,
          { duration: 300 }
        ),
        // Пресс
        createWorkoutExercise(
          {
            id: '1013',
            name: 'Пресс',
            type: 'reps',
            sets: 4,
            reps: 20,
            restTime: 60,
            difficulty: 'beginner',
            muscleGroups: ['abs', 'core'],
            description: 'Классическое упражнение для мышц брюшного пресса',
            equipment: ['bodyweight'],
            recommendations: ['Держите поясницу прижатой к полу', 'Не тяните шею руками'],
            imageUrl: '/images/exercises/crunches.jpg',
            isPublic: true
          },
          4,
          60,
          { reps: 20 }
        ),
        // Тяга троса на бицепс
        createWorkoutExercise(
          {
            id: '1014',
            name: 'Тяга троса на бицепс',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['biceps', 'forearms'],
            description: 'Изолирующее упражнение для развития бицепсов на блочном тренажере',
            equipment: ['cable machine'],
            recommendations: ['Держите локти неподвижно', 'Контролируйте движение'],
            imageUrl: '/images/exercises/cable-biceps-curl.jpg',
            isPublic: true
          },
          3,
          60,
          { reps: 12, weight: 25 }
        ),
        // Жим в рычажном тренажере
        createWorkoutExercise(
          {
            id: '1015',
            name: 'Жим в рычажном тренажере',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['chest', 'triceps', 'shoulders'],
            description: 'Упражнение для развития грудных мышц в рычажном тренажере',
            equipment: ['machine'],
            recommendations: ['Держите спину прижатой к спинке', 'Контролируйте движение'],
            imageUrl: '/images/exercises/chest-press-machine.jpg',
            isPublic: true
          },
          3,
          60,
          { reps: 12, weight: 35 }
        ),
        // Вертикальная тяга узким хватом
        createWorkoutExercise(
          {
            id: '1016',
            name: 'Вертикальная тяга узким хватом',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['back', 'biceps'],
            description: 'Упражнение для развития широчайших мышц спины и бицепсов',
            equipment: ['cable machine'],
            recommendations: ['Тяните рукоятку к верхней части груди', 'Сводите лопатки'],
            imageUrl: '/images/exercises/close-grip-lat-pulldown.jpg',
            isPublic: true
          },
          3,
          60,
          { reps: 12, weight: 60 }
        ),
        // Жим гантелей сидя
        createWorkoutExercise(
          {
            id: '1017',
            name: 'Жим гантелей сидя',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'intermediate',
            muscleGroups: ['shoulders', 'triceps'],
            description: 'Упражнение для развития дельтовидных мышц и трицепсов',
            equipment: ['dumbbell', 'bench'],
            recommendations: ['Не прогибайте спину', 'Контролируйте движение гантелей'],
            imageUrl: '/images/exercises/dumbbell-shoulder-press.jpg',
            isPublic: true
          },
          3,
          60,
          { reps: 12, weight: 16 }
        ),
        // Становая тяга
        createWorkoutExercise(
          {
            id: '1002',
            name: 'Становая тяга',
            type: 'reps',
            sets: 3,
            reps: 12,
            restTime: 60,
            difficulty: 'advanced',
            muscleGroups: ['back', 'glutes', 'hamstrings'],
            description: 'Многосуставное упражнение для развития спины, ягодиц и задней поверхности бедра',
            equipment: ['barbell'],
            recommendations: ['Держите спину прямой', 'Не округляйте поясницу', 'Держите штангу ближе к телу'],
            imageUrl: '/images/exercises/deadlift.jpg',
            isPublic: true
          },
          3,
          60,
          { reps: 12, weight: 30 }
        )
      ]
    }
  ]
};

export const GYM_COMPLEX_WORKOUT_1: Program = {
  id: uuidv4(),
  name: 'Зал: комплексная тренировка №1',
  description: 'Комплексная тренировка для зала: кардио, грудные, спина, ноги, плечи, бицепс, пресс.',
  createdBy: 'system',
  isPublic: true,
  isSample: true,
  category: 'gym',
  difficulty: 2,
  weeks: 1,
  restBetweenSets: 60,
  restBetweenExercises: 120,
  workouts: [
    {
      id: uuidv4(),
      programId: '', // будет подставлен при инициализации
      name: 'Комплексная тренировка',
      exercises: [
        createWorkoutExercise(getExerciseByName('Беговая дорожка') || { id: '1009', name: 'Беговая дорожка' } as Exercise, 1, 0, { duration: 240 }),
        createWorkoutExercise(getExerciseByName('Жим в рычажном тренажере') || { id: '1015', name: 'Жим в рычажном тренажере' } as Exercise, 3, 60, { reps: 12, weight: 35 }),
        createWorkoutExercise(getExerciseByName('Вертикальная тяга узким хватом') || { id: '1016', name: 'Вертикальная тяга узким хватом' } as Exercise, 3, 60, { reps: 12, weight: 60 }),
        createWorkoutExercise(getExerciseByName('Выпады в тренажере Смита') || { id: '2001', name: 'Выпады в тренажере Смита' } as Exercise, 3, 60, { reps: 12, weight: 37.5 }),
        createWorkoutExercise(getExerciseByName('Жим гантелей сидя') || { id: '1017', name: 'Жим гантелей сидя' } as Exercise, 3, 60, { reps: 12, weight: 16 }),
        createWorkoutExercise(getExerciseByName('Тяга троса на бицепс') || { id: '1014', name: 'Тяга троса на бицепс' } as Exercise, 3, 60, { reps: 12, weight: 25 }),
        createWorkoutExercise(getExerciseByName('Подъем ног в висе с поворотами') || { id: '2002', name: 'Подъем ног в висе с поворотами' } as Exercise, 4, 60, { reps: 20 })
      ]
    }
  ]
}; 