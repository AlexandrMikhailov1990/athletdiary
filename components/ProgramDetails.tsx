import { Program, Workout } from '../models/Program';
import { useState, useEffect, useRef } from 'react';
/* import { FaClock, FaDumbbell, FaCalendarAlt, FaShare, FaDownload, FaChartLine } from 'react-icons/fa'; */
import { Exercise } from '../models/Exercise';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { addHomeExercisesToUserExercises } from '../models/HomeExercises';
import { addExtendedHomeExercises } from '../models/HomeExercisesExtended';

interface ProgramDetailsProps {
  program: Program;
  onClose: () => void;
  onStart?: () => void;
  darkMode?: boolean;
}

export default function ProgramDetails({ program, onClose, onStart, darkMode = false }: ProgramDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule'>('overview');
  const [exercises, setExercises] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const programRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Загрузка дополнительных упражнений
  useEffect(() => {
    const loadAllExercises = async () => {
      setIsLoadingExercises(true);
      try {
        // Загружаем базовый набор упражнений
        await Promise.all([
          // Загружаем базовые домашние упражнения
          new Promise<void>((resolve) => {
            addHomeExercisesToUserExercises();
            resolve();
          }),
          // Загружаем расширенные упражнения
          new Promise<void>((resolve) => {
            addExtendedHomeExercises();
            resolve();
          })
        ]);
        
      } catch (error) {
        console.error('Ошибка при загрузке упражнений:', error);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    
    loadAllExercises();
  }, []);

  // Загрузка упражнений при монтировании компонента
  useEffect(() => {
    if (isLoadingExercises) return;
    
    // Соберем все уникальные упражнения из всех тренировок
    if (program.workouts && program.workouts.length > 0) {
      const allExercises = program.workouts.flatMap(workout => workout.exercises);
      
      // Удаляем дубликаты по id упражнения
      const uniqueExercisesMap = new Map();
      allExercises.forEach(exercise => {
        if (!uniqueExercisesMap.has(exercise.id)) {
          uniqueExercisesMap.set(exercise.id, exercise);
        }
      });
      
      setExercises(Array.from(uniqueExercisesMap.values()));
    } else if (program.exercises) {
      setExercises(program.exercises);
    }
  }, [program, isLoadingExercises]);

  // Поделиться программой
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: program.name,
          text: `Программа тренировок: ${program.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Ошибка при попытке поделиться:', error);
      }
    } else {
      // Если Web Share API не поддерживается, копируем ссылку в буфер обмена
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Ссылка скопирована в буфер обмена');
      });
    }
  };

  // Скачать программу
  const handleDownload = async () => {
    if (!programRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Определяем, какую вкладку экспортировать
      const activeTabElement = activeTab === 'overview' 
        ? overviewRef.current 
        : scheduleRef.current;
      
      if (!activeTabElement) {
        throw new Error('Активная вкладка не найдена');
      }
      
      const canvas = await html2canvas(activeTabElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Вычисляем пропорциональные размеры для PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${program.name}.pdf`);
    } catch (error) {
      console.error('Ошибка при экспорте программы:', error);
      alert('Произошла ошибка при экспорте программы');
    } finally {
      setIsExporting(false);
    }
  };

  // Стили для темной темы
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-gray-200' : 'text-gray-700';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBgColor = darkMode ? 'bg-blue-800' : 'bg-blue-600';
  const infoBlockBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const tabActiveBorder = darkMode ? 'border-blue-500' : 'border-blue-600';
  const tabActiveText = darkMode ? 'text-blue-500' : 'text-blue-600';
  const tabInactiveText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const btnPrimaryBg = darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700';
  const btnSecondaryBg = darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200';
  const btnSecondaryText = darkMode ? 'text-gray-200' : 'text-gray-700';
  
  // Обновим функцию для создания инфографики
  const createInfoGraphic = (program: Program, currentWeek: number, currentDay: number, completedWorkouts: any[]): { calendar: { weeks: any[] } } => {
    const calendar = {
      weeks: [] as any[]
    };

    // Создаем структуру для каждой тренировки в программе
    program.workouts.forEach((workout, index) => {
      // Добавляем информацию о тренировке в календарь
      if (!calendar.weeks[0]) {
        calendar.weeks[0] = {
          days: []
        };
      }
      
      calendar.weeks[0].days.push({
        day: index + 1,
        completed: completedWorkouts.some(w => 
          w.week === currentWeek && w.day === index + 1
        ),
        isCurrent: currentDay === index + 1
      });
    });

    return { calendar };
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${bgColor} ${textColor}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          ref={programRef}
        >
          {/* Кнопка закрытия */}
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 rounded-full p-2 ${btnSecondaryBg}`}
            aria-label="Закрыть"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          {/* Основная информация */}
          <div className={`p-8 ${headerBgColor} text-white rounded-t-xl`}>
            <h1 className="text-3xl font-bold mb-4">{program.name}</h1>
            <p className="mb-6">{program.description}</p>
            
            {/* Информация о программе */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Количество тренировок */}
              <div className={`${infoBlockBg} text-white bg-opacity-25 p-3 rounded-lg flex items-center`}>
                <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80">Тренировки</p>
                  <p className="font-semibold">{program.workouts.length} тренировок</p>
                </div>
              </div>
              
              {/* Количество упражнений */}
              <div className={`${infoBlockBg} text-white bg-opacity-25 p-3 rounded-lg flex items-center`}>
                <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80">Упражнения</p>
                  <p className="font-semibold">{exercises.length} упражнений</p>
                </div>
              </div>
              
              {/* Отдых между упражнениями */}
              <div className={`${infoBlockBg} text-white bg-opacity-25 p-3 rounded-lg flex items-center`}>
                <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80">Отдых</p>
                  <p className="font-semibold">{program.restBetweenExercises || 60} сек</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Табы */}
          <div className={`flex border-b ${borderColor}`}>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === 'overview' 
                  ? `${tabActiveText} border-b-2 ${tabActiveBorder}` 
                  : tabInactiveText
              }`}
            >
              Обзор программы
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === 'schedule' 
                  ? `${tabActiveText} border-b-2 ${tabActiveBorder}` 
                  : tabInactiveText
              }`}
            >
              Расписание
            </button>
          </div>
          
          {/* Содержимое табов */}
          <div className="p-6">
            {/* Таб обзора */}
            {activeTab === 'overview' && (
              <div ref={overviewRef}>
                <h2 className="text-xl font-semibold mb-4">Упражнения в программе</h2>
                
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div key={index} className={`p-4 rounded-lg ${borderColor} border`}>
                      <h3 className="font-medium text-lg mb-2">{exercise.exercise.name}</h3>
                      <p className="mb-2 text-sm">{exercise.exercise.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div className={`p-2 rounded ${infoBlockBg}`}>
                          <span className="block text-xs opacity-70">Подходы</span>
                          <span className="font-medium">{exercise.sets}</span>
                        </div>
                        
                        {exercise.exercise.type === 'reps' ? (
                          <>
                            <div className={`p-2 rounded ${infoBlockBg}`}>
                              <span className="block text-xs opacity-70">Повторения</span>
                              <span className="font-medium">{exercise.reps || '-'}</span>
                            </div>
                            <div className={`p-2 rounded ${infoBlockBg}`}>
                              <span className="block text-xs opacity-70">Вес (кг)</span>
                              <span className="font-medium">{exercise.weight || '-'}</span>
                            </div>
                          </>
                        ) : (
                          <div className={`p-2 rounded ${infoBlockBg}`}>
                            <span className="block text-xs opacity-70">Время (сек)</span>
                            <span className="font-medium">{exercise.duration || '-'}</span>
                          </div>
                        )}
                        
                        <div className={`p-2 rounded ${infoBlockBg}`}>
                          <span className="block text-xs opacity-70">Отдых (сек)</span>
                          <span className="font-medium">{exercise.restTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Таб расписания - упрощенный, показывает просто список тренировок */}
            {activeTab === 'schedule' && (
              <div ref={scheduleRef}>
                <h2 className="text-xl font-semibold mb-4">Расписание тренировок</h2>
                
                <div className="space-y-4">
                  {program.workouts.map((workout, index) => (
                    <div key={index} className={`p-4 rounded-lg ${borderColor} border`}>
                      <h3 className="font-medium text-lg mb-2">
                        {workout.name || `Тренировка ${index + 1}`}
                      </h3>
                      
                      <div className="space-y-2 mt-3">
                        {workout.exercises.map((exercise, exIndex) => (
                          <div key={exIndex} className={`p-3 ${infoBlockBg} rounded-lg`}>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{exercise.exercise.name}</span>
                              <span className="text-sm">
                                {exercise.sets} × {exercise.exercise.type === 'reps' 
                                  ? (exercise.reps || '-') + ' повт.' 
                                  : (exercise.duration || '-') + ' сек'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Кнопки действий */}
          <div className={`p-6 border-t ${borderColor} flex flex-wrap gap-3 justify-between`}>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleShare}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg ${btnSecondaryBg} ${btnSecondaryText}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Поделиться
              </button>
              <button 
                onClick={handleDownload}
                disabled={isExporting}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg ${btnSecondaryBg} ${btnSecondaryText} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                )}
                {isExporting ? 'Экспорт...' : 'Скачать PDF'}
              </button>
            </div>
            
            {onStart && (
              <button 
                onClick={onStart}
                className={`flex items-center gap-1 px-6 py-2 rounded-lg ${btnPrimaryBg} text-white`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Начать программу
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 