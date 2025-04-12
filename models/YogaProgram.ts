import { Program, WorkoutExercise } from './Program';
import { v4 as uuidv4 } from 'uuid';
import { YOGA_BACK_EXERCISES } from './YogaExercises';

// Функция для создания упражнения в тренировке
function createWorkoutExercise(exerciseName: string): WorkoutExercise {
  const exercise = YOGA_BACK_EXERCISES.find(e => e.name === exerciseName);
  if (!exercise) {
    throw new Error(`Упражнение ${exerciseName} не найдено`);
  }
  
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise: exercise,
    sets: exercise.sets || 1,
    duration: exercise.duration || 45,
    rest: 40
  };
}

// Программа йоги для спины
export const YOGA_BACK_PROGRAM: Program = {
  id: uuidv4(),
  name: 'Йога для спины',
  description: 'Комплекс упражнений йоги, направленный на укрепление и расслабление мышц спины, улучшение осанки и снятие напряжения.',
  createdBy: 'system',
  isPublic: true,
  restBetweenExercises: 40,
  workouts: [
    {
      id: uuidv4(),
      programId: uuidv4(),
      name: 'Комплекс упражнений для спины',
      exercises: [
        createWorkoutExercise('Вращения в локтях назад'),
        createWorkoutExercise('Перекрестные касания'),
        createWorkoutExercise('Треугольник верх-низ'),
        createWorkoutExercise('Замок - зарядка'),
        createWorkoutExercise('Кошка - корова'),
        createWorkoutExercise('Выталкивания в кобру'),
        createWorkoutExercise('Выталкивания в кобру'),
        createWorkoutExercise('Притягивания'),
        createWorkoutExercise('Пульсация «крылья»'),
        createWorkoutExercise('Касания «полкруг»'),
        createWorkoutExercise('Тяга к груди'),
        createWorkoutExercise('Собака мордой вниз'),
        createWorkoutExercise('Поза ребенка')
      ]
    }
  ]
};

// Функция для добавления программы в localStorage
export function addYogaBackProgram(): void {
  try {
    const savedPrograms = localStorage.getItem('programs');
    let userPrograms = savedPrograms ? JSON.parse(savedPrograms) : [];
    
    // Проверяем, есть ли уже такая программа
    const existingProgram = userPrograms.find((p: Program) => p.name === YOGA_BACK_PROGRAM.name);
    
    if (!existingProgram) {
      userPrograms.push(YOGA_BACK_PROGRAM);
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа йоги для спины добавлена');
    } else {
      // Обновляем существующую программу, чтобы применить новое время отдыха
      const index = userPrograms.findIndex((p: Program) => p.name === YOGA_BACK_PROGRAM.name);
      userPrograms[index] = YOGA_BACK_PROGRAM;
      localStorage.setItem('programs', JSON.stringify(userPrograms));
      console.log('Программа йоги для спины обновлена');
    }
  } catch (error) {
    console.error('Ошибка при добавлении программы йоги:', error);
  }
} 