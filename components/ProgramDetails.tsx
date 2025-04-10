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
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [weeks, setWeeks] = useState<{ value: number; label: string }[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const programRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  
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

  // Группировка тренировок по неделям
  const getWorkoutsByWeek = () => {
    const result: { [key: number]: Workout[] } = {};
    
    // Если программа не содержит тренировок, возвращаем пустой объект
    if (!program.workouts || program.workouts.length === 0) {
      return result;
    }

    // Создаем базовую структуру для недель на основе длительности программы
    for (let i = 1; i <= program.durationWeeks; i++) {
      result[i] = [];
    }
    
    // Распределяем тренировки по неделям
    const workoutsPerWeek = program.workoutsPerWeek;
    let currentWorkoutIndex = 0;
    
    for (let week = 1; week <= program.durationWeeks; week++) {
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

  // Генерация данных для недель
  useEffect(() => {
    if (program) {
      const weekOptions = [];
      for (let i = 1; i <= program.durationWeeks; i++) {
        weekOptions.push({ value: i, label: `Неделя ${i}` });
      }
      setWeeks(weekOptions);
      
      // Устанавливаем первую неделю по умолчанию
      if (weekOptions.length > 0 && selectedWeek === null) {
        setSelectedWeek(1);
      }
    }
  }, [program, selectedWeek]);

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
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={`${bgColor} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto ${borderColor} border`}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          ref={programRef}
        >
          <div className={`sticky top-0 ${headerBgColor} text-white p-4 flex justify-between items-center z-10`}>
            <h2 className="text-xl font-bold">{program.name}</h2>
            <div className="flex space-x-2">
              <motion.button
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
                onClick={handleShare}
                title="Поделиться программой"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </motion.button>
              <motion.button
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
                onClick={handleDownload}
                title="Скачать программу"
                disabled={isExporting}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.button>
              <motion.button
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
                onClick={onClose}
                title="Закрыть"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${borderColor} sticky top-16 ${bgColor} z-10`}>
            <motion.button
              className={`flex-1 py-4 font-medium border-b-2 ${
                activeTab === 'overview' ? `${tabActiveBorder} ${tabActiveText}` : `border-transparent ${tabInactiveText}`
              } transition-colors relative`}
              onClick={() => setActiveTab('overview')}
              whileTap={{ scale: 0.97 }}
            >
              Обзор
              {activeTab === 'overview' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" 
                  layoutId="activeTab"
                />
              )}
            </motion.button>
            <motion.button
              className={`flex-1 py-4 font-medium border-b-2 ${
                activeTab === 'schedule' ? `${tabActiveBorder} ${tabActiveText}` : `border-transparent ${tabInactiveText}`
              } transition-colors relative`}
              onClick={() => setActiveTab('schedule')}
              whileTap={{ scale: 0.97 }}
            >
              Расписание
              {activeTab === 'schedule' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" 
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          </div>

          {/* Content */}
          <div className={`p-5 ${textColor}`}>
            {/* Overview tab */}
            {activeTab === 'overview' && (
              <motion.div 
                ref={overviewRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-6 text-base leading-relaxed">{program.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div 
                    className={`${infoBlockBg} rounded-lg p-4 shadow-md flex flex-col hover:shadow-lg transition-shadow transform`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-sm text-gray-500 mb-1">Сложность</span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium">{getLevelLabel(program.level)}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className={`${infoBlockBg} rounded-lg p-4 shadow-md flex flex-col hover:shadow-lg transition-shadow transform`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-sm text-gray-500 mb-1">Продолжительность</span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{program.durationWeeks} {program.durationWeeks === 1 ? 'неделя' : program.durationWeeks >= 2 && program.durationWeeks <= 4 ? 'недели' : 'недель'}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className={`${infoBlockBg} rounded-lg p-4 shadow-md flex flex-col hover:shadow-lg transition-shadow transform`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-sm text-gray-500 mb-1">Тренировок в неделю</span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h14M5 17h14" />
                      </svg>
                      <span className="font-medium">{program.workoutsPerWeek}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className={`${infoBlockBg} rounded-lg p-4 shadow-md flex flex-col hover:shadow-lg transition-shadow transform`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-sm text-gray-500 mb-1">Отдых между подходами</span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{program.restBetweenSets || 90} сек</span>
                    </div>
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Упражнения в программе</h3>
                
                {isLoadingExercises ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="ml-4">Загрузка упражнений...</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-8">
                    {exercises && exercises.length > 0 ? (
                      exercises.map((exercise, index) => (
                        <motion.div 
                          key={exercise.id || index}
                          className={`rounded-lg p-4 border ${borderColor} hover:shadow-md transition-shadow`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <div className="flex items-start">
                            {exercise.exercise?.imageUrl && (
                              <div className="w-16 h-16 mr-4 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={exercise.exercise.imageUrl} 
                                  alt={exercise.exercise.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/exercise-placeholder.png';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{exercise.exercise?.name || exercise.name}</h4>
                              <p className="text-sm text-gray-500 mb-2">
                                {exercise.sets} {exercise.sets === 1 ? 'подход' : exercise.sets > 1 && exercise.sets < 5 ? 'подхода' : 'подходов'} × {exercise.reps || '-'} {exercise.reps === 1 ? 'повторение' : exercise.reps && exercise.reps > 1 && exercise.reps < 5 ? 'повторения' : 'повторений'}
                                {exercise.weight ? ` • ${exercise.weight} кг` : ''}
                              </p>
                              
                              <p className="text-sm">
                                {exercise.exercise?.description || exercise.description || 'Нет описания'}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(exercise.exercise?.muscleGroups || exercise.muscleGroups) && 
                                  (exercise.exercise?.muscleGroups || exercise.muscleGroups).map((group: string) => (
                                    <span key={group} className={`${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded-full`}>
                                      {group}
                                    </span>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">Нет упражнений в программе</p>
                    )}
                  </div>
                )}
                
                <div className="flex justify-center mt-8">
                  {onStart && (
                    <motion.button 
                      className={`${btnPrimaryBg} text-white px-6 py-3 rounded-lg font-medium shadow-lg transition`}
                      onClick={onStart}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Начать программу
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Schedule tab */}
            {activeTab === 'schedule' && (
              <motion.div 
                ref={scheduleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Выберите неделю</label>
                  
                  <div className="flex flex-wrap gap-2">
                    {weeks.map((week) => (
                      <motion.button
                        key={week.value}
                        className={`px-4 py-2 rounded-md ${
                          selectedWeek === week.value 
                            ? 'bg-blue-600 text-white' 
                            : `${btnSecondaryBg} ${btnSecondaryText}`
                        } transition-colors`}
                        onClick={() => setSelectedWeek(week.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {week.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedWeek && workoutsByWeek[selectedWeek]?.length > 0 ? (
                    workoutsByWeek[selectedWeek].map((workout, index) => (
                      <motion.div 
                        key={`${workout.id || index}`} 
                        className={`rounded-lg p-5 border ${borderColor} hover:shadow-md transition-shadow`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-medium text-lg mb-2">День {index + 1}: {workout.name || `Тренировка ${index + 1}`}</h4>
                        <p className="text-sm mb-4">{workout.notes || 'Нет дополнительных заметок'}</p>
                        
                        <div className="space-y-3">
                          {workout.exercises.map((exercise, exIndex) => (
                            <motion.div 
                              key={exercise.id}
                              className={`p-3 ${infoBlockBg} rounded-md border border-gray-200 hover:shadow-sm transition-shadow`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: 0.2 + exIndex * 0.05 }}
                            >
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <h5 className="font-medium">{exercise.exercise?.name}</h5>
                                  <p className="text-sm text-gray-500">
                                    {exercise.sets} {exercise.sets === 1 ? 'подход' : exercise.sets > 1 && exercise.sets < 5 ? 'подхода' : 'подходов'} x {exercise.reps || '-'} {exercise.reps === 1 ? 'повторение' : exercise.reps && exercise.reps > 1 && exercise.reps < 5 ? 'повторения' : 'повторений'}
                                    {exercise.weight && ` • ${exercise.weight} кг`}
                                  </p>
                                </div>
                                {exercise.rest && (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{exercise.rest} сек отдыха</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedWeek ? 
                        <p>На эту неделю нет запланированных тренировок</p> :
                        <p>Выберите неделю, чтобы увидеть тренировки</p>
                      }
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 