import { v4 as uuidv4 } from 'uuid';
import { WorkoutHistory } from "./WorkoutHistory";

/**
 * Интерфейс для деталей подхода в прогрессе тренировки
 */
export interface WorkoutSet {
  weight?: number;
  reps?: number;
  duration?: number;
  completed: boolean;
}

/**
 * Интерфейс для упражнения в прогрессе тренировки
 */
export interface WorkoutProgressExercise {
  id: string;
  exerciseId: string;
  completedSets: number;
  setDetails: WorkoutSet[];
}

/**
 * Интерфейс для прогресса тренировки
 */
export interface WorkoutProgress {
  programId: string;
  workoutId: string;
  startTime: number;
  currentExerciseIndex: number;
  exercises: WorkoutProgressExercise[];
}

// Ключ для хранения прогресса тренировки в localStorage
const WORKOUT_PROGRESS_KEY = 'workoutProgress';

/**
 * Получает текущий прогресс тренировки из localStorage
 */
export function getCurrentWorkoutProgress(): WorkoutProgress | null {
  try {
    const savedProgress = localStorage.getItem(WORKOUT_PROGRESS_KEY);
    if (!savedProgress) return null;
    
    return JSON.parse(savedProgress) as WorkoutProgress;
  } catch (error) {
    console.error('Ошибка при загрузке прогресса тренировки:', error);
    return null;
  }
}

/**
 * Создает новый прогресс тренировки
 */
export function createWorkoutProgress(
  programId: string,
  workoutId: string,
  exercises: WorkoutProgressExercise[]
): WorkoutProgress {
  const progress: WorkoutProgress = {
    programId,
    workoutId,
    startTime: Date.now(),
    currentExerciseIndex: 0,
    exercises
  };
  
  saveWorkoutProgress(progress);
  return progress;
}

/**
 * Обновляет существующий прогресс тренировки
 */
export function updateWorkoutProgress(
  progress: WorkoutProgress,
  currentExerciseIndex: number,
  completedSets: number,
  setDetails: WorkoutSet[]
): WorkoutProgress {
  // Клонируем объект прогресса
  const updatedProgress = { ...progress };
  
  // Обновляем текущий индекс упражнения
  updatedProgress.currentExerciseIndex = currentExerciseIndex;
  
  // Обновляем данные текущего упражнения, если оно существует
  if (updatedProgress.exercises[currentExerciseIndex]) {
    updatedProgress.exercises[currentExerciseIndex].completedSets = completedSets;
    updatedProgress.exercises[currentExerciseIndex].setDetails = [...setDetails];
  }
  
  saveWorkoutProgress(updatedProgress);
  return updatedProgress;
}

/**
 * Сохраняет прогресс тренировки в localStorage
 */
export function saveWorkoutProgress(progress: WorkoutProgress): void {
  try {
    localStorage.setItem(WORKOUT_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Ошибка при сохранении прогресса тренировки:', error);
  }
}

/**
 * Очищает прогресс тренировки из localStorage
 */
export function clearWorkoutProgress(): void {
  localStorage.removeItem(WORKOUT_PROGRESS_KEY);
}

/**
 * Конвертирует прогресс тренировки в запись истории тренировок
 */
export function convertProgressToHistory(progress: WorkoutProgress): WorkoutHistory {
  // Попытаемся загрузить программу и тренировку для получения деталей
  let week = 1;
  let day = 1;
  let exerciseNames: Record<string, string> = {};
  
  try {
    // Пытаемся получить данные о программе из localStorage
    const programsJson = localStorage.getItem('programs');
    if (programsJson) {
      const programs = JSON.parse(programsJson);
      const program = programs.find((p: any) => p.id === progress.programId);
      
      if (program) {
        const workout = program.workouts?.find((w: any) => w.id === progress.workoutId);
        if (workout) {
          // Если найдена тренировка, получаем имена упражнений
          workout.exercises?.forEach((ex: any) => {
            if (ex.id && ex.name) {
              exerciseNames[ex.id] = ex.name;
            }
          });
          
          // Находим индекс текущей тренировки
          const workoutIndex = program.workouts?.findIndex((w: any) => w.id === progress.workoutId) ?? 0;
          if (workoutIndex >= 0) {
            // Преобразуем индекс в неделю/день
            day = (workoutIndex % 7) + 1;
            week = Math.floor(workoutIndex / 7) + 1;
          }
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при получении данных программы:', error);
  }
  
  const record: WorkoutHistory = {
    programId: progress.programId,
    date: new Date().toISOString(),
    week: week,
    day: day,
    exercises: progress.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      name: exerciseNames[ex.exerciseId] || "Неизвестное упражнение",
      sets: ex.setDetails.map(set => ({
        reps: set.reps || 0,
        weight: set.weight || 0,
        completed: set.completed
      }))
    }))
  };
  
  return record;
}

// Проверка наличия активной тренировки
export function hasActiveWorkout(): boolean {
  const progress = getCurrentWorkoutProgress();
  
  if (!progress) return false;
  
  // Проверяем, все ли упражнения и подходы завершены
  const allExercisesCompleted = progress.exercises.every(exercise => {
    // Получаем количество подходов для этого упражнения из localStorage
    // Пытаемся получить данные из локального хранилища
    try {
      // Проверяем запись тренировки из программы
      const programsJson = localStorage.getItem('programs');
      const programsData = programsJson ? JSON.parse(programsJson) : [];
      const program = programsData.find((p: any) => p.id === progress.programId);
      
      // Если нашли программу, пытаемся найти тренировку
      if (program) {
        const workout = program.workouts?.find((w: any) => w.id === progress.workoutId);
        if (workout) {
          // Ищем упражнение в тренировке
          const workoutExercise = workout.exercises?.find((e: any) => 
            e.exerciseId === exercise.exerciseId || e.id === exercise.exerciseId
          );
          
          if (workoutExercise) {
            // Получаем количество подходов для этого упражнения
            const totalSets = workoutExercise.sets || 1;
            
            // Проверяем, все ли подходы выполнены
            return exercise.completedSets >= totalSets;
          }
        }
      }
      
      // Если не нашли точное количество подходов, проверяем, выполнен ли хотя бы один
      return exercise.completedSets > 0 && 
             exercise.setDetails.length > 0 && 
             exercise.setDetails.every(set => set.completed);
      
    } catch (error) {
      console.error('Ошибка при проверке завершенности упражнения:', error);
      // В случае ошибки считаем, что упражнение не завершено
      return false;
    }
  });
  
  // Если индекс текущего упражнения равен длине массива упражнений
  // и все упражнения завершены, то тренировка считается завершенной
  if (progress.currentExerciseIndex >= progress.exercises.length - 1 && allExercisesCompleted) {
    console.log('Тренировка считается завершенной, все упражнения выполнены');
    return false;
  }
  
  return true;
} 