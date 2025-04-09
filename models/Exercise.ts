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