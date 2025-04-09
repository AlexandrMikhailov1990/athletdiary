import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import type { ActiveProgram } from '../models/ActiveProgram';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { Exercise, SAMPLE_EXERCISES } from '../models/Exercise';

interface WorkoutSet {
  reps?: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

interface WorkoutExercise {
  exercise: Exercise;
  completedSets: number;
  setDetails: WorkoutSet[];
}

export default function Workout() {
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState<number | null>(null);
  const [isExerciseTimerRunning, setIsExerciseTimerRunning] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number | ''>('');
  const [currentReps, setCurrentReps] = useState<number | ''>('');
  const [exerciseHistory, setExerciseHistory] = useState<Array<{
    date: string;
    programName: string;
    sets: Array<{
      weight?: number;
      reps?: number;
      duration?: number;
    }>;
  }>>([]);

  const completeWorkout = useCallback(() => {
    if (activeProgram && program) {
      const updatedProgram = {
        ...activeProgram,
        completedWorkouts: [
          ...activeProgram.completedWorkouts,
          {
            week: activeProgram.currentWeek,
            day: activeProgram.currentDay,
            date: new Date().toISOString(),
            exercises: exercises.map(ex => ({
              exerciseId: ex.exercise.id,
              name: ex.exercise.name,
              sets: ex.setDetails.map(set => ({
                reps: set.reps,
                weight: set.weight,
                duration: set.duration,
                completed: set.completed
              }))
            }))
          }
        ],
        currentDay: activeProgram.currentDay + 1
      };

      if (updatedProgram.currentDay > program.workoutsPerWeek) {
        updatedProgram.currentWeek += 1;
        updatedProgram.currentDay = 1;
      }

      // Сохраняем обновленную активную программу
      localStorage.setItem('activeProgram', JSON.stringify(updatedProgram));

      // Сохраняем историю тренировок
      const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      workoutHistory.push({
        date: new Date().toISOString(),
        programId: program.id,
        programName: program.name,
        week: activeProgram.currentWeek,
        day: activeProgram.currentDay,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          name: ex.exercise.name,
          sets: ex.setDetails
        }))
      });
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));

      // Перенаправляем на страницу активной программы
      router.push('/active-program');
    }
  }, [activeProgram, program, exercises, router]);

  const handleSetComplete = useCallback((weight?: number, completedReps?: number) => {
    const currentWorkoutExercise = exercises[currentExerciseIndex];
    const updatedExercises = [...exercises];
    
    const setDetail: WorkoutSet = currentWorkoutExercise.exercise.type === 'reps'
      ? {
          reps: completedReps || (currentWorkoutExercise.exercise as any).reps,
          weight: weight || (currentWorkoutExercise.exercise as any).weight,
          completed: true
        }
      : {
          duration: currentWorkoutExercise.exercise.type === 'timed'
            ? (currentWorkoutExercise.exercise.duration - (exerciseTimer || 0))
            : undefined,
          completed: true
        };

    updatedExercises[currentExerciseIndex] = {
      ...currentWorkoutExercise,
      completedSets: currentWorkoutExercise.completedSets + 1,
      setDetails: [...currentWorkoutExercise.setDetails, setDetail]
    };

    setExercises(updatedExercises);
    setExerciseTimer(null);
    setIsExerciseTimerRunning(false);

    if (currentWorkoutExercise.completedSets + 1 < currentWorkoutExercise.exercise.sets) {
      // Если есть еще сеты, начинаем отдых
      setRestTimer(currentWorkoutExercise.exercise.restTime);
      setIsResting(true);
    } else if (currentExerciseIndex + 1 < exercises.length) {
      // Переходим к следующему упражнению
      setCurrentExerciseIndex(prev => prev + 1);
      setRestTimer(null);
      setIsResting(false);
    } else {
      // Тренировка завершена
      completeWorkout();
    }
  }, [currentExerciseIndex, exercises, exerciseTimer, completeWorkout]);

  useEffect(() => {
    if (isExerciseTimerRunning && exerciseTimer !== null && exerciseTimer > 0) {
      const timer = setTimeout(() => {
        setExerciseTimer(exerciseTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (exerciseTimer === 0) {
      setIsExerciseTimerRunning(false);
      handleSetComplete();
    }
  }, [isExerciseTimerRunning, exerciseTimer, handleSetComplete]);

  useEffect(() => {
    // Загружаем активную программу
    const savedProgram = localStorage.getItem('activeProgram');
    if (!savedProgram) {
      router.push('/programs');
      return;
    }

    const activeProgramData = JSON.parse(savedProgram) as ActiveProgram;
    setActiveProgram(activeProgramData);

    // Ищем программу во всех возможных местах
    const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]') as Program[];
    let foundProgram = [...SAMPLE_PROGRAMS, ...savedPrograms].find(p => p.id === activeProgramData.programId);
    
    if (!foundProgram) {
      // Если программа не найдена в основном хранилище, ищем в активных программах
      const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]') as (ActiveProgram & { program: Program })[];
      const activeProgram = activePrograms.find(p => p.programId === activeProgramData.programId);
      if (activeProgram?.program) {
        foundProgram = activeProgram.program;
      }
    }

    if (foundProgram) {
      setProgram(foundProgram);
      
      // Получаем тренировку для текущего дня
      const todayWorkout = foundProgram.workouts[activeProgramData.currentDay - 1];
      
      if (todayWorkout && todayWorkout.exercises) {
        // Инициализируем упражнения
        const workoutExercises: WorkoutExercise[] = todayWorkout.exercises.map(exerciseData => ({
          exercise: exerciseData.exercise,
          completedSets: 0,
          setDetails: []
        }));
        
        setExercises(workoutExercises);
      } else {
        // Если тренировка на текущий день не найдена
        console.error('Тренировка на текущий день не найдена');
        router.push('/active-program');
      }
    } else {
      // Если программа не найдена нигде
      console.error('Программа не найдена');
      router.push('/programs');
    }
  }, [router]);

  useEffect(() => {
    if (isResting && restTimer !== null && restTimer > 0) {
      const timer = setTimeout(() => {
        setRestTimer(restTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
  }, [isResting, restTimer]);

  const startExerciseTimer = () => {
    const currentExercise = exercises[currentExerciseIndex].exercise;
    if (currentExercise.type === 'timed') {
      setExerciseTimer(currentExercise.duration);
      setIsExerciseTimerRunning(true);
    }
  };

  const stopExerciseTimer = () => {
    setIsExerciseTimerRunning(false);
  };

  // Функция для пропуска отдыха
  const skipRest = () => {
    setRestTimer(null);
    setIsResting(false);
  };

  // Функция для загрузки истории упражнения
  const loadExerciseHistory = useCallback((exerciseId: string) => {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const exerciseHistoryData = workoutHistory
      .filter((workout: any) => 
        workout.exercises.some((ex: any) => ex.exerciseId === exerciseId)
      )
      .map((workout: any) => ({
        date: workout.date,
        programName: workout.programName,
        sets: workout.exercises
          .find((ex: any) => ex.exerciseId === exerciseId)
          .sets
      }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Показываем только последние 5 тренировок

    setExerciseHistory(exerciseHistoryData);
  }, []);

  // Загружаем историю при изменении текущего упражнения
  useEffect(() => {
    if (exercises[currentExerciseIndex]?.exercise.id) {
      loadExerciseHistory(exercises[currentExerciseIndex].exercise.id);
    }
  }, [exercises, currentExerciseIndex, loadExerciseHistory]);

  if (!activeProgram || !program) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка тренировки...</p>
        </div>
      </div>
    );
  }

  const currentWorkoutExercise = exercises[currentExerciseIndex];
  
  // Проверяем, загружены ли упражнения
  if (!currentWorkoutExercise) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка упражнений...</p>
        </div>
      </div>
    );
  }

  const currentExercise = currentWorkoutExercise.exercise;

  // Проверяем, есть ли текущее упражнение
  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Ошибка: Упражнение не найдено</p>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            onClick={() => router.push('/active-program')}
          >
            Вернуться к программе
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!currentWorkoutExercise ? (
        <div className="text-center">
          <p className="text-xl mb-4">Упражнения не загружены</p>
          <button
            onClick={() => router.push('/active-program')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Вернуться к программе
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Тренировка</h1>
          
          {/* Информация о текущем упражнении */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentWorkoutExercise.exercise.name}</h2>
            <p className="text-gray-600 mb-4">{currentWorkoutExercise.exercise.description}</p>
            
            {/* Прогресс упражнения */}
            <div className="mb-4">
              <p className="text-lg">
                Сет {currentWorkoutExercise.completedSets + 1} из {currentWorkoutExercise.exercise.sets}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${(currentWorkoutExercise.completedSets / currentWorkoutExercise.exercise.sets) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Контролы для упражнения */}
            {isResting ? (
              <div className="text-center">
                <p className="text-xl mb-4">Отдых: {restTimer}с</p>
                <button
                  onClick={skipRest}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Пропустить отдых
                </button>
              </div>
            ) : (
              <div>
                {currentWorkoutExercise.exercise.type === 'reps' ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(Number(e.target.value))}
                        placeholder="Вес (кг)"
                        className="border rounded px-3 py-2 w-full"
                      />
                      <input
                        type="number"
                        value={currentReps}
                        onChange={(e) => setCurrentReps(Number(e.target.value))}
                        placeholder="Повторения"
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                    <button
                      onClick={() => handleSetComplete(
                        currentWeight ? Number(currentWeight) : undefined,
                        currentReps ? Number(currentReps) : undefined
                      )}
                      className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                    >
                      Завершить сет
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl">Время: {exerciseTimer}с</p>
                    {!isExerciseTimerRunning ? (
                      <button
                        onClick={startExerciseTimer}
                        className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                      >
                        Начать
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={stopExerciseTimer}
                          className="w-full bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600"
                        >
                          Пауза
                        </button>
                        <button
                          onClick={() => handleSetComplete()}
                          className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                        >
                          Завершить досрочно
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* История выполненных сетов текущей тренировки */}
          {currentWorkoutExercise.setDetails.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Текущая тренировка</h3>
              <div className="space-y-2">
                {currentWorkoutExercise.setDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span>Сет {index + 1}:</span>
                    {detail.weight && <span>{detail.weight} кг</span>}
                    {detail.reps && <span>{detail.reps} повторений</span>}
                    {detail.duration && <span>{detail.duration} секунд</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* История предыдущих тренировок */}
          {exerciseHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">История упражнения</h3>
              {exerciseHistory.map((workout, workoutIndex) => (
                <div key={workoutIndex} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {new Date(workout.date).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="text-sm text-gray-600">{workout.programName}</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    {workout.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-sm">Сет {setIndex + 1}:</span>
                        <div className="flex gap-4">
                          {set.weight && <span className="text-sm">{set.weight} кг</span>}
                          {set.reps && <span className="text-sm">{set.reps} повт.</span>}
                          {set.duration && <span className="text-sm">{set.duration} сек</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 