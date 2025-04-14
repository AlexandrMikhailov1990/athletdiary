import { Program, WorkoutExercise } from './Program';
import { v4 as uuidv4 } from 'uuid';
import { YOGA_BACK_EXERCISES } from './YogaExercises';

// Функция для создания упражнения в тренировке
function createWorkoutExercise(exerciseName: string): WorkoutExercise {
  const exercise = YOGA_BACK_EXERCISES.find(e => e.name === exerciseName);
  if (!exercise) {
    throw new Error(`Exercise not found: ${exerciseName}`);
  }
  
  return {
    id: uuidv4(),
    exerciseId: exercise.id,
    exercise: exercise,
    sets: 1,
    duration: 30,
    rest: 0,
    completed: false,
    completedSets: []
  };
}

// Программа йоги для спины
export const YOGA_BACK_PROGRAM: Program = {
  id: uuidv4(),
  name: "Йога для спины",
  description: "Программа йоги, разработанная для укрепления и расслабления мышц спины, улучшения осанки и снятия напряжения. Включает позы для растяжки позвоночника, укрепления корпуса и снятия боли в спине.",
  isPublic: true,
  createdBy: "admin",
  restBetweenExercises: 10,
  workouts: [
    {
      id: uuidv4(),
      programId: '',
      name: "Йога для спины",
      exercises: [
        createWorkoutExercise("Поза ребенка"),
        createWorkoutExercise("Поза кошки-коровы"),
        createWorkoutExercise("Поза собаки мордой вниз"),
        createWorkoutExercise("Поза кобры"),
        createWorkoutExercise("Поза голубя"),
        createWorkoutExercise("Скручивание лежа"),
        createWorkoutExercise("Поза бабочки"),
        createWorkoutExercise("Поза моста"),
        createWorkoutExercise("Поза трупа"),
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