import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import type { ActiveProgram } from '../models/ActiveProgram';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../models/Exercise';

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
  const [startTime] = useState<string>(new Date().toISOString());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [setHistory, setSetHistory] = useState<Array<{
    weight?: number;
    reps?: number;
    duration?: number;
    date: string;
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
      const workoutRecord = {
        id: Date.now().toString(),
        workoutId: program.workouts[activeProgram.currentDay - 1].id,
        workoutName: program.workouts[activeProgram.currentDay - 1].name,
        date: new Date().toISOString(),
        duration: Math.round((Date.now() - new Date(startTime).getTime()) / 60000),
        exercises: exercises.map(ex => ({
          exercise: ex.exercise,
          sets: ex.setDetails.map(set => ({
            weight: set.weight,
            reps: set.reps,
            duration: set.duration,
            completed: set.completed
          }))
        })),
        notes: '',
        rating: 0,
        userId: 'user'
      };
      workoutHistory.push(workoutRecord);
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));

      // Перенаправляем на страницу активной программы
      router.push('/active-program');
    }
  }, [activeProgram, program, exercises, router, startTime]);

  // Функция для сброса таймера упражнения
  const resetExerciseTimer = useCallback(() => {
    const currentExercise = exercises[currentExerciseIndex].exercise;
    if (currentExercise.type === 'timed') {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      setTimeLeft(currentExercise.duration || 60);
      setIsTimerRunning(false);
    }
  }, [currentExerciseIndex, exercises, timerId]);

  const handleSetComplete = useCallback((completedDuration?: number) => {
    if (!exercises[currentExerciseIndex] || !exercises[currentExerciseIndex].exercise) return;

    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[currentExerciseIndex];
    const exerciseSets = currentExercise.exercise.sets || 1; // Устанавливаем значение по умолчанию, если sets не определено
    
    if (currentExercise.completedSets < exerciseSets) {
      const setDetails: WorkoutSet = {
        completed: true
      };

      // Для силовых упражнений добавляем вес и повторения
      if (currentExercise.exercise.type === 'reps') {
        setDetails.weight = Number(currentWeight);
        setDetails.reps = Number(currentReps);
      } else {
        // Для временных упражнений добавляем фактическое время выполнения
        const exercise = currentExercise.exercise;
        const targetDuration = exercise.duration || 60;
        const actualDuration = completedDuration !== undefined ? targetDuration - completedDuration : targetDuration;
        setDetails.duration = actualDuration;
      }
      
      currentExercise.setDetails[currentExercise.completedSets] = setDetails;
      currentExercise.completedSets += 1;
      
      setExercises(updatedExercises);
      
      // Reset input fields and timer
      setCurrentWeight('');
      setCurrentReps('');
      resetExerciseTimer();
      
      // Start rest timer if not on last set
      if (currentExercise.completedSets < exerciseSets) {
        // Используем время отдыха из упражнения или программы
        const restTime = currentExercise.exercise.restTime || 
                         (program && program.restBetweenSets) || 
                         60;
        setRestTimer(restTime);
        setIsResting(true);
      } else if (currentExerciseIndex + 1 < exercises.length) {
        // Move to next exercise with rest between exercises
        setCurrentExerciseIndex(prev => prev + 1);
        // Используем время отдыха между упражнениями из программы
        const restBetweenExercises = program && program.restBetweenExercises ? 
                                    program.restBetweenExercises : 
                                    90;
        setRestTimer(restBetweenExercises);
        setIsResting(true);
      } else {
        // Workout completed
        completeWorkout();
      }
    }
  }, [currentExerciseIndex, exercises, setRestTimer, setIsResting, setCurrentExerciseIndex, completeWorkout, currentWeight, currentReps, resetExerciseTimer, program]);

  // Функция для запуска таймера упражнения
  const startExerciseTimer = useCallback(() => {
    if (!exercises[currentExerciseIndex] || !exercises[currentExerciseIndex].exercise) return;
    
    const exercise = exercises[currentExerciseIndex].exercise;
    if (exercise.type !== 'timed') return;
    
    // Очищаем предыдущий таймер, если он существует
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    // Устанавливаем начальное время из упражнения
    const duration = exercise.duration || 60;
    setTimeLeft(duration);
    setIsTimerRunning(true);
    
    // Запускаем новый таймер
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsedTime;
      
      if (remaining <= 0) {
        clearInterval(timer);
        setIsTimerRunning(false);
        setTimeLeft(0);
        handleSetComplete(duration); // Передаем полное время, так как упражнение выполнено полностью
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    setTimerId(timer);
  }, [currentExerciseIndex, exercises, handleSetComplete, timerId]);

  // Функция для остановки таймера упражнения
  const stopExerciseTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setIsTimerRunning(false);
    // При остановке таймера передаем оставшееся время
    handleSetComplete(timeLeft);
  }, [timerId, timeLeft, handleSetComplete]);

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
          .filter((set: any) => set.completed) // Фильтруем только завершенные сеты
      }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setExerciseHistory(exerciseHistoryData);
  }, []);

  // Загружаем историю при изменении текущего упражнения
  useEffect(() => {
    if (exercises[currentExerciseIndex]?.exercise.id) {
      loadExerciseHistory(exercises[currentExerciseIndex].exercise.id);
    }
  }, [exercises, currentExerciseIndex, loadExerciseHistory]);

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  // Инициализируем таймер при загрузке упражнения
  useEffect(() => {
    if (exercises.length > 0 && currentExerciseIndex < exercises.length) {
      const currentExercise = exercises[currentExerciseIndex].exercise;
      if (currentExercise.type === 'timed') {
        setTimeLeft(currentExercise.duration || 60);
        setIsTimerRunning(false);
      }
    }
  }, [currentExerciseIndex, exercises]);

  // Загружаем активную программу
  useEffect(() => {
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
        const workoutExercises: WorkoutExercise[] = todayWorkout.exercises.map(exerciseData => {
          // Установить время отдыха из программы, если оно доступно
          const exercise = {...exerciseData.exercise};
          // Если в программе есть restBetweenSets, используем его вместо restTime упражнения
          if (foundProgram && foundProgram.restBetweenSets !== undefined) {
            exercise.restTime = foundProgram.restBetweenSets;
          }
          
          return {
            exercise: exercise,
            completedSets: 0,
            setDetails: []
          };
        });
        
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

  // Таймер отдыха
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
      {!exercises[currentExerciseIndex] ? (
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
            <h2 className="text-xl font-semibold mb-2">{exercises[currentExerciseIndex].exercise.name}</h2>
            <p className="text-gray-600 mb-4">{exercises[currentExerciseIndex].exercise.description}</p>
            
            {/* Прогресс упражнения */}
            <div className="mb-4">
              <p className="text-lg">
                Подход {exercises[currentExerciseIndex].completedSets + 1} из {exercises[currentExerciseIndex].exercise.sets || 1}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${(exercises[currentExerciseIndex].completedSets / (exercises[currentExerciseIndex].exercise.sets || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Контролы для упражнения */}
            {isResting ? (
              <div className="text-center">
                <p className="text-xl mb-4">Отдых: {restTimer} сек</p>
                <button
                  onClick={skipRest}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Пропустить отдых
                </button>
              </div>
            ) : (
              <div>
                {currentExercise.type === 'reps' ? (
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
                      onClick={() => handleSetComplete()}
                      className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Завершить подход
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl">Время: {timeLeft} сек</p>
                    <button
                      onClick={isTimerRunning ? stopExerciseTimer : startExerciseTimer}
                      disabled={false}
                      className={`w-full px-6 py-3 rounded-lg transition-colors duration-200 ${
                        isTimerRunning 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {isTimerRunning 
                        ? `Остановить таймер (${timeLeft} сек)` 
                        : timeLeft === 0 
                          ? 'Начать таймер' 
                          : 'Запустить таймер'
                      }
                    </button>
                    {!isTimerRunning && timeLeft !== 0 && (
                      <button
                        onClick={() => handleSetComplete()}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Завершить досрочно
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* История выполненных сетов */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">История подходов</h3>
            <div className="space-y-2">
              {exercises[currentExerciseIndex].setDetails.map((set, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Подход {index + 1}</span>
                  <span className="text-gray-600">
                    {exercises[currentExerciseIndex].exercise.type === 'reps' 
                      ? `${set.reps || 0} повт. × ${set.weight || 0} кг`
                      : `${set.duration || 0} сек`
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* История предыдущих тренировок */}
          {exerciseHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
                        <span className="text-sm">Подход {setIndex + 1}:</span>
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