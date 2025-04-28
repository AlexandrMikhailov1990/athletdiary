import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import type { ActiveProgram as ActiveProgramType } from '../models/ActiveProgram';
import type { WorkoutHistory } from '../models/WorkoutHistory';
import ContinueWorkoutButton from '../components/ContinueWorkoutButton';
import Link from 'next/link';
import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../models/Exercise';

export default function ActiveProgram() {
  const router = useRouter();
  
  // Все хуки должны быть объявлены на верхнем уровне функции компонента
  // и всегда в одном и том же порядке
  const [activeProgram, setActiveProgram] = useState<ActiveProgramType | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  
  // Добавим переменную currentWorkout
  const currentWorkout = useMemo(() => {
    if (!activeProgram || !program || !program.workouts) return null;
    
    const currentWorkoutIndex = activeProgram.currentDay - 1;
    if (currentWorkoutIndex < 0 || currentWorkoutIndex >= program.workouts.length) {
      return null;
    }
    
    return program.workouts[currentWorkoutIndex];
  }, [activeProgram, program]);

  // Используем NORMALIZED_SAMPLE_EXERCISES в качестве sampleExercises
  const sampleExercises = NORMALIZED_SAMPLE_EXERCISES;

  // Функция для получения типа упражнения
  const getExerciseType = (type: string | undefined): string => {
    switch(type) {
      case 'reps':
        return 'Повторения';
      case 'timed':
        return 'Таймер';
      case 'distance':
        return 'Дистанция';
      default:
        return 'Упражнение';
    }
  };
  
  // Добавим функцию для сброса прогресса программы
  const resetProgramProgress = () => {
    if (!activeProgram || !program) return;
    
    // Создаем новый объект активной программы с сброшенными значениями
    const resetProgram: ActiveProgramType = {
      ...activeProgram,
      currentDay: 1,
      currentWeek: 1,
      completedWorkouts: [],
      startDate: new Date().toISOString()
    };
    
    // Сохраняем сброшенную программу
    localStorage.setItem('activeProgram', JSON.stringify(resetProgram));
    
    // Обновляем состояние
    setActiveProgram(resetProgram);
    
    // Уведомляем пользователя
    alert('Прогресс программы сброшен. Программа начата сначала.');
  };
  
  // Безопасно вычисляем значения даже при отсутствии данных
  const daysSinceStart = useMemo(() => {
    if (!activeProgram) return 0;
    const currentDate = new Date();
    const startDate = new Date(activeProgram.startDate);
    return Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [activeProgram]);
  
  // Вычисляем дни с последней тренировки
  const daysSinceLastWorkout = useMemo(() => {
    if (!activeProgram || !activeProgram.completedWorkouts || activeProgram.completedWorkouts.length === 0) return 0;
    
    // Находим дату последней тренировки
    const lastWorkoutDate = new Date(
      Math.max(...activeProgram.completedWorkouts.map(w => new Date(w.date).getTime()))
    );
    const currentDate = new Date();
    return Math.floor((currentDate.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [activeProgram]);
  
  // Вычисляем прогресс безопасно
  const progressData = useMemo(() => {
    if (!activeProgram || !program) {
      return { percentage: 0, completed: 0, total: 0 };
    }
    
    const completed = typeof activeProgram.completedWorkouts === 'number' ? 
      activeProgram.completedWorkouts : 
      activeProgram.completedWorkouts?.length || 0;
    
    const total = program.workouts?.length || 0;
    const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
    
    return { 
      percentage, 
      completed, 
      total 
    };
  }, [activeProgram, program]);

  useEffect(() => {
    // Загрузка активной программы
    const loadActiveProgram = () => {
      const savedProgram = localStorage.getItem('activeProgram');
      if (!savedProgram) {
        router.push('/programs');
        return;
      }
      
      // Загружаем активную программу
      const activeProgramData = JSON.parse(savedProgram) as ActiveProgramType;
      setActiveProgram(activeProgramData);
      
      // Загружаем программу
      const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]') as Program[];
      let foundProgram = [...SAMPLE_PROGRAMS, ...savedPrograms].find(p => p.id === activeProgramData.programId);
      
      // Если не нашли в основных программах, ищем в активных программах
      if (!foundProgram) {
        const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]') as (ActiveProgramType & { program: Program })[];
        const activeProgram = activePrograms.find(p => p.programId === activeProgramData.programId);
        if (activeProgram?.program) {
          foundProgram = activeProgram.program;
        }
      }
      
      if (foundProgram) {
        // Проверяем, есть ли у программы свойство exercises, если нет, получаем их из первой тренировки
        if (!foundProgram.exercises && foundProgram.workouts && foundProgram.workouts.length > 0) {
          foundProgram.exercises = foundProgram.workouts[0].exercises;
        }
        
        setProgram(foundProgram);
        
        // Загружаем историю тренировок для этой программы
        loadWorkoutHistory(activeProgramData.programId, foundProgram);
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    // Отдельная функция для загрузки истории тренировок
    const loadWorkoutHistory = (programId: string, program: Program) => {
      // Загружаем полную историю тренировок
      const allHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      console.log('Загружена история тренировок:', allHistory.length, 'записей');
      
      // Фильтруем историю по текущей программе
      const programHistory = allHistory.filter((h: any) => {
        // Прямое совпадение по programId
        const matchByProgramId = h.programId === programId;
        if (matchByProgramId) {
          console.log('Найдено совпадение по programId:', h.programId);
          return true;
        }
        
        // Проверка на workoutId, если они совпадают с ID тренировок в программе
        if (program.workouts && h.workoutId) {
          const matchByWorkoutId = program.workouts.some(w => w.id === h.workoutId);
          if (matchByWorkoutId) {
            console.log('Найдено совпадение по workoutId:', h.workoutId);
            return true;
          }
        }
        
        return false;
      });
      
      console.log('Отфильтрованная история для программы:', programHistory.length, 'записей');
      setWorkoutHistory(programHistory);
    };
    
    loadActiveProgram();
  }, [router]);

  // Функция для рендеринга деталей истории тренировки
  // Эта функция не использует хуки внутри, поэтому безопасна
  const renderWorkoutHistory = (workout: any) => {
    if (!workoutHistory) return null;
    
    // Ищем тренировку в истории по дате
    const foundWorkout = workoutHistory.find(h => 
      new Date(h.date).toDateString() === new Date(workout.date).toDateString()
    );
    
    // Если нет данных истории или нет упражнений, показываем сообщение
    if (!foundWorkout || !foundWorkout.exercises || foundWorkout.exercises.length === 0) {
      return (
        <p className="text-sm text-gray-500 italic">Нет подробных данных о тренировке</p>
      );
    }

    // Найдена история тренировки, показываем детальную информацию
    return (
      <div className="mt-2 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Выполненные упражнения:</h4>
        {foundWorkout.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="text-sm pl-4 border-l-2 border-blue-200">
            <div className="font-medium">{ex.name || (ex as any).exercise?.name}</div>
            <div className="text-gray-600">
              {ex.sets?.filter(s => s.completed).length || 0} из {ex.sets?.length || 0} подходов
              {ex.sets && ex.sets.length > 0 ? (
                <div className="text-gray-600 mt-1">
                  {ex.sets.filter(s => s.completed).map((set, setIdx) => (
                    <div key={setIdx} className="text-xs">
                      Подход {setIdx + 1}: 
                      {set.weight && typeof set.weight === 'number' && set.weight > 0 ? `${set.weight} кг` : 
                        set.weight && !isNaN(Number(set.weight)) && Number(set.weight) > 0 ? `${Number(set.weight)} кг` : ''}
                          
                      {(set.weight && ((typeof set.weight === 'number' && set.weight > 0) || 
                        (!isNaN(Number(set.weight)) && Number(set.weight) > 0))) && 
                        (set.reps && ((typeof set.reps === 'number' && set.reps > 0) || 
                        (!isNaN(Number(set.reps)) && Number(set.reps) > 0))) ? ' × ' : ''}
                          
                      {set.reps && typeof set.reps === 'number' && set.reps > 0 ? `${set.reps} повт.` : 
                        set.reps && !isNaN(Number(set.reps)) && Number(set.reps) > 0 ? `${Number(set.reps)} повт.` : ''}
                          
                      {(set as any).duration && typeof (set as any).duration === 'number' && (set as any).duration > 0 ? 
                        `${(set as any).duration} сек` : 
                        (set as any).duration && !isNaN(Number((set as any).duration)) && Number((set as any).duration) > 0 ? 
                        `${Number((set as any).duration)} сек` : ''}
                      
                      {((!set.weight || typeof set.weight !== 'number' || set.weight <= 0) && 
                        (!set.reps || typeof set.reps !== 'number' || set.reps <= 0) && 
                        (!(set as any).duration || typeof (set as any).duration !== 'number' || (set as any).duration <= 0)) || 
                        ((set.weight && !isNaN(Number(set.weight)) && Number(set.weight) <= 0) && 
                        (set.reps && !isNaN(Number(set.reps)) && Number(set.reps) <= 0) && 
                        ((set as any).duration && !isNaN(Number((set as any).duration)) && Number((set as any).duration) <= 0)) ? 
                        'Выполнено' : ''}
                    </div>
                  ))}
                </div>
              ) : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Загрузочный экран
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка программы...</p>
        </div>
      </div>
    );
  }

  // Программа не найдена
  if (!activeProgram || !program) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Программа не найдена</p>
          <button
            onClick={() => router.push('/programs')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            К списку программ
          </button>
        </div>
      </div>
    );
  }

  // Основной рендеринг страницы
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">{program.name}</h1>

          {/* Прогресс программы */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Ваш прогресс</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{progressData.completed}</div>
                <div className="text-gray-600">Завершено тренировок</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{daysSinceStart}</div>
                <div className="text-gray-600">Дней с начала</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{daysSinceLastWorkout}</div>
                <div className="text-gray-600">Дней с последней тренировки</div>
              </div>
            </div>

            {/* Прогресс бар */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 dark:text-gray-300">Прогресс программы</span>
                <span className="text-gray-700 dark:text-gray-300">{progressData.percentage}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${progressData.percentage}%` }}
                ></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Завершено {progressData.completed} из {progressData.total} тренировок
              </p>
            </div>
          </div>

          {/* Текущая тренировка */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-800">Сегодняшняя тренировка</h2>
              
              {/* Современный значок для начала тренировки (Floating Action Button style) */}
              <button
                onClick={() => router.push('/workout?start=true')}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-10 h-10 shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                aria-label="Начать тренировку"
                title="Начать тренировку"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Неделя {activeProgram.currentWeek}, День {activeProgram.currentDay}
              </p>
              
              {/* Список упражнений */}
              {program.exercises && program.exercises.length > 0 ? (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">Упражнения в программе:</h3>
                  {program.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="font-medium">{exercise.exercise?.name || 'Упражнение'}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {exercise.sets} подходов × {exercise.exercise?.type === 'reps' ? `${exercise.reps} повторений` : `${exercise.duration} сек`}
                        {exercise.weight && exercise.weight > 0 ? ` • ${exercise.weight} кг` : ''}
                        {` • ${exercise.restTime} сек отдыха`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-amber-700">В этой программе пока нет упражнений.</p>
                </div>
              )}
              
              <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => router.push('/workout?start=true')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Начать тренировку
                </button>
                
                <ContinueWorkoutButton fullWidth={false} />
                
                <button
                  onClick={() => router.push('/programs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  К списку программ
                </button>
              </div>
            </div>
          </div>

          {/* История тренировок */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">История тренировок</h2>
            
            {activeProgram.completedWorkouts && activeProgram.completedWorkouts.length > 0 ? (
              <div className="space-y-4">
                {activeProgram.completedWorkouts.map((workout, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Неделя {workout.week}, День {workout.day}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {renderWorkoutHistory(workout)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-amber-700">Вы еще не завершили ни одной тренировки в этой программе.</p>
              </div>
            )}
          </div>

          {/* Кнопка отмены программы */}
          <div className="text-center">
            <button
              className="text-red-600 hover:text-red-700 font-semibold"
              onClick={() => {
                if (confirm('Вы уверены, что хотите отменить программу? Весь прогресс будет потерян.')) {
                  localStorage.removeItem('activeProgram');
                  router.push('/programs');
                }
              }}
            >
              Отменить программу
            </button>
          </div>

          {activeProgram && program && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Следующая тренировка</h2>
                <div className="relative">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                {currentWorkout ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-800">{currentWorkout.name}</h3>
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        День {activeProgram.currentDay} / Неделя {activeProgram.currentWeek}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{currentWorkout.notes || "Тренировка в рамках программы"}</p>
                    
                    {/* Список упражнений в тренировке */}
                    <div className="divide-y divide-gray-100">
                      {currentWorkout.exercises && currentWorkout.exercises.map((exercise, index) => {
                        const ex = exercise.exercise || sampleExercises.find(e => e.id === exercise.exerciseId) || null;
                        if (!ex) return null;
                        
                        return (
                          <div key={index} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{ex.name}</p>
                              <p className="text-sm text-gray-500">
                                {ex.type === 'reps' 
                                  ? `${exercise.sets || ex.sets || 3} × ${ex.reps || '8-12'} повт.`
                                  : `${exercise.sets || ex.sets || 1} × ${ex.duration || 60} сек`
                                }
                              </p>
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {getExerciseType(ex.type)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Кнопка начала тренировки */}
                    <div className="mt-6">
                      <Link href="/workout?start=true" passHref>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Начать тренировку
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Программа тренировок завершена</p>
                    <button 
                      onClick={resetProgramProgress}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Начать программу заново
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 