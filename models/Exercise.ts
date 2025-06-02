export interface BaseExercise {
  id: string;
  name: string;
  type: 'reps' | 'timed';
  sets: number;
  restTime: number; // в секундах
  imageUrl?: string; // добавляем опциональное поле для изображения
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment?: string[];
  recommendations?: string[];
}

export interface RepsExercise extends BaseExercise {
  type: 'reps';
  reps: number;
  weight?: number;
}

export interface TimedExercise extends BaseExercise {
  type: 'timed';
  duration: number; // в секундах
}

export interface Exercise {
  id: string;
  name: string;
  type: 'reps' | 'timed'; // reps - повторение, timed - временное упражнение
  sets?: number; // Количество подходов
  reps?: number; // Количество повторений (для упражнений типа reps)
  duration?: number; // Продолжительность в секундах (для упражнений типа timed)
  restTime?: number; // Отдых между подходами в секундах
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[]; // Группы мышц, задействованные в упражнении
  description: string;
  equipment?: string[]; // Необходимое оборудование
  recommendations?: string[]; // Рекомендации по выполнению
  video?: string; // URL видео с демонстрацией
  image?: string; // URL изображения
  imageUrl?: string; // Альтернативное название для URL изображения (для обратной совместимости)
  weight?: number; // Вес в кг (для силовых упражнений)
  calories?: number; // Примерный расход калорий за минуту
  isPublic?: boolean; // Публичное упражнение или пользовательское
  createdBy?: string; // ID пользователя, создавшего упражнение
}

// Словари для перевода
export const muscleGroupTranslations: Record<string, string> = {
  'chest': 'Грудь',
  'back': 'Спина',
  'shoulders': 'Плечи',
  'biceps': 'Бицепс',
  'triceps': 'Трицепс',
  'forearms': 'Предплечья',
  'abs': 'Пресс',
  'core': 'Кор',
  'quads': 'Квадрицепсы',
  'hamstrings': 'Бицепс бедра',
  'glutes': 'Ягодицы',
  'calves': 'Икры',
  'traps': 'Трапеции',
  'lats': 'Широчайшие',
  'legs': 'Ноги',
  'lower_back': 'Нижняя часть спины',
  'full_body': 'Все тело',
  'arms': 'Руки',
  'cardio': 'Кардио',
  'deltoids': 'Дельты',
};

export const difficultyTranslations: Record<string, string> = {
  'beginner': 'Начинающий',
  'intermediate': 'Средний',
  'advanced': 'Продвинутый'
};

export const equipmentTranslations: Record<string, string> = {
  'barbell': 'Штанга',
  'dumbbell': 'Гантели',
  'kettlebell': 'Гиря',
  'resistance bands': 'Резиновые петли',
  'pull-up bar': 'Турник',
  'bench': 'Скамья',
  'stability ball': 'Фитбол',
  'medicine ball': 'Медбол',
  'cable machine': 'Тросовый тренажер',
  'squat rack': 'Силовая рама',
  'bodyweight': 'Вес тела',
  'treadmill': 'Беговая дорожка',
  'exercise bike': 'Велотренажер',
  'elliptical': 'Эллиптический тренажер',
  'rowing machine': 'Гребной тренажер',
  'machine': 'Тренажер',
  'resistance band': 'Резиновая лента',
  'cable': 'Тросовый тренажер',
  'box': 'Бокс',
  'none': 'Без оборудования',
  'yoga mat': 'Коврик для йоги',
};

// Функция для перевода названия группы мышц
export function translateMuscleGroup(muscleGroup: string): string {
  return muscleGroupTranslations[muscleGroup] || muscleGroup;
}

// Функция для перевода сложности
export function translateDifficulty(difficulty: string): string {
  return difficultyTranslations[difficulty] || difficulty;
}

// Функция для перевода оборудования
export function translateEquipment(equipment: string): string {
  const translations: { [key: string]: string } = {
    'bodyweight': 'Без инвентаря',
    'none': 'Без инвентаря',
    'dumbbell': 'Гантели',
    'dumbbells': 'Гантели',
    'barbell': 'Штанга',
    'kettlebell': 'Гиря',
    'resistance bands': 'Резиновые ленты',
    'resistance band': 'Резиновая лента',
    'pull-up bar': 'Турник',
    'pullup bar': 'Турник',
    'yoga mat': 'Коврик для йоги',
    'bench': 'Скамья',
    'jump rope': 'Скакалка',
    'medicine ball': 'Медбол',
    'foam roller': 'Валик для массажа',
    'box': 'Плиометрический бокс',
    'rings': 'Гимнастические кольца',
    'parallettes': 'Параллетсы',
    'weight': 'Отягощение',
    'weight plate': 'Блины для штанги',
    'cable machine': 'Тросовый тренажер',
    'cable': 'Тросовый тренажер',
    'smith machine': 'Машина Смита',
    'power rack': 'Силовая рама',
    'squat rack': 'Силовая рама',
    'stability ball': 'Фитбол',
    'treadmill': 'Беговая дорожка',
    'exercise bike': 'Велотренажер',
    'elliptical': 'Эллиптический тренажер',
    'rowing machine': 'Гребной тренажер',
    'machine': 'Тренажер',
    'bands': 'Резиновые ленты',
    'mat': 'Коврик',
    'pull up bar': 'Турник',
    'pull-ups': 'Турник',
    'weights': 'Отягощения'
  };

  return translations[equipment.toLowerCase()] || equipment;
}

// Примеры упражнений
export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Приседания',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['legs', 'glutes'],
    description: 'Базовое упражнение для ног',
    equipment: [],
    recommendations: ['Держите спину прямо', 'Колени не выходят за носки'],
    imageUrl: '/images/exercises/squats.jpg'
  },
  {
    id: '2',
    name: 'Жим лежа',
    type: 'reps',
    sets: 3,
    reps: 10,
    weight: 60,
    restTime: 120,
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Базовое упражнение для верхней части тела',
    equipment: ['barbell', 'bench'],
    recommendations: ['Держите локти под грудью', 'Контролируйте движение'],
    imageUrl: '/images/exercises/bench-press.jpg'
  },
  {
    id: '3',
    name: 'Планка',
    type: 'timed',
    sets: 3,
    duration: 60,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['core', 'shoulders'],
    description: 'Статическое упражнение для укрепления корпуса',
    equipment: [],
    recommendations: ['Держите тело прямым', 'Напрягайте пресс'],
    imageUrl: '/images/exercises/plank.jpg'
  },
  {
    id: '1001',
    name: 'Жим штанги лежа',
    type: 'reps',
    sets: 4,
    reps: 8,
    restTime: 120,
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Базовое упражнение для развития грудных мышц, трицепсов и передних дельт.',
    equipment: ['barbell', 'bench'],
    recommendations: ['Держите спину и ягодицы прижатыми к скамье', 'Контролируйте движение штанги'],
    imageUrl: '/images/exercises/barbell-bench-press.jpg',
    isPublic: true
  },
  {
    id: '1002',
    name: 'Становая тяга',
    type: 'reps',
    sets: 4,
    reps: 6,
    restTime: 150,
    difficulty: 'advanced',
    muscleGroups: ['back', 'glutes', 'hamstrings'],
    description: 'Многосуставное упражнение для развития спины, ягодиц и задней поверхности бедра.',
    equipment: ['barbell'],
    recommendations: ['Держите спину прямой', 'Не округляйте поясницу', 'Держите штангу ближе к телу'],
    imageUrl: '/images/exercises/deadlift.jpg',
    isPublic: true
  },
  {
    id: '1003',
    name: 'Приседания со штангой',
    type: 'reps',
    sets: 4,
    reps: 8,
    restTime: 120,
    difficulty: 'intermediate',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    description: 'Базовое упражнение для развития ног и ягодиц.',
    equipment: ['barbell', 'squat rack'],
    recommendations: ['Колени не выходят за носки', 'Держите спину прямо'],
    imageUrl: '/images/exercises/barbell-squat.jpg',
    isPublic: true
  },
  {
    id: '1004',
    name: 'Тяга верхнего блока',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 90,
    difficulty: 'beginner',
    muscleGroups: ['back', 'biceps'],
    description: 'Упражнение для широчайших мышц спины и бицепсов.',
    equipment: ['cable machine'],
    recommendations: ['Тяните рукоятку к верхней части груди', 'Не раскачивайте корпус'],
    imageUrl: '/images/exercises/lat-pulldown.jpg',
    isPublic: true
  },
  {
    id: '1005',
    name: 'Жим гантелей сидя',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 90,
    difficulty: 'intermediate',
    muscleGroups: ['shoulders', 'triceps'],
    description: 'Упражнение для развития дельтовидных мышц и трицепсов.',
    equipment: ['dumbbell', 'bench'],
    recommendations: ['Не прогибайте спину', 'Контролируйте движение гантелей'],
    imageUrl: '/images/exercises/dumbbell-shoulder-press.jpg',
    isPublic: true
  },
  {
    id: '1006',
    name: 'Разведение гантелей в стороны',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'deltoids'],
    description: 'Изолирующее упражнение для средней дельты.',
    equipment: ['dumbbell'],
    recommendations: ['Не поднимайте гантели выше уровня плеч', 'Держите локти слегка согнутыми'],
    imageUrl: '/images/exercises/lateral-raise.jpg',
    isPublic: true
  },
  {
    id: '1007',
    name: 'Сгибание рук с гантелями стоя',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['biceps', 'forearms'],
    description: 'Классическое упражнение для бицепсов.',
    equipment: ['dumbbell'],
    recommendations: ['Не раскачивайте корпус', 'Держите локти прижатыми к туловищу'],
    imageUrl: '/images/exercises/dumbbell-biceps-curl.jpg',
    isPublic: true
  },
  {
    id: '1008',
    name: 'Французский жим лежа',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 90,
    difficulty: 'intermediate',
    muscleGroups: ['triceps'],
    description: 'Изолирующее упражнение для трицепсов.',
    equipment: ['barbell', 'bench'],
    recommendations: ['Держите локти неподвижно', 'Опускайте штангу к верхней части головы'],
    imageUrl: '/images/exercises/skull-crusher.jpg',
    isPublic: true
  },
  {
    id: '1009',
    name: 'Беговая дорожка',
    type: 'timed',
    sets: 1,
    duration: 900,
    restTime: 0,
    difficulty: 'beginner',
    muscleGroups: ['cardio', 'legs'],
    description: 'Кардио-тренировка на беговой дорожке.',
    equipment: ['treadmill'],
    recommendations: ['Держите ровную осанку', 'Постепенно увеличивайте скорость'],
    imageUrl: '/images/exercises/treadmill.jpg',
    isPublic: true
  },
  {
    id: '1010',
    name: 'Велотренажер',
    type: 'timed',
    sets: 1,
    duration: 900,
    restTime: 0,
    difficulty: 'beginner',
    muscleGroups: ['cardio', 'legs'],
    description: 'Кардио-тренировка на велотренажере.',
    equipment: ['exercise bike'],
    recommendations: ['Держите спину прямо', 'Регулируйте высоту сиденья'],
    imageUrl: '/images/exercises/exercise-bike.jpg',
    isPublic: true
  },
  {
    id: '1011',
    name: 'Эллиптический тренажер',
    type: 'timed',
    sets: 1,
    duration: 900,
    restTime: 0,
    difficulty: 'beginner',
    muscleGroups: ['cardio', 'legs', 'arms'],
    description: 'Кардио-тренировка на эллиптическом тренажере.',
    equipment: ['elliptical'],
    recommendations: ['Держите спину прямо', 'Работайте руками и ногами синхронно'],
    imageUrl: '/images/exercises/elliptical.jpg',
    isPublic: true
  },
  {
    id: '1012',
    name: 'Гребной тренажер',
    type: 'timed',
    sets: 1,
    duration: 900,
    restTime: 0,
    difficulty: 'beginner',
    muscleGroups: ['cardio', 'back', 'arms'],
    description: 'Кардио и силовая тренировка на гребном тренажере.',
    equipment: ['rowing machine'],
    recommendations: ['Синхронизируйте движение рук и ног', 'Держите спину прямо'],
    imageUrl: '/images/exercises/rowing-machine.jpg',
    isPublic: true
  },
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
  }
];

export const pushUps: RepsExercise = {
  id: '1',
  name: 'Push-ups',
  type: 'reps',
  sets: 3,
  reps: 10,
  restTime: 60,
  difficulty: 'beginner',
  muscleGroups: ['chest', 'triceps', 'shoulders'],
  description: 'A classic bodyweight exercise targeting chest, triceps, and shoulders',
  equipment: [],
  recommendations: ['Keep your core tight', 'Maintain straight body alignment'],
  imageUrl: '/images/exercises/push-ups.jpg'
};

export const benchPress: RepsExercise = {
  id: '2',
  name: 'Bench Press',
  type: 'reps',
  sets: 4,
  reps: 8,
  weight: 60,
  restTime: 90,
  difficulty: 'intermediate',
  muscleGroups: ['chest', 'triceps', 'shoulders'],
  description: 'A compound exercise for building upper body strength',
  equipment: ['barbell', 'bench'],
  recommendations: ['Keep your feet planted', 'Control the weight throughout'],
  imageUrl: '/images/exercises/bench-press.jpg'
};

export const plank: TimedExercise = {
  id: '3',
  name: 'Plank',
  type: 'timed',
  sets: 3,
  duration: 60,
  restTime: 45,
  difficulty: 'beginner',
  muscleGroups: ['core', 'shoulders'],
  description: 'An isometric exercise that strengthens your core',
  equipment: [],
  recommendations: ['Keep your body straight', 'Engage your core'],
  imageUrl: '/images/exercises/plank.jpg'
};

// Добавим функцию для нормализации свойств image и imageUrl
export function normalizeExerciseImageUrls(exercise: Exercise): Exercise {
  const normalizedExercise = { ...exercise };
  
  // Если есть только imageUrl, добавим его как image
  if (normalizedExercise.imageUrl && !normalizedExercise.image) {
    normalizedExercise.image = normalizedExercise.imageUrl;
  }
  
  // Если есть только image, добавим его как imageUrl
  if (normalizedExercise.image && !normalizedExercise.imageUrl) {
    normalizedExercise.imageUrl = normalizedExercise.image;
  }
  
  return normalizedExercise;
}

// Применяем нормализацию к примерам упражнений
export const NORMALIZED_SAMPLE_EXERCISES = SAMPLE_EXERCISES.map(normalizeExerciseImageUrls);

// Упражнения с резиновыми лентами
export const RESISTANCE_BAND_EXERCISES: Exercise[] = [
  {
    id: 'rb-1',
    name: 'Тяга резиновой ленты к груди',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders', 'biceps'],
    description: 'Упражнение для развития мышц спины и рук с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Встаньте прямо, ноги на ширине плеч',
      'Удерживайте ленту перед собой на уровне груди',
      'Отведите локти назад, сведя лопатки вместе',
      'Медленно вернитесь в исходное положение'
    ],
    isPublic: true
  },
  {
    id: 'rb-2',
    name: 'Боковые подъемы рук с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'deltoids'],
    description: 'Упражнение для развития плечевых и дельтовидных мышц с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Встаньте на середину ленты обеими ногами',
      'Держите концы ленты в руках по бокам',
      'Поднимите руки в стороны до уровня плеч',
      'Контролируйте движение при опускании'
    ],
    isPublic: true
  },
  {
    id: 'rb-3',
    name: 'Приседания с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    description: 'Приседания с дополнительным сопротивлением резиновой ленты для более эффективной тренировки ног',
    equipment: ['resistance bands'],
    recommendations: [
      'Поместите ленту под ступни и держите её концы на плечах',
      'Держите спину прямо, грудь вперед',
      'Приседайте до параллели бедер с полом или ниже',
      'Выпрямляйтесь, активно работая ягодицами'
    ],
    isPublic: true
  },
  {
    id: 'rb-4',
    name: 'Сгибание рук на бицепс с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['biceps', 'forearms'],
    description: 'Упражнение для развития бицепсов с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Встаньте на середину ленты ногами',
      'Держите концы ленты в руках, ладони вперед',
      'Сгибайте руки, не двигая локтями',
      'Медленно опускайте руки в исходное положение'
    ],
    isPublic: true
  },
  {
    id: 'rb-5',
    name: 'Разгибание рук с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['triceps'],
    description: 'Упражнение для развития трицепсов с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Закрепите ленту на высоте над головой',
      'Возьмите концы ленты обеими руками',
      'Локти держите близко к голове',
      'Разгибайте руки вниз до полного выпрямления'
    ],
    isPublic: true
  },
  {
    id: 'rb-6',
    name: 'Разведение рук с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['chest', 'shoulders'],
    description: 'Упражнение для развития грудных мышц с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Оберните ленту вокруг верхней части спины',
      'Держите руки перед собой на уровне груди',
      'Разводите руки в стороны, растягивая ленту',
      'Медленно возвращайтесь в исходное положение'
    ],
    isPublic: true
  },
  {
    id: 'rb-7',
    name: 'Подъемы ног в сторону с резиновой лентой',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 45,
    difficulty: 'intermediate',
    muscleGroups: ['glutes', 'quads'],
    description: 'Упражнение для укрепления боковых мышц бедра и ягодиц',
    equipment: ['resistance bands'],
    recommendations: [
      'Поместите ленту чуть выше колен',
      'Встаньте прямо, ноги на ширине плеч',
      'Поднимайте ногу в сторону, сохраняя напряжение в ленте',
      'Вернитесь в исходное положение и повторите с другой ногой'
    ],
    isPublic: true
  },
  {
    id: 'rb-8',
    name: 'Тяга резиновой ленты к поясу',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['back', 'lats'],
    description: 'Упражнение для развития широчайших мышц спины с использованием резиновой ленты',
    equipment: ['resistance bands'],
    recommendations: [
      'Закрепите ленту на уровне груди',
      'Сядьте с прямой спиной, ноги вытянуты вперед',
      'Тяните ленту к поясу, сводя лопатки',
      'Медленно возвращайтесь в исходное положение'
    ],
    isPublic: true
  }
];

// Добавляем упражнения с резиновыми лентами в функцию getAllExercises
export function getAllExercises(): Exercise[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedExercises = localStorage.getItem('userExercises');
    if (savedExercises) {
      // Объединяем пользовательские упражнения с примерами и упражнениями с резиновыми лентами
      const parsedExercises = JSON.parse(savedExercises);
      const predefinedExercises = [...NORMALIZED_SAMPLE_EXERCISES, ...RESISTANCE_BAND_EXERCISES];
      
      return [...parsedExercises, ...predefinedExercises.filter(ex => 
        !parsedExercises.some((savedEx: Exercise) => savedEx.id === ex.id)
      )];
    }
  } catch (error) {
    console.error('Ошибка при загрузке упражнений:', error);
  }
  
  // Если не удалось загрузить пользовательские упражнения, возвращаем только примеры и упражнения с резиновыми лентами
  return [...NORMALIZED_SAMPLE_EXERCISES, ...RESISTANCE_BAND_EXERCISES];
}

// Функция для получения упражнения по ID
export function getExerciseById(exerciseId: string): Exercise | undefined {
  const allExercises = getAllExercises();
  return allExercises.find(ex => ex.id === exerciseId);
}

// Сохранение упражнения
export function saveExercise(exercise: Exercise): void {
  if (typeof window === 'undefined') return;
  
  try {
    const exercises = getAllExercises();
    const existingIndex = exercises.findIndex(e => e.id === exercise.id);
    
    if (existingIndex >= 0) {
      // Обновляем существующее упражнение
      exercises[existingIndex] = exercise;
    } else {
      // Добавляем новое упражнение
      exercises.push(exercise);
    }
    
    localStorage.setItem('userExercises', JSON.stringify(exercises));
  } catch (error) {
    console.error('Ошибка при сохранении упражнения:', error);
  }
}

// Удаление упражнения
export function deleteExercise(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    let exercises = getAllExercises();
    exercises = exercises.filter(exercise => exercise.id !== id);
    localStorage.setItem('userExercises', JSON.stringify(exercises));
  } catch (error) {
    console.error('Ошибка при удалении упражнения:', error);
  }
}

// Получение всех групп мышц
export function getAllMuscleGroups(): string[] {
  return Object.keys(muscleGroupTranslations).sort();
}

// Получение всех типов оборудования
export function getAllEquipment(): string[] {
  return Object.keys(equipmentTranslations).sort();
}

// Инициализация демо-упражнений если их нет в системе
export function initializeExercises(): void {
  if (typeof window === 'undefined') return;
  
  const existingExercises = getAllExercises();
  if (existingExercises.length > 0) return;
  
  const demoExercises: Exercise[] = [
    {
      id: '1',
      name: 'Отжимания',
      description: 'Классическое упражнение для развития верхней части тела, особенно грудных мышц и трицепсов.',
      imageUrl: '/images/exercises/pushup.jpg',
      muscleGroups: ['chest', 'triceps', 'shoulders', 'core'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      type: 'reps',
      reps: 10,
      isPublic: true,
    },
    {
      id: '2',
      name: 'Приседания',
      description: 'Базовое упражнение для нижней части тела, развивающее квадрицепсы, ягодицы и кор.',
      imageUrl: '/images/exercises/squat.jpg',
      muscleGroups: ['legs', 'glutes', 'core'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      type: 'reps',
      reps: 15,
      isPublic: true,
    },
    {
      id: '3',
      name: 'Планка',
      description: 'Статическое упражнение, укрепляющее корпус, плечи и спину.',
      imageUrl: '/images/exercises/plank.jpg',
      muscleGroups: ['core', 'shoulders', 'back'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      type: 'timed',
      duration: 30,
      isPublic: true,
    },
    {
      id: '4',
      name: 'Подтягивания',
      description: 'Упражнение для развития верхней части спины, бицепсов и предплечий.',
      imageUrl: '/images/exercises/pullup.jpg',
      muscleGroups: ['back', 'biceps', 'forearms'],
      equipment: ['pull-up bar'],
      difficulty: 'intermediate',
      type: 'reps',
      reps: 8,
      isPublic: true,
    },
    {
      id: '5',
      name: 'Жим гантелей лежа',
      description: 'Упражнение для развития грудных мышц, передних дельт и трицепсов.',
      imageUrl: '/images/exercises/dumbbell-bench-press.jpg',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      equipment: ['dumbbell', 'bench'],
      difficulty: 'intermediate',
      type: 'reps',
      reps: 10,
      isPublic: true,
    },
    {
      id: '6',
      name: 'Бурпи',
      description: 'Комплексное упражнение, активизирующее все тело и улучшающее выносливость.',
      imageUrl: '/images/exercises/burpee.jpg',
      muscleGroups: ['fullbody', 'cardio'],
      equipment: ['bodyweight'],
      difficulty: 'intermediate',
      type: 'timed',
      duration: 45,
      isPublic: true,
    },
    {
      id: '7',
      name: 'Становая тяга',
      description: 'Базовое упражнение для развития задней цепи мышц - спины, ягодиц, задней поверхности бедра.',
      imageUrl: '/images/exercises/deadlift.jpg',
      muscleGroups: ['back', 'glutes', 'hamstrings'],
      equipment: ['barbell'],
      difficulty: 'advanced',
      type: 'reps',
      reps: 8,
      isPublic: true,
    },
    {
      id: '8',
      name: 'Скручивания на пресс',
      description: 'Упражнение для укрепления мышц брюшного пресса.',
      imageUrl: '/images/exercises/crunches.jpg',
      muscleGroups: ['abs', 'core'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      type: 'reps',
      reps: 15,
      isPublic: true,
    },
    {
      id: '9',
      name: 'Выпады',
      description: 'Упражнение для развития ног с акцентом на квадрицепсы и ягодицы.',
      imageUrl: '/images/exercises/lunges.jpg',
      muscleGroups: ['legs', 'glutes'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      type: 'reps',
      reps: 12,
      isPublic: true,
    },
    {
      id: '10',
      name: 'Махи гирей',
      description: 'Динамическое упражнение для развития мощности нижней части тела и кардио-нагрузки.',
      imageUrl: '/images/exercises/kettlebell-swing.jpg',
      muscleGroups: ['glutes', 'hamstrings', 'core', 'cardio'],
      equipment: ['kettlebell'],
      difficulty: 'intermediate',
      type: 'reps',
      reps: 15,
      isPublic: true,
    },
  ];
  
  localStorage.setItem('userExercises', JSON.stringify(demoExercises));
} 