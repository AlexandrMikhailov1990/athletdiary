import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';

// Упражнения йоги для спины
export const YOGA_BACK_EXERCISES: Exercise[] = [
  {
    id: uuidv4(),
    name: 'Вращения в локтях назад',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'upper_back'],
    description: 'Стоя прямо, руки согнуты в локтях на уровне плеч. Выполняйте круговые движения локтями назад, разминая плечевой пояс.',
    equipment: ['bodyweight'],
    recommendations: ['Держите спину прямо', 'Движения должны быть плавными', 'Дышите равномерно']
  },
  {
    id: uuidv4(),
    name: 'Перекрестные касания',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'upper_back'],
    description: 'Стоя прямо, поочередно касайтесь противоположного плеча рукой, выполняя перекрестные движения.',
    equipment: ['bodyweight'],
    recommendations: ['Старайтесь максимально растягивать мышцы спины', 'Не спешите, выполняйте движения осознанно']
  },
  {
    id: uuidv4(),
    name: 'Треугольник верх-низ',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Выполняйте движения руками, образуя треугольник сверху вниз, растягивая мышцы спины и плеч.',
    equipment: ['bodyweight'],
    recommendations: ['Следите за правильной осанкой', 'Движения должны быть плавными']
  },
  {
    id: uuidv4(),
    name: 'Замок - зарядка',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Сцепите руки в замок за спиной и выполняйте растягивающие движения, раскрывая грудную клетку.',
    equipment: ['bodyweight'],
    recommendations: ['Не перенапрягайте плечи', 'Дышите глубоко и равномерно']
  },
  {
    id: uuidv4(),
    name: 'Кошка - корова',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'upper_back'],
    description: 'На четвереньках чередуйте прогиб спины вниз (поза коровы) и выгибание спины вверх (поза кошки).',
    equipment: ['bodyweight'],
    recommendations: ['Движения выполняйте в такт с дыханием', 'Следите за плавностью переходов']
  },
  {
    id: uuidv4(),
    name: 'Выталкивания в кобру',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'core'],
    description: 'Лежа на животе, плавно поднимайте верхнюю часть тела, опираясь на руки, переходя в позу кобры.',
    equipment: ['bodyweight'],
    recommendations: ['Не запрокидывайте голову', 'Движения должны быть плавными', 'Следите за дыханием']
  },
  {
    id: uuidv4(),
    name: 'Притягивания',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Выполняйте притягивающие движения руками, работая мышцами спины и плечевого пояса.',
    equipment: ['bodyweight'],
    recommendations: ['Концентрируйтесь на работе мышц спины', 'Сохраняйте ровное положение корпуса']
  },
  {
    id: uuidv4(),
    name: 'Пульсация «крылья»',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['upper_back', 'shoulders'],
    description: 'Разведите руки в стороны как крылья и выполняйте пульсирующие движения назад, работая мышцами спины.',
    equipment: ['bodyweight'],
    recommendations: ['Держите руки прямыми', 'Концентрируйтесь на мышцах спины']
  },
  {
    id: uuidv4(),
    name: 'Касания «полкруг»',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Выполняйте круговые движения руками, описывая полукруг и растягивая мышцы спины.',
    equipment: ['bodyweight'],
    recommendations: ['Движения должны быть плавными', 'Следите за осанкой']
  },
  {
    id: uuidv4(),
    name: 'Тяга к груди',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Выполняйте тянущие движения руками к груди, имитируя тягу, работая мышцами спины.',
    equipment: ['bodyweight'],
    recommendations: ['Следите за правильной техникой', 'Концентрируйтесь на работе мышц спины']
  },
  {
    id: uuidv4(),
    name: 'Собака мордой вниз',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders', 'hamstrings'],
    description: 'Из положения на четвереньках поднимите таз вверх, выпрямляя руки и ноги, формируя перевернутую букву V.',
    equipment: ['bodyweight'],
    recommendations: ['Старайтесь выпрямить ноги', 'Тянитесь пятками к полу', 'Распределите вес между руками и ногами']
  },
  {
    id: uuidv4(),
    name: 'Поза ребенка',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders'],
    description: 'Сядьте на пятки, наклонитесь вперед, вытянув руки перед собой, расслабляя спину и плечи.',
    equipment: ['bodyweight'],
    recommendations: ['Полностью расслабьте спину', 'Дышите глубоко и равномерно', 'Можно покачиваться влево-вправо для большего расслабления']
  },
  // Добавляем недостающие упражнения
  {
    id: uuidv4(),
    name: 'Поза кошки-коровы',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'upper_back'],
    description: 'На четвереньках чередуйте прогиб спины вниз (поза коровы) и выгибание спины вверх (поза кошки), синхронизируя движения с дыханием.',
    equipment: ['bodyweight'],
    recommendations: ['Вдыхайте при прогибе вниз', 'Выдыхайте при выгибании вверх', 'Движения должны быть плавными']
  },
  {
    id: uuidv4(),
    name: 'Поза собаки мордой вниз',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['back', 'shoulders', 'hamstrings'],
    description: 'Из положения на четвереньках поднимите таз вверх, выпрямляя руки и ноги, формируя перевернутую букву V. Тянитесь пятками к полу.',
    equipment: ['bodyweight'],
    recommendations: ['Равномерно распределите вес', 'Не блокируйте локти', 'Дышите равномерно']
  },
  {
    id: uuidv4(),
    name: 'Поза кобры',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'core'],
    description: 'Лежа на животе, поднимите верхнюю часть тела, опираясь на руки, раскрывая грудную клетку и растягивая переднюю часть тела.',
    equipment: ['bodyweight'],
    recommendations: ['Не перенапрягайте поясницу', 'Плечи опустите от ушей', 'Взгляд направлен вперед, не запрокидывайте голову']
  },
  {
    id: uuidv4(),
    name: 'Поза голубя',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'intermediate',
    muscleGroups: ['hips', 'lower_back', 'glutes'],
    description: 'Из положения на четвереньках выведите одну ногу вперед, сгибая колено и располагая голень параллельно передней части коврика. Вторую ногу вытяните назад.',
    equipment: ['bodyweight'],
    recommendations: ['При дискомфорте подложите подушку под бедро', 'Держите таз ровно', 'Дышите глубоко, расслабляясь в позе']
  },
  {
    id: uuidv4(),
    name: 'Скручивание лежа',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['spine', 'core', 'lower_back'],
    description: 'Лежа на спине, согните колени. Опустите их вместе в одну сторону, поворачивая корпус и растягивая позвоночник в скручивании.',
    equipment: ['bodyweight'],
    recommendations: ['Держите оба плеча на полу', 'Дышите глубоко в скручивании', 'Выполняйте на обе стороны для баланса']
  },
  {
    id: uuidv4(),
    name: 'Поза бабочки',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['hips', 'inner_thighs', 'groin'],
    description: 'Сидя, соедините подошвы стоп вместе, колени разведите в стороны. Наклоняйтесь вперед от бедер для более глубокой растяжки.',
    equipment: ['bodyweight'],
    recommendations: ['Не надавливайте на колени', 'Держите спину прямой', 'Дышите равномерно']
  },
  {
    id: uuidv4(),
    name: 'Поза моста',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['glutes', 'lower_back', 'hamstrings'],
    description: 'Лежа на спине, согните колени, поставьте стопы на пол. Поднимите таз вверх, создавая прямую линию от плеч до колен.',
    equipment: ['bodyweight'],
    recommendations: ['Активно напрягайте ягодицы', 'Держите колени параллельно', 'Дышите равномерно']
  },
  {
    id: uuidv4(),
    name: 'Поза трупа',
    type: 'timed',
    sets: 1,
    duration: 45,
    restTime: 40,
    difficulty: 'beginner',
    muscleGroups: ['full_body'],
    description: 'Лежа на спине, полностью расслабьте все тело. Руки слегка в стороны ладонями вверх, ноги расслаблены и слегка разведены.',
    equipment: ['bodyweight'],
    recommendations: ['Полностью расслабьтесь', 'Сконцентрируйтесь на дыхании', 'Отпустите все мысли и напряжение']
  }
];

// Функция для добавления упражнений в localStorage
export function addYogaBackExercises(): void {
  try {
    const savedExercises = localStorage.getItem('exercises');
    let userExercises = savedExercises ? JSON.parse(savedExercises) : [];
    
    // Проверяем каждое упражнение на наличие дубликатов
    YOGA_BACK_EXERCISES.forEach(exercise => {
      const existingExercise = userExercises.find((e: Exercise) => e.name === exercise.name);
      if (!existingExercise) {
        userExercises.push(exercise);
      } else {
        // Обновляем существующее упражнение, чтобы применить новое время отдыха
        const index = userExercises.findIndex((e: Exercise) => e.name === exercise.name);
        userExercises[index] = exercise;
      }
    });
    
    localStorage.setItem('exercises', JSON.stringify(userExercises));
    console.log('Упражнения йоги для спины добавлены/обновлены');
  } catch (error) {
    console.error('Ошибка при добавлении упражнений йоги:', error);
  }
} 