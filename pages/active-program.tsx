import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import type { ActiveProgram } from '../models/ActiveProgram';
import type { WorkoutHistory } from '../models/WorkoutHistory';

export default function ActiveProgram() {
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);

  useEffect(() => {
    // Загрузка активной программы
    const loadActiveProgram = () => {
      const savedProgram = localStorage.getItem('activeProgram');
      if (!savedProgram) {
        router.push('/programs');
        return;
      }
      
      // Загружаем активную программу
      const activeProgramData = JSON.parse(savedProgram) as ActiveProgram;
      setActiveProgram(activeProgramData);
      
      // Загружаем программу
      const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]') as Program[];
      let foundProgram = [...SAMPLE_PROGRAMS, ...savedPrograms].find(p => p.id === activeProgramData.programId);
      
      // Если не нашли в основных программах, ищем в активных программах
      if (!foundProgram) {
        const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]') as (ActiveProgram & { program: Program })[];
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
      
      // Фильтруем историю по текущей программе
      // Проверяем совпадение по programId
      const programHistory = allHistory.filter((h: any) => {
        // Прямое совпадение по programId
        if (h.programId === programId) return true;
        
        // Проверка на workoutId, если они совпадают с ID тренировок в программе (для WorkoutRecord)
        if (program.workouts && h.workoutId) {
          return program.workouts.some(w => w.id === h.workoutId);
        }
        
        return false;
      });
      
      setWorkoutHistory(programHistory);
    };
    
    loadActiveProgram();
  }, [router]);

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

  const currentDate = new Date();
  const startDate = new Date(activeProgram.startDate);
  const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">{program.name}</h1>

          {/* Прогресс программы */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Ваш прогресс</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{activeProgram.currentWeek}</div>
                <div className="text-gray-600">Неделя</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{activeProgram.currentDay}</div>
                <div className="text-gray-600">День недели</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{daysSinceStart}</div>
                <div className="text-gray-600">Дней с начала</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {activeProgram.completedWorkouts?.length || 0}
                </div>
                <div className="text-gray-600">Завершено</div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Прогресс
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(((activeProgram.completedWorkouts?.length || 0) / ((program.durationWeeks || 0) * (program.workoutsPerWeek || 0))) * 100)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${((activeProgram.completedWorkouts?.length || 0) / ((program.durationWeeks || 0) * (program.workoutsPerWeek || 0))) * 100}%`
                  }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-500">
                Прогресс: {activeProgram.completedWorkouts?.length || 0} из {(program.durationWeeks || 0) * (program.workoutsPerWeek || 0)} тренировок &bull; 
                {Math.round(((activeProgram.completedWorkouts?.length || 0) / ((program.durationWeeks || 0) * (program.workoutsPerWeek || 0))) * 100)}%
              </div>
            </div>
          </div>

          {/* Текущая тренировка */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Сегодняшняя тренировка</h2>
            
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
                      <div className="font-medium">{exercise.exercise.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {exercise.sets} подходов × {exercise.exercise.type === 'reps' ? `${exercise.reps} повторений` : `${exercise.duration} сек`}
                        {exercise.weight && exercise.weight > 0 ? ` • ${exercise.weight} кг` : ''}
                        {` • ${exercise.rest} сек отдыха`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-amber-700">В этой программе пока нет упражнений.</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/workout')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Начать тренировку
                </button>
                
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
                {activeProgram.completedWorkouts?.map((workout, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Неделя {workout.week}, День {workout.day}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {(() => {
                      const foundWorkout = workoutHistory?.find(h => 
                        new Date(h.date).toDateString() === new Date(workout.date).toDateString()
                      );

                      return foundWorkout && foundWorkout.exercises && foundWorkout.exercises.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Выполненные упражнения:</h4>
                          {foundWorkout.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="text-sm pl-4 border-l-2 border-blue-200">
                              <div className="font-medium">{ex.name}</div>
                              <div className="text-gray-600">
                                {ex.sets?.filter(s => s.completed).length || 0} из {ex.sets?.length || 0} подходов
                                {ex.sets && ex.sets.length > 0 && ex.sets[0]?.weight > 0 ? 
                                  ` • ${Math.max(...ex.sets.map(s => s?.weight || 0))} кг` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Нет подробных данных о тренировке</p>
                      );
                    })()}
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
        </div>
      </div>
    </div>
  );
} 