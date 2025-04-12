import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import type { ActiveProgram } from '../models/ActiveProgram';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../models/Exercise';
import soundManager from '../utils/SoundManager';

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
  rest?: number;
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
  const [isMuted, setIsMuted] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [finalSoundPlayed, setFinalSoundPlayed] = useState<boolean>(false);

  // Инициализируем звук только при первом клике пользователя
  useEffect(() => {
    // Проверяем текущее состояние звука для обновления UI
    setIsMuted(soundManager.isSoundMuted());
    
    // Звуковой менеджер сам инициализируется в конструкторе, 
    // а обработчики событий добавляются автоматически
    console.log('[Workout] Звуковой менеджер уже инициализирован');
    
    // Слушаем только первое взаимодействие пользователя для активации звука
    const handleUserInteraction = () => {
      console.log('[Workout] User interaction detected');
      // Звуковой менеджер автоматически подготовит аудио при взаимодействии
    };
    
    // Добавляем обработчики один раз
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

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

      // Сохраняем историю тренировок для WorkoutHistory
      const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      
      // Создаем запись о тренировке в формате WorkoutHistory
      const workoutHistoryRecord = {
        programId: program.id,
        date: new Date().toISOString(),
        week: activeProgram.currentWeek,
        day: activeProgram.currentDay,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          name: ex.exercise.name,
          sets: ex.setDetails.map(set => ({
            reps: set.reps || 0,  // Убедимся, что значения не undefined
            weight: set.weight || 0,  // Убедимся, что значения не undefined
            completed: set.completed || false
          }))
        })),
        notes: '',
        rating: 0,
        userId: 'user'
      };
      
      // Сохраняем запись в формате WorkoutRecord (для совместимости со старым кодом)
      const workoutRecord = {
        id: Date.now().toString(),
        workoutId: program.workouts[activeProgram.currentDay - 1]?.id || 'workout_' + Date.now(),
        programId: program.id, // Добавляем ID программы для связи
        programName: program.name || 'Программа тренировок',
        workoutName: program.workouts[activeProgram.currentDay - 1]?.name || 'Тренировка',
        date: new Date().toISOString(),
        duration: Math.round((Date.now() - new Date(startTime).getTime()) / 60000),
        exercises: exercises.map(ex => ({
          exercise: ex.exercise,
          exerciseId: ex.exercise.id, // Добавляем ID упражнения для связи
          sets: ex.setDetails.map(set => ({
            weight: set.weight || 0,
            reps: set.reps || 0,
            duration: set.duration || 0,
            completed: set.completed || false
          }))
        })),
        notes: '',
        rating: 0,
        userId: 'user'
      };
      
      // Добавляем обе записи в историю и сохраняем
      workoutHistory.push(workoutHistoryRecord);
      workoutHistory.push(workoutRecord);
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));

      console.log('Сохранена история тренировки:', workoutHistoryRecord);

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
        // Используем значение rest из упражнения вместо restTime
        const restTime = currentExercise.rest || currentExercise.exercise.restTime || 60;
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
    setIsCountdown(false);
    setTimerCompleted(false); // Сбрасываем флаг завершения при запуске таймера
    
    // Сбрасываем флаг финального звука при старте таймера
    setFinalSoundPlayed(false);
    
    // Запускаем новый таймер
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsedTime;
      
      // Устанавливаем режим обратного отсчета за 5 секунд до конца
      if (remaining === 5 && !isCountdown) {
        // Активируем режим обратного отсчета и сразу же воспроизводим звук
        setIsCountdown(true);
        
        // Воспроизводим звук за 5 секунд до конца в режиме ЗАВЕРШЕНИЯ
        // Используем сигнал завершения для полного проигрывания без прерывания
        if (!finalSoundPlayed) {
          soundManager.playTimerBeep(true);
          setFinalSoundPlayed(true);
        }
      }
      
      if (remaining <= 0) {
        // Предотвращаем повторное срабатывание таймера
        if (!timerCompleted) {
          // Очищаем таймер перед воспроизведением финального звука
          clearInterval(timer);
          setTimerId(null);
          
          // Устанавливаем флаг завершения
          setTimerCompleted(true);
          
          // Установим таймер в 0 для визуального отображения
          setTimeLeft(0);
          
          // НЕ воспроизводим повторный звук, т.к. уже играет звук от обратного отсчета
          // который был запущен в режиме завершения с playTimerBeep(true)
          
          // Обновляем UI с задержкой
          setTimeout(() => {
            setIsTimerRunning(false);
            setIsCountdown(false);
            handleSetComplete(duration);
          }, 1500); // Достаточная задержка для звука
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    setTimerId(timer);
  }, [currentExerciseIndex, exercises, handleSetComplete, timerId, isCountdown, timerCompleted, finalSoundPlayed]);

  // Функция для остановки таймера упражнения
  const stopExerciseTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setIsTimerRunning(false);
    setTimerCompleted(true); // Устанавливаем флаг завершения при ручной остановке
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
    console.log('Загрузка истории для упражнения:', exerciseId);
    
    // Фильтруем записи, содержащие данное упражнение
    const exerciseHistoryData = workoutHistory
      .filter((workout: any) => {
        // Проверяем разные форматы хранения упражнений
        const hasExercise = 
          // Проверка для WorkoutRecord формата
          (workout.exercises && workout.exercises.some((ex: any) => 
            (ex.exerciseId === exerciseId) || (ex.exercise && ex.exercise.id === exerciseId)
          )) ||
          // Проверка для WorkoutHistory формата 
          (workout.exercises && workout.exercises.some((ex: any) => ex.exerciseId === exerciseId));
        
        return hasExercise;
      })
      .map((workout: any) => {
        // Найдем упражнение в тренировке
        const foundExercise = workout.exercises.find((ex: any) => 
          (ex.exerciseId === exerciseId) || (ex.exercise && ex.exercise.id === exerciseId)
        );
        
        return {
          date: workout.date,
          programName: workout.programName || workout.workoutName || 'Тренировка',
          sets: foundExercise ? (
            // Фильтруем только завершенные подходы
            (foundExercise.sets || []).filter((set: any) => set.completed)
          ) : []
        };
      })
      .filter((history: any) => history.sets.length > 0) // Только записи с завершенными подходами
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Сортируем по дате
      .slice(0, 5); // Показываем только 5 последних

    console.log('Найдено записей истории:', exerciseHistoryData.length);
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
          // Проверяем, что у нас есть все необходимые данные
          if (!exerciseData.exercise) {
            console.error('Ошибка: у упражнения отсутствует свойство exercise', exerciseData);
            // Создаем базовую заглушку для предотвращения ошибок
            return {
              exercise: {
                id: 'error',
                name: 'Ошибка загрузки упражнения',
                description: 'Произошла ошибка при загрузке данных упражнения',
                type: 'reps',
                sets: 1,
                reps: 10,
                weight: 0,
                restTime: 60,
                muscleGroups: [],
                equipment: ['bodyweight'],
                difficulty: 'beginner',
                isPublic: false
              },
              completedSets: 0,
              setDetails: [{ completed: false }],
              rest: 60
            };
          }
          
          // Используем количество подходов из exerciseData, а не из exercise
          const exercise = {...exerciseData.exercise};
          
          // Устанавливаем количество подходов из exerciseData если оно указано, иначе из упражнения
          const numSets = exerciseData.sets || exercise.sets || 1;
          exercise.sets = numSets; // Важно: обновляем sets в самом exercise
          
          // Используем restTime упражнения (больше не используем restBetweenSets программы)
          if (!exercise.restTime || exercise.restTime < 1) {
            exercise.restTime = 60; // Значение по умолчанию, если не задано
            console.warn('Для упражнения не указано время отдыха, установлено значение по умолчанию: 60 секунд');
          }
          
          // Инициализируем массив setDetails с правильным количеством подходов
          const setDetails = Array(numSets).fill(null).map(() => ({
            reps: undefined,
            weight: undefined,
            duration: undefined,
            completed: false
          }));
          
          console.log(`Инициализация упражнения: ${exercise.name}, подходов: ${numSets}`);
          
          return {
            exercise: exercise,
            completedSets: 0,
            setDetails: setDetails,
            rest: exerciseData.rest
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
        // Активируем обратный отсчет только точно за 5 секунд до конца
        if (restTimer === 5) {
          setIsCountdown(true);
          // Воспроизводим предупреждающий звук один раз в режиме завершения
          // чтобы гарантировать полное воспроизведение
          if (!finalSoundPlayed) {
            soundManager.playTimerBeep(true);
            setFinalSoundPlayed(true);
          }
        }
        
        // Проверяем, является ли это последней секундой таймера
        if (restTimer === 1) {
          // Обрабатываем последнюю секунду, переход к нулю
          setTimeout(() => {
            // НЕ воспроизводим повторный звук завершения, т.к. он уже играет
            // от обратного отсчета с playTimerBeep(true)
            
            // Обновляем состояние с задержкой
            setTimeout(() => {
              setIsResting(false);
              setRestTimer(null);
              setIsCountdown(false);
              setFinalSoundPlayed(false); // Сбрасываем флаг для следующего упражнения
            }, 1500); // Достаточная задержка для звука
          }, 1000);
        }
        
        // Уменьшаем счетчик отдыха
        if (restTimer > 0) {
          setRestTimer(restTimer - 1);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isResting, restTimer, finalSoundPlayed]);

  // Функция для переключения звука
  const toggleSound = () => {
    if (soundManager.isSoundMuted()) {
      soundManager.unmuteSound();
      setIsMuted(false);
    } else {
      soundManager.muteSound();
      setIsMuted(true);
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Тренировка</h1>
            <button 
              onClick={toggleSound}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={isMuted ? "Включить звук" : "Выключить звук"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
          
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
                <p className={`text-xl mb-4 ${isCountdown ? 'text-red-500 font-bold animate-pulse' : ''}`}>
                  Отдых: {restTimer} сек
                </p>
                
                {/* Таймлайн для визуализации времени отдыха */}
                {restTimer !== null && (
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`absolute top-0 left-0 h-full ${isCountdown ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-1000 ease-linear`}
                      style={{ 
                        width: `${(restTimer / (currentWorkoutExercise.rest || 60)) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
                
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
                    <p className={`text-xl ${isCountdown ? 'text-red-500 font-bold animate-pulse' : ''}`}>
                      Время: {timeLeft} сек
                    </p>
                    
                    {/* Таймлайн для визуализации оставшегося времени */}
                    {isTimerRunning && currentExercise.duration && (
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full ${isCountdown ? 'bg-red-500' : 'bg-green-500'} transition-all duration-1000 ease-linear`}
                          style={{ 
                            width: `${(timeLeft / currentExercise.duration) * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}
                    
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
                          {(set.weight || 0) > 0 && <span className="text-sm">{set.weight} кг</span>}
                          {(set.reps || 0) > 0 && <span className="text-sm">{set.reps} повт.</span>}
                          {(set.duration || 0) > 0 && <span className="text-sm">{set.duration} сек</span>}
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