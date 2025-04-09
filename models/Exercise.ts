export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
}

// Примеры упражнений для демонстрации
export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Жим штанги лежа',
    description: 'Базовое упражнение для развития силы и массы грудных мышц',
    muscleGroups: ['Грудные', 'Трицепс', 'Передние дельты'],
    difficulty: 'intermediate',
    equipment: ['Штанга', 'Скамья'],
    instructions: [
      'Лягте на скамью, поставив ноги на пол',
      'Возьмитесь за штангу хватом шире плеч',
      'Снимите штангу со стоек и опустите к середине груди',
      'Выжмите штангу вверх до полного выпрямления рук',
      'Повторите нужное количество раз'
    ],
    videoUrl: 'https://example.com/bench-press',
    imageUrl: '/images/bench-press.jpg'
  },
  {
    id: '2',
    name: 'Приседания со штангой',
    description: 'Базовое упражнение для развития ног и ягодичных мышц',
    muscleGroups: ['Квадрицепсы', 'Ягодичные', 'Бицепсы бедер', 'Икры'],
    difficulty: 'intermediate',
    equipment: ['Штанга', 'Стойка для приседаний'],
    instructions: [
      'Установите штангу на стойку на уровне плеч',
      'Встаньте под штангу, расположив ее на верхней части трапеций',
      'Снимите штангу со стойки и отойдите на шаг назад',
      'Присядьте, сгибая колени и бедра, пока бедра не будут параллельны полу',
      'Поднимитесь, выпрямляя ноги и возвращаясь в исходное положение',
      'Повторите нужное количество раз'
    ],
    videoUrl: 'https://example.com/squats',
    imageUrl: '/images/squats.jpg'
  },
  {
    id: '3',
    name: 'Становая тяга',
    description: 'Комплексное упражнение для развития силы спины и ног',
    muscleGroups: ['Спина', 'Ягодичные', 'Бицепсы бедер', 'Трапеции'],
    difficulty: 'advanced',
    equipment: ['Штанга'],
    instructions: [
      'Подойдите к штанге, стопы на ширине плеч',
      'Согните ноги в коленях, взявшись за гриф',
      'Держите спину прямой, взгляд направлен вперед',
      'Поднимите штангу, выпрямляя ноги и спину',
      'В верхней точке сведите лопатки',
      'Опустите штангу на пол, сохраняя прямую спину',
      'Повторите нужное количество раз'
    ],
    videoUrl: 'https://example.com/deadlift',
    imageUrl: '/images/deadlift.jpg'
  }
]; 