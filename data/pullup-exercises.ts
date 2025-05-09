import { Exercise } from '../models/Exercise';

// Массив подтягиваний различными хватами
export const pullupExercises: Exercise[] = [
  {
    id: '11',
    name: 'Подтягивания прямым хватом',
    description: 'Классические подтягивания прямым хватом на ширине плеч. Отлично развивает мышцы спины и бицепсы.',
    imageUrl: '/images/exercises/pullup-normal.jpg',
    muscleGroups: ['back', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    sets: 3,
    reps: 8,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '12',
    name: 'Подтягивания обратным хватом',
    description: 'Подтягивания обратным хватом (ладони к себе). Акцент смещается на бицепсы, также хорошо прорабатывает нижнюю часть широчайших мышц спины.',
    imageUrl: '/images/exercises/pullup-reverse.jpg',
    muscleGroups: ['back', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 6,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '13',
    name: 'Подтягивания широким хватом',
    description: 'Подтягивания с широким хватом акцентируют нагрузку на верхнюю и среднюю часть широчайших мышц спины, делая их более массивными и V-образными.',
    imageUrl: '/images/exercises/pullup-wide.jpg',
    muscleGroups: ['back', 'traps', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 6,
    restTime: 120,
    isPublic: true,
  },
  {
    id: '14',
    name: 'Подтягивания параллельным хватом',
    description: 'Подтягивания параллельным (нейтральным) хватом снижают нагрузку на плечевые суставы и хорошо прорабатывают нижнюю часть широчайших мышц спины.',
    imageUrl: '/images/exercises/pullup-neutral.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 7,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '15',
    name: 'Подтягивания разнохватом',
    description: 'Подтягивания с одной рукой в прямом, а другой в обратном хвате. Хорошо прорабатывает широчайшие и добавляет асимметричную нагрузку для баланса.',
    imageUrl: '/images/exercises/pullup-mixed.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar'],
    difficulty: 'advanced',
    type: 'reps',
    reps: 5,
    restTime: 120,
    isPublic: true,
  },
  {
    id: '16',
    name: 'Подтягивания с весом',
    description: 'Классические подтягивания с дополнительным отягощением на поясе или между ног. Отлично увеличивает силу и мышечную массу спины.',
    imageUrl: '/images/exercises/pullup-weighted.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar', 'weight'],
    difficulty: 'advanced',
    type: 'reps',
    reps: 4,
    weight: 10,
    restTime: 150,
    isPublic: true,
  }
]; 