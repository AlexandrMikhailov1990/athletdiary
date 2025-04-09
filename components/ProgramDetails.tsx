import { Program, Workout } from '../models/Program';
import { useState } from 'react';

interface ProgramDetailsProps {
  program: Program;
  onClose: () => void;
  onStart?: () => void;
}

export default function ProgramDetails({ program, onClose, onStart }: ProgramDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule'>('overview');
  
  // Функция для отображения уровня сложности на русском языке
  const getLevelLabel = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'Новичок';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  // Группировка тренировок по неделям
  const getWorkoutsByWeek = () => {
    const result: { [key: number]: Workout[] } = {};
    
    // Если программа не содержит тренировок, возвращаем пустой объект
    if (!program.workouts || program.workouts.length === 0) {
      return result;
    }

    // Создаем базовую структуру для недель на основе длительности программы
    for (let i = 1; i <= program.duration; i++) {
      result[i] = [];
    }
    
    // Для демонстрации просто добавляем тренировки к каждой неделе
    // В реальном приложении здесь была бы логика распределения
    const workoutsPerWeek = program.workoutsPerWeek;
    let currentWorkoutIndex = 0;
    
    for (let week = 1; week <= program.duration; week++) {
      for (let i = 0; i < workoutsPerWeek; i++) {
        if (currentWorkoutIndex < program.workouts.length) {
          result[week].push(program.workouts[currentWorkoutIndex]);
          currentWorkoutIndex++;
        } else {
          // Если достигли конца списка тренировок, начинаем сначала
          currentWorkoutIndex = 0;
          if (program.workouts.length > 0) {
            result[week].push(program.workouts[currentWorkoutIndex]);
            currentWorkoutIndex++;
          }
        }
      }
    }
    
    return result;
  };

  const workoutsByWeek = getWorkoutsByWeek();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-90vh overflow-auto">
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{program.name}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Закрыть"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Табы */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Обзор
            </button>
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'schedule'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Расписание
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Описание программы</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Основная информация</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Сложность</p>
                    <p className="font-medium">{getLevelLabel(program.level)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Длительность</p>
                    <p className="font-medium">{program.duration} недель</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-500">Тренировок в неделю</p>
                    <p className="font-medium">{program.workoutsPerWeek}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Что вы получите</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Структурированную программу на {program.duration} недель</li>
                  <li>Подробные инструкции для каждой тренировки</li>
                  <li>Правильное распределение нагрузки</li>
                  <li>Возможность отслеживать прогресс</li>
                  <li>Советы по технике выполнения упражнений</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Рекомендации</h3>
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Перед началом проконсультируйтесь с врачом, если у вас есть проблемы со здоровьем
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Следуйте рекомендациям по технике выполнения упражнений
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Обеспечьте достаточное питание и восстановление между тренировками
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Расписание тренировок</h3>
              
              {Object.keys(workoutsByWeek).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(workoutsByWeek).map(([weekNumber, workouts]) => (
                    <div key={weekNumber} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-medium">Неделя {weekNumber}</h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {workouts.map((workout, index) => (
                          <div key={workout.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-blue-700">
                                День {index + 1}: {workout.name}
                              </h5>
                              <span className="text-sm text-gray-500">
                                {workout.exercises.length} упражнений
                              </span>
                            </div>
                            {workout.notes && (
                              <p className="text-sm text-gray-600 mt-1">{workout.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Для этой программы еще не добавлены тренировки.</p>
                </div>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Закрыть
            </button>
            
            {onStart && (
              <button
                onClick={onStart}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Начать программу
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 