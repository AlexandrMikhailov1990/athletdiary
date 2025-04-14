import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import type { ActiveProgram } from '../models/ActiveProgram';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../models/Exercise';
import soundManager from '../utils/SoundManager';
import RestTimerCountdown from '../components/RestTimerCountdown';
import { 
  getCurrentWorkoutProgress, 
  saveWorkoutProgress, 
  createWorkoutProgress, 
  updateWorkoutProgress, 
  clearWorkoutProgress, 
  WorkoutProgress 
} from '../models/WorkoutProgress';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

// Добавим константу WORKOUT_PROGRESS_KEY для прямого доступа
const WORKOUT_PROGRESS_KEY = 'workoutProgress';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
          ...(activeProgram.completedWorkouts || []),
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            exercises: exercises.map(ex => ({
              id: ex.exercise.id,
              name: ex.exercise.name,
              sets: ex.setDetails.map(set => ({
                weight: set.weight,
                reps: set.reps,
                duration: set.duration,
                completed: set.completed
              }))
            }))
          }
        ],
        currentDay: activeProgram.currentDay + 1
      };

      if (updatedProgram.currentDay > (program.workouts.length || 1)) {
        updatedProgram.currentWeek += 1;
        updatedProgram.currentDay = 1;
      }

      // Сохраняем обновленную активную программу
      localStorage.setItem('activeProgram', JSON.stringify(updatedProgram));

      // Сохраняем историю тренировок для WorkoutHistory
      const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      
      // Создаем запись о тренировке в едином формате
      const workoutId = program.workouts[activeProgram.currentDay - 1]?.id || 'workout_' + Date.now();
      const workoutRecord = {
        id: Date.now().toString(),
        workoutId: workoutId,
        programId: program.id,
        programName: program.name || 'Программа тренировок',
        workoutName: program.workouts[activeProgram.currentDay - 1]?.name || 'Тренировка',
        date: new Date().toISOString(),
        duration: Math.round((Date.now() - new Date(startTime).getTime()) / 60000),
        exercises: exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exercise: ex.exercise,
          name: ex.exercise.name,
          sets: ex.setDetails.map(set => ({
            weight: set.weight && Number(set.weight) > 0 ? Number(set.weight) : null,
            reps: set.reps && Number(set.reps) > 0 ? Number(set.reps) : null,
            duration: set.duration && Number(set.duration) > 0 ? Number(set.duration) : null,
            completed: set.completed || false
          }))
        })),
        notes: '',
        rating: 0,
        userId: 'user',
        week: activeProgram.currentWeek,
        day: activeProgram.currentDay
      };
      
      // Добавляем запись в историю и сохраняем
      workoutHistory.push(workoutRecord);
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));

      console.log('Сохранена история тренировки:', workoutRecord);

      // Очищаем прогресс тренировки после успешного завершения
      clearWorkoutProgress();
      
      // Показываем сообщение об успешном завершении тренировки
      alert('Тренировка успешно завершена!');

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

  // Функция для сохранения текущего прогресса тренировки
  const saveCurrentProgress = useCallback(() => {
    if (!program || exercises.length === 0) return;

    const workoutId = program.workouts[activeProgram?.currentDay ? activeProgram.currentDay - 1 : 0]?.id || 'workout';
    
    // Получаем текущий прогресс или создаем новый
    const existingProgress = getCurrentWorkoutProgress();
    let progress: WorkoutProgress;

    if (existingProgress && existingProgress.programId === program.id && existingProgress.workoutId === workoutId) {
      // Обновляем существующий прогресс
      progress = updateWorkoutProgress(
        existingProgress,
        currentExerciseIndex,
        exercises[currentExerciseIndex]?.completedSets || 0,
        exercises[currentExerciseIndex]?.setDetails || []
      );
    } else {
      // Создаем новый прогресс
      progress = createWorkoutProgress(
        program.id,
        workoutId,
        exercises.map(ex => ({
          id: ex.exercise.id,
          exerciseId: ex.exercise.id,
          completedSets: ex.completedSets,
          setDetails: ex.setDetails
        }))
      );
      progress.currentExerciseIndex = currentExerciseIndex;
    }

    // Сохраняем прогресс
    saveWorkoutProgress(progress);
    console.log('Прогресс тренировки сохранен:', progress);
  }, [program, exercises, currentExerciseIndex, activeProgram]);

  // Сохраняем прогресс при выполнении подхода
  const handleSetComplete = useCallback((completedDuration?: number) => {
    if (!exercises[currentExerciseIndex] || !exercises[currentExerciseIndex].exercise) return;

    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[currentExerciseIndex];
    const exerciseSets = currentExercise.exercise.sets || 1; // Устанавливаем значение по умолчанию, если sets не определено
    
    // Проверяем, не выполнены ли уже все подходы для текущего упражнения
    if (currentExercise.completedSets >= exerciseSets) {
      console.log("Все подходы для этого упражнения уже выполнены");
      
      // Проверяем, есть ли еще упражнения
      if (currentExerciseIndex + 1 < exercises.length) {
        // Переходим к следующему упражнению
        setCurrentExerciseIndex(prev => prev + 1);
        const restBetweenExercises = program && program.restBetweenExercises ? 
                                   program.restBetweenExercises : 
                                   90;
        setRestTimer(restBetweenExercises);
        setIsResting(true);
      } else {
        // Тренировка завершена
        completeWorkout();
      }
      return;
    }
    
    // Обрабатываем выполнение подхода
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
    
    // Сохраняем прогресс после обновления упражнения
    setTimeout(() => saveCurrentProgress(), 0);
    
    // Проверяем, был ли это последний подход в упражнении
    if (currentExercise.completedSets < exerciseSets) {
      // Если не последний подход, запускаем таймер отдыха
      const restTime = currentExercise.rest || currentExercise.exercise.restTime || 60;
      setRestTimer(restTime);
      setIsResting(true);
    } else if (currentExerciseIndex + 1 < exercises.length) {
      // Если это был последний подход, но есть следующее упражнение
      setCurrentExerciseIndex(prev => prev + 1);
      const restBetweenExercises = program && program.restBetweenExercises ? 
                                  program.restBetweenExercises : 
                                  90;
      setRestTimer(restBetweenExercises);
      setIsResting(true);
    } else {
      // Если это был последний подход последнего упражнения
      completeWorkout();
    }
  }, [currentExerciseIndex, exercises, setRestTimer, setIsResting, setCurrentExerciseIndex, completeWorkout, currentWeight, currentReps, resetExerciseTimer, program, saveCurrentProgress]);

  // Таймер отдыха
  useEffect(() => {
    if (isResting && restTimer !== null && restTimer > 0) {
      console.log('Starting rest timer:', restTimer);
      
      // Установка таймера отдыха с использованием setInterval для более точного отсчета
      const startValue = restTimer;
      const startTime = Date.now();
      let beepPlayed = false; // Флаг для отслеживания воспроизведения звука
      
      const restIntervalId = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remaining = startValue - elapsedTime;
        
        // Активируем обратный отсчет и звук за 5 секунд до конца
        if (remaining === 5 && !beepPlayed) {
          setIsCountdown(true);
          beepPlayed = true; // Устанавливаем флаг, чтобы звук сработал только один раз
          
          console.log('Rest timer 5 seconds remaining, playing beep');
          // Воспроизводим звук только если не выключен звук
          if (!isMuted) {
            soundManager.playTimerBeep(false);
          }
        }
        
        if (remaining <= 0) {
          // Очищаем интервал
          clearInterval(restIntervalId);
          
          // Устанавливаем значение в 0 для визуального обновления
          setRestTimer(0);
          
          // Убираем звуковой сигнал при нулевом значении таймера отдыха
          console.log('Таймер отдыха завершен, без звукового сигнала');
          setTimerCompleted(true);
          
          // Обработка завершения с задержкой для корректного визуального отображения
          setTimeout(() => {
            setIsResting(false);
            setIsCountdown(false);
            setRestTimer(null);
            setTimerCompleted(false); // Сбрасываем флаг после обработки
          }, 1500);
        } else {
          // Обновляем значение таймера
          setRestTimer(remaining);
        }
      }, 1000);
      
      return () => {
        clearInterval(restIntervalId);
      };
    }
  }, [isResting, restTimer, isMuted]);

  // Добавим useEffect для автоматического завершения подхода при обнулении таймера
  useEffect(() => {
    // Только если таймер достиг нуля, завершен и все еще запущен (не в состоянии отдыха)
    if (timeLeft === 0 && timerCompleted && isTimerRunning && !isResting) {
      // Используем setTimeout чтобы дать пользователю увидеть, что таймер закончился
      const timeoutId = setTimeout(() => {
        console.log('Автоматическое завершение подхода после таймера');
        setIsTimerRunning(false);
        setIsCountdown(false);
        
        // Завершаем подход с полной продолжительностью упражнения
        if (exercises[currentExerciseIndex]?.exercise) {
          handleSetComplete(exercises[currentExerciseIndex].exercise.duration || 60);
        }
        
        // Сбрасываем флаг завершения таймера
        setTimerCompleted(false);
      }, 1000); // Задержка для показа "Подход завершен" перед переходом к следующему
      
      // Очистка таймаута при размонтировании или изменении зависимостей
      return () => clearTimeout(timeoutId);
    }
  }, [timeLeft, timerCompleted, isTimerRunning, isResting, exercises, currentExerciseIndex, handleSetComplete]);

  // Функция для запуска таймера упражнения
  const startExerciseTimer = useCallback(() => {
    if (!exercises[currentExerciseIndex] || !exercises[currentExerciseIndex].exercise) return;
    
    const exercise = exercises[currentExerciseIndex].exercise;
    if (exercise.type !== 'timed') return;
    
    console.log('Starting exercise timer');
    
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
    
    // Запускаем новый таймер
    const startTime = Date.now();
    let beepPlayed = false; // Флаг для отслеживания воспроизведения звука
    
    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsedTime;
      
      // Устанавливаем режим обратного отсчета за 5 секунд до конца
      if (remaining === 5 && !beepPlayed) {
        // Активируем режим обратного отсчета
        setIsCountdown(true);
        beepPlayed = true; // Устанавливаем флаг, чтобы звук сработал только один раз
        
        console.log('Exercise timer 5 seconds remaining, playing beep');
        // Воспроизводим звук только если не выключен звук
        if (!isMuted) {
          soundManager.playTimerBeep(false);
        }
      }
      
      if (remaining <= 0) {
        // Предотвращаем повторное срабатывание таймера
        if (!timerCompleted) {
          // Очищаем таймер перед воспроизведением финального звука
          clearInterval(timer);
          setTimerId(null);
          
          // Установим таймер в 0 для визуального отображения
          setTimeLeft(0);
          
          // Устанавливаем флаг завершения
          setTimerCompleted(true);
          
          // Убираем звуковой сигнал при нулевом значении таймера
          console.log('Таймер упражнения завершен, без звукового сигнала');
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    setTimerId(timer);
  }, [currentExerciseIndex, exercises, timerId, isMuted, timerCompleted]);

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

  // Загружаем активную программу и восстанавливаем прогресс, если есть
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
    
    // Если не нашли программу, проверяем другие хранилища
    if (!foundProgram) {
      const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
      const activeProgram = activePrograms.find((p: any) => p.programId === activeProgramData.programId);
      if (activeProgram?.program) {
        foundProgram = activeProgram.program;
      }
    }
    
    if (foundProgram) {
      setProgram(foundProgram);
      
      // Проверяем, есть ли сохраненный прогресс тренировки
      const workoutProgress = getCurrentWorkoutProgress();
      const currentWorkoutId = foundProgram.workouts[activeProgramData.currentDay - 1]?.id;
      
      if (workoutProgress && 
          workoutProgress.programId === foundProgram.id && 
          workoutProgress.workoutId === currentWorkoutId) {
        console.log('Восстанавливаем сохраненный прогресс тренировки:', workoutProgress);
        
        // Инициализируем упражнения из текущей тренировки
        const workoutIndex = activeProgramData.currentDay - 1;
        const currentWorkout = foundProgram.workouts[workoutIndex];
        
        if (currentWorkout && currentWorkout.exercises) {
          // Создаем список упражнений с учетом сохраненного прогресса
          const initializedExercises = currentWorkout.exercises.map((ex, idx) => {
            const savedExercise = workoutProgress.exercises.find(e => e.exerciseId === ex.exerciseId);
            
            return {
              exercise: ex.exercise || NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === ex.exerciseId) || ex,
              completedSets: savedExercise?.completedSets || 0,
              setDetails: savedExercise?.setDetails || [],
              rest: ex.rest
            };
          });
          
          setExercises(initializedExercises);
          setCurrentExerciseIndex(workoutProgress.currentExerciseIndex);
        }
      } else {
        // Инициализируем упражнения с нуля
        const workoutIndex = activeProgramData.currentDay - 1;
        const currentWorkout = foundProgram.workouts[workoutIndex];
        
        if (currentWorkout && currentWorkout.exercises) {
          const initializedExercises = currentWorkout.exercises.map(ex => ({
            exercise: ex.exercise || NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === ex.exerciseId) || ex,
            completedSets: 0,
            setDetails: [],
            rest: ex.rest
          }));
          
          setExercises(initializedExercises);
          
          // Создаем новый прогресс тренировки
          if (initializedExercises.length > 0) {
            const newProgress = createWorkoutProgress(
              foundProgram.id,
              currentWorkout.id,
              initializedExercises.map(ex => ({
                id: ex.exercise.id,
                exerciseId: ex.exercise.id,
                completedSets: 0,
                setDetails: []
              }))
            );
            saveWorkoutProgress(newProgress);
          }
        }
      }
    } else {
      console.error('Программа не найдена:', activeProgramData.programId);
      router.push('/programs');
    }
  }, [router]);

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

  // Функция для тестирования звука напрямую
  const testSound = () => {
    console.log('Тестирование звука...');
    
    // Используем SoundManager напрямую для воспроизведения звука
    // Это самый надежный способ воспроизведения
    soundManager.playTimerBeep(true);
    
    // Добавляем немного обратной связи
    alert('Звук должен быть воспроизведен. Вы его слышите?');
  };

  // Функция для навигации к меню программ
  const goToPrograms = () => {
    try {
      // 1. Очищаем прогресс текущей тренировки
      clearWorkoutProgress();
      console.log('Прогресс тренировки очищен');
      
      // 2. Очищаем состояние компонента
      setExercises([]);
      setIsResting(false);
      setRestTimer(null);
      setTimerCompleted(false);
      setIsTimerRunning(false);
      
      // 3. Проверяем localStorage напрямую для отладки
      const checkProgress = localStorage.getItem(WORKOUT_PROGRESS_KEY);
      console.log('Проверка localStorage после очистки:', checkProgress ? 'Прогресс остался' : 'Прогресс успешно удален');

      // 4. Форсируем обновление hasActiveWorkout для компонента ContinueWorkoutButton
      // Можно вынести в общий localStorage ключ для уведомления других компонентов
      localStorage.setItem('lastWorkoutCleared', Date.now().toString());
      
      // 5. Закрываем модальное окно
      setShowConfirmationModal(false);
      
      // 6. Перенаправляем пользователя на страницу программ
      // Используем replace вместо push, чтобы предотвратить возврат на страницу тренировки
      router.replace('/programs');
    } catch (error) {
      console.error('Ошибка при завершении тренировки:', error);
      alert('Произошла ошибка при завершении тренировки. Пожалуйста, попробуйте еще раз.');
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
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center bg-white rounded-lg shadow p-8">
            <p className="text-xl mb-4">Упражнения не загружены</p>
            <button
              onClick={() => router.push('/active-program')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Вернуться к программе
            </button>
          </div>
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
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="container mx-auto max-w-md">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800">Тренировка</h1>
              <div className="flex items-center">
                <button 
                  onClick={testSound}
                  className="p-2 rounded-full hover:bg-gray-100 mr-2 text-gray-700"
                  aria-label="Проверить звук"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </button>
                <button 
                  onClick={toggleSound}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
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
            </div>
            
            {/* Основное содержимое */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              {/* Карточка с текущим упражнением */}
              {currentExercise && (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{exercises[currentExerciseIndex].exercise.name}</h2>
                    <p className="text-gray-600 mb-4">{exercises[currentExerciseIndex].exercise.description}</p>
                    
                    {/* Прогресс упражнения */}
                    <div className="mb-4">
                      <p className="text-lg text-gray-800">
                        {exercises[currentExerciseIndex] && exercises[currentExerciseIndex].completedSets < (exercises[currentExerciseIndex].exercise?.sets || 1) ? 
                          `Подход ${exercises[currentExerciseIndex].completedSets + 1} из ${exercises[currentExerciseIndex].exercise?.sets || 1}` :
                          `Все ${exercises[currentExerciseIndex]?.exercise?.sets || 1} подходов выполнены`
                        }
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(exercises[currentExerciseIndex]?.completedSets || 0) / (exercises[currentExerciseIndex]?.exercise?.sets || 1) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Контролы для упражнения */}
                    {isResting && restTimer !== null && restTimer > 0 && (
                      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl mb-4 font-semibold text-gray-800">Отдых между подходами</h3>
                        {restTimer <= 5 ? (
                          <RestTimerCountdown seconds={restTimer} isCountdownActive={true} />
                        ) : (
                          <div className="my-4">
                            <span className="text-4xl font-bold text-gray-800">{restTimer}</span>
                            <span className="text-xl ml-1 text-gray-700">сек</span>
                          </div>
                        )}
                        
                        <button
                          onClick={skipRest}
                          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
                        >
                          Пропустить отдых
                        </button>
                      </div>
                    )}

                    {!isResting && currentExercise && (
                      <>
                        {exercises[currentExerciseIndex].completedSets < (exercises[currentExerciseIndex].exercise?.sets || 1) ? (
                          <>
                            {currentExercise?.type === 'reps' ? (
                              <div className="space-y-4">
                                <div className="flex gap-4">
                                  <input
                                    type="number"
                                    value={currentWeight}
                                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                                    placeholder="Вес (кг)"
                                    className="border rounded px-3 py-2 w-full text-gray-800"
                                  />
                                  <input
                                    type="number"
                                    value={currentReps}
                                    onChange={(e) => setCurrentReps(Number(e.target.value))}
                                    placeholder="Повторения"
                                    className="border rounded px-3 py-2 w-full text-gray-800"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSetComplete()}
                                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                  Завершить подход
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <p className={`text-xl text-gray-800 ${isCountdown ? 'text-blue-600 font-bold animate-pulse' : ''}`}>
                                  Время: {timeLeft} сек
                                </p>
                                
                                {/* Таймлайн для визуализации оставшегося времени */}
                                {isTimerRunning && currentExercise.duration && (
                                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`absolute top-0 left-0 h-full ${isCountdown ? 'bg-blue-600' : 'bg-blue-500'} transition-all duration-1000 ease-linear`}
                                      style={{ 
                                        width: `${(timeLeft / currentExercise.duration) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                )}
                                
                                {timeLeft === 0 && timerCompleted ? (
                                  <div className="text-center py-3 bg-gray-50 rounded-lg">
                                    <div className="text-blue-600 font-medium mb-2">Время вышло</div>
                                    <p className="text-gray-500">Нажмите кнопку для завершения подхода</p>
                                    <button
                                      onClick={() => handleSetComplete(exercises[currentExerciseIndex]?.exercise.duration || 60)}
                                      className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                    >
                                      Завершить подход
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={isTimerRunning ? stopExerciseTimer : startExerciseTimer}
                                    disabled={false}
                                    className={`w-full px-6 py-3 rounded-lg transition-colors duration-200 ${
                                      isTimerRunning 
                                        ? 'bg-blue-600 hover:bg-blue-700' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white`}
                                  >
                                    {isTimerRunning 
                                      ? `Остановить таймер (${timeLeft} сек)` 
                                      : timeLeft === 0 || !timeLeft
                                        ? 'Начать таймер' 
                                        : 'Запустить таймер'
                                    }
                                  </button>
                                )}
                                
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
                          </>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-center text-gray-600">Все подходы выполнены!</p>
                            {currentExerciseIndex + 1 < exercises.length ? (
                              <button
                                onClick={() => {
                                  setCurrentExerciseIndex(prev => prev + 1);
                                  const restBetweenExercises = program && program.restBetweenExercises ? 
                                                            program.restBetweenExercises : 90;
                                  setRestTimer(restBetweenExercises);
                                  setIsResting(true);
                                }}
                                className="w-full mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                              >
                                Перейти к следующему упражнению
                              </button>
                            ) : (
                              <div className="mt-4 space-y-4">
                                <p className="text-center font-medium text-blue-600">Вы завершили все упражнения!</p>
                                <button
                                  onClick={completeWorkout}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium text-lg"
                                >
                                  Завершить тренировку
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* История выполненных сетов */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">История подходов</h3>
                    <div className="space-y-2">
                      {exercises[currentExerciseIndex].setDetails.map((set, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium text-gray-800">Подход {index + 1}</span>
                          <span className="text-gray-600">
                            {exercises[currentExerciseIndex].exercise.type === 'reps' 
                              ? ((set.reps || 0) > 0 || (set.weight || 0) > 0) 
                                ? `${(set.reps || 0) > 0 ? `${set.reps} повт.` : ''} ${(set.weight || 0) > 0 ? `${(set.reps || 0) > 0 ? '× ' : ''}${set.weight} кг` : ''}`
                                : 'Не выполнен'
                              : (set.duration || 0) > 0 
                                ? `${set.duration} сек`
                                : 'Не выполнен'
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* История предыдущих тренировок */}
                  {exerciseHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">История упражнения</h3>
                      {exerciseHistory.map((workout, workoutIndex) => (
                        <div key={workoutIndex} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">
                              {new Date(workout.date).toLocaleDateString('ru-RU')}
                            </span>
                            <span className="text-sm text-gray-600">{workout.programName}</span>
                          </div>
                          <div className="pl-4 space-y-2">
                            {workout.sets.map((set, setIndex) => (
                              <div key={setIndex} className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-sm text-gray-700">Подход {setIndex + 1}:</span>
                                <div className="flex gap-4">
                                  {set.weight && set.weight > 0 && <span className="text-sm text-gray-700">{set.weight} кг</span>}
                                  {set.reps && set.reps > 0 && <span className="text-sm text-gray-700">{set.reps} повт.</span>}
                                  {set.duration && set.duration > 0 && <span className="text-sm text-gray-700">{set.duration} сек</span>}
                                  {(!set.weight || set.weight === 0) && 
                                   (!set.reps || set.reps === 0) && 
                                   (!set.duration || set.duration === 0) && 
                                   <span className="text-sm text-gray-500">Выполнено</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Кнопка завершения программы */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowConfirmationModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md"
                    >
                      Завершить программу
                    </button>
                  </div>
                  
                  {/* Модальное окно подтверждения */}
                  {showConfirmationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Завершить тренировку?</h3>
                        <p className="text-gray-600 mb-6">
                          Вы уверены, что хотите завершить текущую тренировку и вернуться в меню программ? Прогресс может быть потерян.
                        </p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setShowConfirmationModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                          >
                            Отмена
                          </button>
                          <button
                            onClick={goToPrograms}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Завершить
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
