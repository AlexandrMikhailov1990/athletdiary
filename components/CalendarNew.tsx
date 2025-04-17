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

// Вспомогательная функция для форматирования даты YYYY-MM-DD
const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Месяцы начинаются с 0
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Вспомогательная функция для форматирования времени в ISO строку
const formatToLocalISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Месяцы начинаются с 0
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000`;
};

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
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [mobileTooltip, setMobileTooltip] = useState<{visible: boolean, info: string, type: 'workout' | 'planned', position: {x: number, y: number}}>({
    visible: false,
    info: '',
    type: 'workout',
    position: {x: 0, y: 0}
  });
  
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
  }, [currentDate, workoutHistory, plannedWorkouts, viewMode]);
  
  // Функция для генерации дней календаря
  const generateCalendar = () => {
    if (viewMode === 'month') {
      generateMonthView();
    } else if (viewMode === 'week') {
      generateWeekView();
    } else if (viewMode === 'day') {
      generateDayView();
    }
  };
  
  // Генерация месячного представления
  const generateMonthView = () => {
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
  
  // Генерация недельного представления
  const generateWeekView = () => {
    const days: CalendarDay[] = [];
    const currentDay = currentDate.getDay(); // 0 - воскресенье, 1 - понедельник
    const firstDayOfWeek = currentDay === 0 ? 6 : currentDay - 1; // Преобразуем к пн-вс
    
    // Находим понедельник текущей недели
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - firstDayOfWeek);
    
    // Создаем 7 дней, начиная с понедельника
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(createCalendarDay(date, true));
    }
    
    setCalendarDays(days);
  };
  
  // Генерация представления дня
  const generateDayView = () => {
    const days: CalendarDay[] = [];
    days.push(createCalendarDay(currentDate, true));
    setCalendarDays(days);
  };
  
  // Создание объекта дня календаря
  const createCalendarDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
    // Получаем строку даты в формате YYYY-MM-DD для текущего дня календаря
    // без учета временной зоны, чтобы избежать смещения из-за UTC
    const dateString = formatDateYMD(date);
    
    // Ищем тренировки, сравнивая только дату без учета времени и временной зоны
    const workout = workoutHistory.find(w => {
      const wDate = new Date(w.date);
      return formatDateYMD(wDate) === dateString;
    });
    
    // Ищем запланированные тренировки, сравнивая только дату без учета времени
    const plannedWorkout = plannedWorkouts.find(p => {
      const pDate = new Date(p.date);
      return formatDateYMD(pDate) === dateString;
    });
    
    return {
      date,
      isCurrentMonth,
      hasWorkout: !!workout,
      isPlanned: !!plannedWorkout,
      workoutDetails: workout || null,
      plannedWorkoutDetails: plannedWorkout || null
    };
  };
  
  // Функции для навигации по календарю в разных режимах
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Функция для перехода к предыдущему месяцу
  const goToPrevMonth = navigatePrev;
  
  // Функция для перехода к следующему месяцу
  const goToNextMonth = navigateNext;
  
  // Функция для перехода к текущему месяцу
  const goToCurrentMonth = goToToday;
  
  // Форматирование заголовка в зависимости от режима просмотра
  const formatViewTitle = () => {
    if (viewMode === 'month') {
      return formatMonthYear(currentDate);
    } else if (viewMode === 'week') {
      // Находим понедельник и воскресенье текущей недели
      const currentDay = currentDate.getDay(); // 0 - воскресенье, 1 - понедельник
      const firstDayOfWeek = currentDay === 0 ? 6 : currentDay - 1; // Преобразуем к пн-вс
      
      // Находим понедельник текущей недели
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() - firstDayOfWeek);
      
      // Находим воскресенье текущей недели
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      // Если месяц одинаковый
      if (monday.getMonth() === sunday.getMonth()) {
        return `${monday.getDate()}-${sunday.getDate()} ${monday.toLocaleString('ru-RU', { month: 'long' })}`;
      } else {
        // Если неделя пересекает границу месяца
        return `${monday.getDate()} ${monday.toLocaleString('ru-RU', { month: 'long' })} - ${sunday.getDate()} ${sunday.toLocaleString('ru-RU', { month: 'long' })}`;
      }
    } else {
      // Для режима дня
      return currentDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
      });
    }
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
    
    // Создаем новую дату с выбранным временем, сохраняя выбранную дату
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const dateWithTime = new Date(selectedDate);
    
    // Устанавливаем время без изменения даты
    dateWithTime.setHours(hours, minutes, 0, 0);
    
    // Используем вспомогательную функцию для создания локальной ISO строки
    const localISOString = formatToLocalISOString(dateWithTime);
    
    // Для диагностики - выводим информацию о датах
    console.log('Selected date:', selectedDate.toLocaleDateString());
    console.log('Date with time:', dateWithTime.toLocaleDateString(), dateWithTime.toLocaleTimeString());
    console.log('ISO string:', localISOString);
    console.log('Parsed back date:', new Date(localISOString).toLocaleDateString());
    
    const newPlannedWorkout: PlannedWorkout = {
      id: Date.now().toString(),
      date: localISOString,
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
  
  // Обработчик мобильного тапа по тренировке
  const handleMobileWorkoutTap = (e: React.MouseEvent, workout: WorkoutHistory | null | undefined, type: 'workout') => {
    e.stopPropagation();
    
    // Получаем позицию тапа
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    };
    
    // Формируем информацию
    let info = '';
    if (workout && workout.exercises && workout.exercises.length > 0) {
      info = `${workout.exercises[0].name || 'Упражнение'} (${workout.exercises.length} упражнений)`;
    } else {
      info = 'Тренировка выполнена';
    }
    
    // Показываем тултип
    setMobileTooltip({
      visible: true,
      info,
      type,
      position
    });
    
    // Скрываем через 3 секунды
    setTimeout(() => {
      setMobileTooltip(prev => ({...prev, visible: false}));
    }, 3000);
  };
  
  // Обработчик мобильного тапа по запланированной тренировке
  const handleMobilePlannedTap = (e: React.MouseEvent, planned: PlannedWorkout | null | undefined, type: 'planned') => {
    e.stopPropagation();
    
    // Получаем позицию тапа
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    };
    
    // Формируем информацию
    let info = '';
    if (planned) {
      // Обрабатываем время с учетом локальной временной зоны
      const plannedDate = new Date(planned.date);
      const time = plannedDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
      const date = plannedDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
      info = `${planned.title} в ${time} (${date}) - ${planned.type === 'program' ? 'Из программы' : 'Своя тренировка'}`;
    } else {
      info = 'Запланированная тренировка';
    }
    
    // Показываем тултип
    setMobileTooltip({
      visible: true,
      info,
      type,
      position
    });
    
    // Скрываем через 3 секунды
    setTimeout(() => {
      setMobileTooltip(prev => ({...prev, visible: false}));
    }, 3000);
  };
  
  // Модальное окно для добавления тренировки
  const renderAddWorkoutModal = () => {
    if (!showAddModal || !selectedDate) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Запланировать на {selectedDate.toLocaleDateString('ru-RU')}
          </h3>
          
          <div className="mb-3 md:mb-4">
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
          
          <div className="mb-3 md:mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Время
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3 md:mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип тренировки
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
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
            <div className="mb-3 md:mb-4">
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
          
          <div className="flex justify-end space-x-2 md:space-x-3 mt-4 md:mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Отмена
            </button>
            <button
              onClick={addPlannedWorkout}
              disabled={!workoutTitle || (workoutType === 'program' && !selectedProgram)}
              className={`px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm
                ${(!workoutTitle || (workoutType === 'program' && !selectedProgram)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      {/* Переключатель режимов просмотра */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-l-lg border 
              ${viewMode === 'month' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            Месяц
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 text-sm font-medium border-t border-b 
              ${viewMode === 'week' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            Неделя
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 text-sm font-medium rounded-r-lg border 
              ${viewMode === 'day' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            День
          </button>
        </div>
      </div>
      
      {/* Заголовок календаря */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <button 
          onClick={navigatePrev} 
          className="text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {formatViewTitle()}
          </h3>
          <button 
            onClick={goToToday} 
            className="ml-2 text-xs md:text-sm bg-blue-100 text-blue-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded hover:bg-blue-200"
          >
            Сегодня
          </button>
        </div>
        
        <button 
          onClick={navigateNext} 
          className="text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Быстрая навигация для мобильных */}
      <div className="md:hidden mb-4">
        <div className="flex justify-center">
          <button 
            onClick={goToToday} 
            className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
          >
            Перейти к сегодня
          </button>
        </div>
      </div>

      {/* Дни недели - только для режимов месяца и недели */}
      {viewMode !== 'day' && (
        <>
          {/* Дни недели - стандартный вид */}
          <div className="hidden md:grid md:grid-cols-7 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Дни недели - мобильный вид */}
          <div className="grid grid-cols-7 mb-1 md:hidden">
            {['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-500 py-1 text-xs">
                {day}
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Сетка календаря - разные виды для разных режимов */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
          {calendarDays.map((day, index) => renderCalendarDay(day, index))}
        </div>
      )}
      
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
          {calendarDays.map((day, index) => renderCalendarDay(day, index))}
        </div>
      )}
      
      {viewMode === 'day' && (
        <div className="border rounded">
          {calendarDays.length > 0 && renderDayView(calendarDays[0])}
        </div>
      )}
      
      {/* Легенда */}
      <div className="mt-4 md:mt-6 flex items-center justify-center space-x-4 md:space-x-6 text-xs md:text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded mr-1 md:mr-2"></div>
          <span>Выполненные</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded mr-1 md:mr-2"></div>
          <span>Запланированные</span>
        </div>
      </div>

      {/* Мобильный тултип */}
      {mobileTooltip.visible && (
        <div 
          className={`md:hidden absolute z-50 p-2 rounded shadow-lg text-xs max-w-[250px] text-white
            ${mobileTooltip.type === 'workout' ? 'bg-green-600' : 'bg-blue-600'}`}
          style={{
            top: `${mobileTooltip.position.y}px`,
            left: `${mobileTooltip.position.x}px`,
            transform: 'translateY(8px)'
          }}
        >
          {mobileTooltip.info}
          <div 
            className={`absolute -top-2 left-2 w-3 h-3 rotate-45
              ${mobileTooltip.type === 'workout' ? 'bg-green-600' : 'bg-blue-600'}`}
          ></div>
        </div>
      )}
      
      {/* Модальное окно добавления тренировки */}
      {renderAddWorkoutModal()}
    </div>
  );
  
  // Вспомогательная функция для рендеринга ячейки календаря
  function renderCalendarDay(day: CalendarDay, index: number) {
    const isToday = day.date.toDateString() === new Date().toDateString();
    
    return (
      <div 
        key={index} 
        className={`
          min-h-[60px] md:min-h-[100px] p-1 md:p-2 border rounded relative
          ${!day.isCurrentMonth && viewMode === 'month' ? 'bg-gray-50 text-gray-400' : 'bg-white'}
          ${isToday ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={() => day.isCurrentMonth && openAddWorkoutModal(day.date)}
      >
        <div className="text-right text-xs md:text-base mb-1 md:mb-2">
          {day.date.getDate()}
        </div>
        
        {/* Индикатор выполненной тренировки */}
        {day.hasWorkout && (
          <div 
            className="bg-green-500 text-white text-xs rounded p-0.5 md:p-1 mb-0.5 md:mb-1 overflow-hidden text-ellipsis text-[10px] md:text-xs"
            title={day.workoutDetails?.exercises[0]?.name || 'Тренировка выполнена'}
            onClick={(e) => {
              // Только на мобильных устройствах показываем всплывающую информацию
              if (window.innerWidth < 768) {
                handleMobileWorkoutTap(e, day.workoutDetails, 'workout');
              }
            }}
          >
            <span className="hidden md:inline">{day.workoutDetails?.exercises[0]?.name || 'Тренировка выполнена'}</span>
            <span className="md:hidden">✓</span>
          </div>
        )}
        
        {/* Индикатор запланированной тренировки */}
        {day.isPlanned && (
          <div className="group relative">
            <div 
              className="bg-blue-500 text-white text-xs rounded p-0.5 md:p-1 overflow-hidden text-ellipsis text-[10px] md:text-xs"
              onClick={(e) => {
                // Только на мобильных устройствах показываем всплывающую информацию
                if (window.innerWidth < 768) {
                  handleMobilePlannedTap(e, day.plannedWorkoutDetails, 'planned');
                }
              }}
            >
              <span className="hidden md:inline">{day.plannedWorkoutDetails?.title || 'Запланировано'}</span>
              <span className="md:hidden">⏰</span>
            </div>
            
            {/* Всплывающее меню действий */}
            <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded border p-2 z-10 right-0 mt-1 min-w-[120px]">
              <button 
                className="text-blue-600 hover:text-blue-800 text-xs md:text-sm whitespace-nowrap mb-1"
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
                className="text-red-600 hover:text-red-800 text-xs md:text-sm whitespace-nowrap"
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
  }
  
  // Функция для рендеринга представления дня
  function renderDayView(day: CalendarDay) {
    const isToday = day.date.toDateString() === new Date().toDateString();
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="p-4">
        <div className={`text-center text-lg font-semibold mb-4 ${isToday ? 'text-blue-600' : ''}`}>
          {day.date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        
        <div className="space-y-2">
          {hoursOfDay.map((hour) => {
            // Создаем временную метку для текущего часа
            const hourDate = new Date(day.date);
            hourDate.setHours(hour, 0, 0, 0);
            const hourEnd = new Date(hourDate);
            hourEnd.setHours(hour + 1, 0, 0, 0);
            
            // Находим тренировки, запланированные на этот час
            const isHourPlanned = day.isPlanned && day.plannedWorkoutDetails?.date && 
              new Date(day.plannedWorkoutDetails.date).getHours() === hour;
            
            // Определяем, имеет ли этот час выполненную тренировку
            const isHourWorkout = day.hasWorkout && day.workoutDetails?.date && 
              new Date(day.workoutDetails.date).getHours() === hour;
            
            // Определяем текущий час (для выделения)
            const isCurrentHour = new Date().getHours() === hour && isToday;
            
            return (
              <div 
                key={hour}
                className={`flex border-l-4 p-2 rounded ${isCurrentHour ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}
                onClick={() => {
                  // Устанавливаем выбранную дату с учетом часа
                  const selectedDateWithHour = new Date(day.date);
                  selectedDateWithHour.setHours(hour, 0, 0, 0);
                  openAddWorkoutModal(selectedDateWithHour);
                }}
              >
                <div className="w-16 text-right pr-4 text-gray-500">
                  {`${hour}:00`}
                </div>
                
                <div className="flex-1">
                  {isHourWorkout && (
                    <div className="bg-green-500 text-white rounded px-3 py-1 mb-1">
                      <div className="font-semibold">{day.workoutDetails?.exercises[0]?.name || 'Тренировка выполнена'}</div>
                      <div className="text-xs text-green-100">
                        {day.workoutDetails?.exercises.length} упражнений
                      </div>
                    </div>
                  )}
                  
                  {isHourPlanned && (
                    <div className="group relative">
                      <div className="bg-blue-500 text-white rounded px-3 py-1">
                        <div className="font-semibold">{day.plannedWorkoutDetails?.title || 'Запланированная тренировка'}</div>
                        <div className="text-xs text-blue-100">
                          {day.plannedWorkoutDetails?.type === 'program' ? 'Из программы' : 'Своя тренировка'}
                        </div>
                      </div>
                      
                      {/* Всплывающее меню для запланированной тренировки */}
                      <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded border p-2 z-10 right-0 mt-1 min-w-[120px]">
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
              </div>
            );
          })}
        </div>
      </div>
    );
  }
} 