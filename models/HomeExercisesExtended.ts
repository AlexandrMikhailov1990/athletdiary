import { Exercise } from './Exercise';
import { v4 as uuidv4 } from 'uuid';

// Расширенный набор упражнений для домашних тренировок
export const EXTENDED_HOME_EXERCISES: Exercise[] = [
  // НОГИ
  {
    id: uuidv4(),
    name: 'Приседания с собственным весом',
    type: 'reps',
    sets: 3,
    reps: 20,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    description: 'Встаньте прямо, ноги на ширине плеч. Опуститесь, сгибая ноги в коленях и отводя таз назад, как будто садитесь на стул. Вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Держите спину прямо', 'Колени не должны выходить за линию носков', 'Опускайтесь до параллели бедер с полом']
  },
  {
    id: uuidv4(),
    name: 'Выпады на месте',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    description: 'Из положения стоя сделайте шаг вперед, опуститесь, сгибая обе ноги до угла 90°. Вернитесь в исходное положение и повторите с другой ноги.',
    equipment: ['bodyweight'],
    recommendations: ['Держите корпус прямо', 'Колено передней ноги не должно выходить за носок', 'Задняя нога слегка касается пола коленом']
  },
  {
    id: uuidv4(),
    name: 'Ягодичный мостик',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['glutes', 'hamstrings', 'lower_back'],
    description: 'Лягте на спину, согните ноги в коленях, стопы на полу. Поднимите таз вверх, напрягая ягодицы. Задержитесь на секунду, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Держите живот подтянутым', 'Не запрокидывайте голову', 'Выполняйте подъем силой ягодиц, не используя поясницу']
  },
  {
    id: uuidv4(),
    name: 'Подъемы на носки',
    type: 'reps',
    sets: 3,
    reps: 20,
    restTime: 30,
    difficulty: 'beginner',
    muscleGroups: ['calves'],
    description: 'Встаньте прямо, ноги на ширине плеч. Поднимитесь на носки как можно выше, затем опуститесь обратно.',
    equipment: ['bodyweight'],
    recommendations: ['Можно держаться за опору для равновесия', 'Поднимайтесь максимально высоко', 'Для усложнения выполняйте на одной ноге']
  },
  {
    id: uuidv4(),
    name: 'Полуприседания в плие',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'calves'],
    description: 'Встаньте, расставив ноги шире плеч, носки развернуты наружу. Опуститесь, сгибая колени и держа спину прямо. Вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Держите спину ровно', 'Колени направлены в сторону носков', 'Для усложнения возьмите в руки утяжеление']
  },

  // ГРУДЬ И ТРИЦЕПС
  {
    id: uuidv4(),
    name: 'Отжимания от пола',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Примите упор лежа, руки чуть шире плеч. Опустите тело, сгибая руки в локтях, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Держите тело прямым', 'Локти не разводите слишком широко', 'Для облегчения отжимайтесь с колен']
  },
  {
    id: uuidv4(),
    name: 'Отжимания с узкой постановкой рук',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['triceps', 'chest'],
    description: 'Примите упор лежа, руки под плечами или уже. Опустите тело, сгибая руки в локтях, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Локти направлены назад, не в стороны', 'Держите тело прямым', 'Для усложнения приподнимите ноги']
  },
  {
    id: uuidv4(),
    name: 'Отжимания с наклоном вверх',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Упритесь руками в возвышенность (стул, диван). Опустите тело, сгибая руки в локтях, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Чем выше опора, тем легче упражнение', 'Держите локти под углом 45° к корпусу', 'Сохраняйте прямую линию тела']
  },
  {
    id: uuidv4(),
    name: 'Отжимания с наклоном вниз',
    type: 'reps',
    sets: 3,
    reps: 8,
    restTime: 90,
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    description: 'Поставьте ноги на возвышенность (стул, диван), руки на полу. Опустите тело, сгибая руки в локтях, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Чем выше ноги, тем сложнее упражнение', 'Держите тело прямым', 'Опускайтесь до касания грудью пола']
  },
  {
    id: uuidv4(),
    name: 'Обратные отжимания от стула',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['triceps', 'shoulders'],
    description: 'Сядьте на край стула, руки по бокам, пальцы направлены вперед. Опуститесь, сгибая руки, затем поднимитесь обратно.',
    equipment: ['bodyweight'],
    recommendations: ['Держите локти близко к телу', 'Опускайтесь до угла 90° в локтях', 'Для усложнения вытяните ноги']
  },

  // СПИНА И БИЦЕПС
  {
    id: uuidv4(),
    name: 'Супермен',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['lower_back', 'glutes'],
    description: 'Лягте на живот, руки и ноги вытянуты. Одновременно поднимите руки и ноги от пола, задержитесь на 2 секунды, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Не запрокидывайте голову', 'Поднимайте конечности силой мышц спины', 'Дышите равномерно']
  },
  {
    id: uuidv4(),
    name: 'Обратная планка',
    type: 'timed',
    sets: 3,
    duration: 30,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['back', 'shoulders', 'triceps', 'glutes'],
    description: 'Сядьте на пол, руки за спиной, пальцы направлены к ягодицам. Поднимите таз, образуя прямую линию от пяток до плеч.',
    equipment: ['bodyweight'],
    recommendations: ['Держите живот подтянутым', 'Не опускайте таз', 'Для усложнения поочередно поднимайте ноги']
  },
  {
    id: uuidv4(),
    name: 'Подтягивания лежа',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['back', 'biceps'],
    description: 'Лягте под стол или стабильную перекладину. Возьмитесь за край и подтяните тело, сгибая руки, затем опуститесь.',
    equipment: ['bodyweight'],
    recommendations: ['Чем горизонтальнее тело, тем сложнее', 'Тяните локти назад и вниз', 'Касайтесь грудью края']
  },
  {
    id: uuidv4(),
    name: 'Ряды с полотенцем',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['back', 'biceps'],
    description: 'Возьмите полотенце, оберните вокруг столба или дверной ручки. Отступите назад, наклонитесь и тяните полотенце к себе, сгибая руки и сводя лопатки.',
    equipment: ['resistance bands'],
    recommendations: ['Держите спину прямой', 'Локти двигаются вдоль тела', 'Контролируйте движение в обе стороны']
  },
  {
    id: uuidv4(),
    name: 'Тяга в наклоне с бутылками воды',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    description: 'Возьмите в руки бутылки с водой, наклонитесь вперед. Подтягивайте бутылки к нижним ребрам, сводя лопатки, затем опускайте руки.',
    equipment: [],
    recommendations: ['Держите спину прямой, слегка прогнутой в пояснице', 'Тяните локти назад и вверх', 'Не используйте инерцию']
  },

  // ПЛЕЧИ
  {
    id: uuidv4(),
    name: 'Отведение рук в стороны с бутылками',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'traps'],
    description: 'Встаньте прямо, в руках бутылки с водой. Поднимайте руки в стороны до уровня плеч, затем медленно опускайте.',
    equipment: [],
    recommendations: ['Слегка согните руки в локтях', 'Не используйте инерцию', 'Держите корпус неподвижно']
  },
  {
    id: uuidv4(),
    name: 'Подъемы рук вперед',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['shoulders'],
    description: 'Встаньте прямо, в руках бутылки с водой или другое утяжеление. Поднимайте прямые руки вперед до уровня плеч, затем опускайте.',
    equipment: [],
    recommendations: ['Не раскачивайте корпус', 'Держите спину прямо', 'Можно чередовать руки']
  },
  {
    id: uuidv4(),
    name: 'Y-подъемы',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['shoulders', 'traps', 'back'],
    description: 'Лягте на живот, руки вытянуты вперед, образуя букву Y. Поднимите руки от пола, сведите лопатки, опустите обратно.',
    equipment: ['bodyweight'],
    recommendations: ['Не запрокидывайте голову', 'Удерживайте положение на 1-2 секунды', 'Для усложнения используйте легкие утяжелители']
  },
  {
    id: uuidv4(),
    name: 'Пайк-отжимания',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 90,
    difficulty: 'advanced',
    muscleGroups: ['shoulders', 'triceps', 'chest'],
    description: 'Примите положение для отжиманий, затем поднимите бедра вверх, образуя перевернутую букву V. Опускайтесь, сгибая руки, макушка направлена к полу.',
    equipment: ['bodyweight'],
    recommendations: ['Чем выше бедра, тем больше нагрузка на плечи', 'Держите локти по бокам', 'Для облегчения можно выполнять с опорой ног на возвышение']
  },

  // ПРЕСС
  {
    id: uuidv4(),
    name: 'Скручивания',
    type: 'reps',
    sets: 3,
    reps: 20,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['abs'],
    description: 'Лягте на спину, согните ноги в коленях, руки за головой. Поднимайте верхнюю часть спины, направляя локти к коленям, затем опускайтесь.',
    equipment: ['bodyweight'],
    recommendations: ['Не тяните себя за шею', 'Концентрируйтесь на мышцах пресса', 'Выдыхайте при подъеме']
  },
  {
    id: uuidv4(),
    name: 'Русские скручивания',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['abs', 'core'],
    description: 'Сядьте на пол, ноги согнуты, пятки на земле. Отклонитесь назад, балансируя на ягодицах. Поворачивайте корпус вправо и влево.',
    equipment: ['bodyweight'],
    recommendations: ['Для усложнения держите предмет в руках', 'Держите спину прямой', 'Отрывайте ноги от пола для дополнительной нагрузки']
  },
  {
    id: uuidv4(),
    name: 'Планка на локтях',
    type: 'timed',
    sets: 3,
    duration: 45,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['core', 'abs', 'shoulders'],
    description: 'Примите упор на предплечьях, тело образует прямую линию. Удерживайте положение, напрягая мышцы кора.',
    equipment: ['bodyweight'],
    recommendations: ['Не прогибайте поясницу', 'Не поднимайте таз слишком высоко', 'Смотрите в пол, шея расслаблена']
  },
  {
    id: uuidv4(),
    name: 'Боковая планка',
    type: 'timed',
    sets: 3,
    duration: 30,
    restTime: 45,
    difficulty: 'intermediate',
    muscleGroups: ['core', 'abs', 'shoulders'],
    description: 'Лягте на бок, оперевшись на предплечье. Поднимите тело, образуя прямую линию, другая рука на поясе или вытянута вверх.',
    equipment: ['bodyweight'],
    recommendations: ['Держите тело в одной плоскости', 'Не опускайте бедра', 'Для облегчения согните нижнюю ногу']
  },
  {
    id: uuidv4(),
    name: 'Подъемы ног лежа',
    type: 'reps',
    sets: 3,
    reps: 15,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['abs', 'core'],
    description: 'Лягте на спину, руки вдоль тела или под ягодицами. Поднимайте прямые ноги до угла 90°, затем опускайте, не касаясь пола.',
    equipment: ['bodyweight'],
    recommendations: ['Держите поясницу прижатой к полу', 'Для облегчения сгибайте ноги в коленях', 'Выполняйте движение плавно']
  },
  {
    id: uuidv4(),
    name: 'Альпинист',
    type: 'timed',
    sets: 3,
    duration: 40,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['core', 'abs', 'shoulders'],
    description: 'Примите положение упора лежа. Поочередно подтягивайте колени к груди, как при беге на месте.',
    equipment: ['bodyweight'],
    recommendations: ['Держите бедра параллельно полу', 'Двигайтесь в темпе, который можете поддерживать', 'Для усложнения увеличивайте скорость']
  },

  // КАРДИО
  {
    id: uuidv4(),
    name: 'Прыжки на месте',
    type: 'timed',
    sets: 3,
    duration: 60,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'calves', 'core'],
    description: 'Встаньте прямо, ноги вместе. Выполняйте прыжки на месте, поднимая колени и работая руками, как при беге.',
    equipment: ['bodyweight'],
    recommendations: ['Приземляйтесь мягко на носки', 'Поддерживайте ритмичное дыхание', 'Для усложнения поднимайте колени выше']
  },
  {
    id: uuidv4(),
    name: 'Берпи',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 90,
    difficulty: 'advanced',
    muscleGroups: ['full_body'],
    description: 'Из положения стоя присядьте, примите упор лежа, выполните отжимание, вернитесь в присед и прыгните вверх с хлопком над головой.',
    equipment: ['bodyweight'],
    recommendations: ['Для облегчения можно исключить отжимание', 'Контролируйте движения', 'Приземляйтесь мягко после прыжка']
  },
  {
    id: uuidv4(),
    name: 'Джампинг джек',
    type: 'timed',
    sets: 3,
    duration: 60,
    restTime: 45,
    difficulty: 'beginner',
    muscleGroups: ['full_body'],
    description: 'Встаньте прямо, ноги вместе, руки по бокам. В прыжке расставьте ноги широко и поднимите руки над головой, затем вернитесь в исходное положение.',
    equipment: ['bodyweight'],
    recommendations: ['Держите спину прямо', 'Двигайтесь в комфортном темпе', 'Для меньшей нагрузки на суставы выполняйте шаги в стороны без прыжков']
  },
  {
    id: uuidv4(),
    name: 'Скалолаз',
    type: 'timed',
    sets: 3,
    duration: 45,
    restTime: 60,
    difficulty: 'intermediate',
    muscleGroups: ['abs', 'core', 'shoulders'],
    description: 'Примите положение упора лежа. Быстро подтягивайте колени к противоположному локтю, чередуя стороны.',
    equipment: ['bodyweight'],
    recommendations: ['Удерживайте центр тяжести стабильным', 'Держите бедра параллельно полу', 'Не прогибайте поясницу']
  },
  {
    id: uuidv4(),
    name: 'Выпрыгивания из приседа',
    type: 'reps',
    sets: 3,
    reps: 12,
    restTime: 90,
    difficulty: 'intermediate',
    muscleGroups: ['quads', 'glutes', 'calves'],
    description: 'Выполните присед, затем мощно оттолкнитесь и выпрыгните вверх. Приземлитесь мягко и сразу уйдите в следующий присед.',
    equipment: ['bodyweight'],
    recommendations: ['Держите спину прямо', 'Колени не выходят за носки', 'Для меньшей интенсивности уменьшите глубину приседа']
  },
  {
    id: uuidv4(),
    name: 'Бег на месте с высоким подниманием колен',
    type: 'timed',
    sets: 3,
    duration: 60,
    restTime: 60,
    difficulty: 'beginner',
    muscleGroups: ['quads', 'calves', 'abs'],
    description: 'Бегите на месте, высоко поднимая колени. Сосредоточьтесь на активной работе рук и поддержании хорошей осанки.',
    equipment: ['bodyweight'],
    recommendations: ['Поднимайте колени до уровня бедер', 'Активно работайте руками', 'Приземляйтесь на переднюю часть стопы']
  }
];

// Функция для добавления расширенного набора упражнений в существующий список упражнений
export function addExtendedHomeExercises(): void {
  try {
    const savedExercises = localStorage.getItem('userExercises');
    let userExercises = savedExercises ? JSON.parse(savedExercises) : [];
    
    // Добавляем только те упражнения, которых еще нет (проверка по имени)
    const existingNames = userExercises.map((ex: Exercise) => ex.name);
    const newExercises = EXTENDED_HOME_EXERCISES.filter(ex => !existingNames.includes(ex.name));
    
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