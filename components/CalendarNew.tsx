import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { WorkoutHistory, PlannedWorkout } from '../models/WorkoutHistory';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasWorkout: boolean;
  isPlanned: boolean;
  workoutDetails?: WorkoutHistory | null;
  plannedWorkoutDetails?: PlannedWorkout | null;
}

interface CalendarProps {
  workoutHistory: WorkoutHistory[];
  plannedWorkouts: PlannedWorkout[];
  onUpdatePlannedWorkouts: (workouts: PlannedWorkout[]) => void;
}

export default function CalendarNew({ workoutHistory, plannedWorkouts, onUpdatePlannedWorkouts }: CalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutType, setWorkoutType] = useState('custom');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [userPrograms, setUserPrograms] = useState<any[]>([]);
  
  // Получение списка программ пользователя
  useEffect(() => {
    const savedPrograms = localStorage.getItem('programs');
    if (savedPrograms) {
      setUserPrograms(JSON.parse(savedPrograms));
    }
  }, []);
  
  // Генерация календаря при изменении месяца или данных тренировок
  useEffect(() => {
    generateCalendar();
  }, [currentDate, workoutHistory, plannedWorkouts]);
  
  // Функция для генерации дней календаря
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Первый день месяца
    const firstDayOfMonth = new Date(year, month, 1);
    // Последний день месяца
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // День недели первого дня месяца (0 - воскресенье, 1 - понедельник, ...)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Преобразуем, чтобы неделя начиналась с понедельника
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Создаем массив дней
    const days: CalendarDay[] = [];
    
    // Добавляем дни предыдущего месяца
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(createCalendarDay(date, false));
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(createCalendarDay(date, true));
    }
    
    // Определяем, сколько дней следующего месяца нужно добавить,
    // чтобы заполнить сетку (обычно 7 строк по 7 дней = 49 дней)
    const remainingDays = 42 - days.length; // 6 недель по 7 дней
    
    // Добавляем дни следующего месяца
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(createCalendarDay(date, false));
    }
    
    setCalendarDays(days);
  };
  
  // Создание объекта дня календаря
  const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
    // Проверяем, есть ли тренировка в истории для этого дня
    const dateString = date.toISOString().slice(0, 10);
    const workout = workoutHistory.find(w => 
      new Date(w.date).toISOString().slice(0, 10) === dateString
    );
    
    // Проверяем, есть ли запланированная тренировка для этого дня
    const plannedWorkout = plannedWorkouts.find(p => 
      new Date(p.date).toISOString().slice(0, 10) === dateString
    );
    
    return {
      date,
      isCurrentMonth,
      hasWorkout: !!workout,
      isPlanned: !!plannedWorkout,
      workoutDetails: workout || null,
      plannedWorkoutDetails: plannedWorkout || null
    };
  };
  
  // Функция для перехода к предыдущему месяцу
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Функция для перехода к следующему месяцу
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Функция для перехода к текущему месяцу
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };
  
  // Функция для отображения модального окна добавления тренировки
  const openAddWorkoutModal = (date: Date) => {
    setSelectedDate(date);
    setWorkoutTitle('');
    setWorkoutType('custom');
    setSelectedProgram('');
    setShowAddModal(true);
  };
  
  // Функция для добавления запланированной тренировки
  const addPlannedWorkout = () => {
    if (!selectedDate || !workoutTitle) return;
    
    const newPlannedWorkout: PlannedWorkout = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      title: workoutTitle,
      type: workoutType as 'custom' | 'program',
      programId: workoutType === 'program' ? selectedProgram : undefined
    };
    
    const updatedWorkouts = [...plannedWorkouts, newPlannedWorkout];
    onUpdatePlannedWorkouts(updatedWorkouts);
    setShowAddModal(false);
  };
  
  // Функция для удаления запланированной тренировки
  const removePlannedWorkout = (workoutId: string) => {
    const updatedWorkouts = plannedWorkouts.filter(w => w.id !== workoutId);
    onUpdatePlannedWorkouts(updatedWorkouts);
  };
  
  // Переход к странице тренировки
  const startPlannedWorkout = (workoutId: string) => {
    const plannedWorkout = plannedWorkouts.find(w => w.id === workoutId);
    
    if (plannedWorkout && plannedWorkout.type === 'program' && plannedWorkout.programId) {
      // Если это программа, переходим на страницу активной программы
      router.push(`/active-program?id=${plannedWorkout.programId}`);
    } else {
      // Для пользовательских тренировок можно направить на страницу создания тренировки
      router.push('/create-workout');
    }
  };
  
  // Форматирование даты для отображения месяца и года
  const formatMonthYear = (date: Date) => {
    // Получаем месяц с заглавной буквы
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    
    // Получаем год
    const year = date.getFullYear();
    
    // Возвращаем отформатированную строку с маленькой буквой "г"
    return `${capitalizedMonth} ${year} г.`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Заголовок календаря */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={goToPrevMonth} 
          className="text-blue-600 hover:text-blue-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {formatMonthYear(currentDate)}
          </h3>
          <button 
            onClick={goToCurrentMonth} 
            className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Сегодня
          </button>
        </div>
        
        <button 
          onClick={goToNextMonth} 
          className="text-blue-600 hover:text-blue-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Дни недели */}
      <div className="grid grid-cols-7 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Сетка календаря */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isToday = day.date.toDateString() === new Date().toDateString();
          
          return (
            <div 
              key={index} 
              className={`
                min-h-[100px] p-2 border rounded relative
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => day.isCurrentMonth && openAddWorkoutModal(day.date)}
            >
              <div className="text-right mb-2">
                {day.date.getDate()}
              </div>
              
              {/* Индикатор выполненной тренировки */}
              {day.hasWorkout && (
                <div 
                  className="bg-green-500 text-white text-xs rounded p-1 mb-1 overflow-hidden text-ellipsis"
                  title={day.workoutDetails?.exercises[0]?.name || 'Тренировка выполнена'}
                >
                  {day.workoutDetails?.exercises[0]?.name || 'Тренировка выполнена'}
                </div>
              )}
              
              {/* Индикатор запланированной тренировки */}
              {day.isPlanned && (
                <div className="group relative">
                  <div className="bg-blue-500 text-white text-xs rounded p-1 overflow-hidden text-ellipsis">
                    {day.plannedWorkoutDetails?.title || 'Запланировано'}
                  </div>
                  
                  {/* Всплывающее меню действий */}
                  <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded border p-2 z-10 right-0 mt-1">
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap mb-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (day.plannedWorkoutDetails?.id) {
                          startPlannedWorkout(day.plannedWorkoutDetails.id);
                        }
                      }}
                    >
                      Начать тренировку
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 text-sm whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (day.plannedWorkoutDetails?.id) {
                          removePlannedWorkout(day.plannedWorkoutDetails.id);
                        }
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Модальное окно добавления тренировки */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Запланировать тренировку на {selectedDate.toLocaleDateString('ru-RU')}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название тренировки
              </label>
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название тренировки"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип тренировки
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={workoutType === 'custom'}
                    onChange={() => setWorkoutType('custom')}
                    className="mr-2"
                  />
                  Своя тренировка
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="program"
                    checked={workoutType === 'program'}
                    onChange={() => setWorkoutType('program')}
                    className="mr-2"
                  />
                  Из программы
                </label>
              </div>
            </div>
            
            {workoutType === 'program' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Выберите программу
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите программу</option>
                  {userPrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={addPlannedWorkout}
                disabled={!workoutTitle || (workoutType === 'program' && !selectedProgram)}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                  ${(!workoutTitle || (workoutType === 'program' && !selectedProgram)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Легенда */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">Выполненные тренировки</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm">Запланированные тренировки</span>
        </div>
      </div>
    </div>
  );
} 