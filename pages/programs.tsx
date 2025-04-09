import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { SAMPLE_ACTIVE_PROGRAM, ActiveProgram } from '../models/ActiveProgram';
import { Exercise, translateMuscleGroup } from '../models/Exercise';

export default function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Функция для загрузки программ из localStorage
  const loadPrograms = () => {
    // Получаем пользовательские программы
    const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
    console.log('Загруженные пользовательские программы:', savedPrograms);
    
    // Получаем ID удаленных стандартных программ
    const deletedSampleProgramIds = JSON.parse(localStorage.getItem('deletedSamplePrograms') || '[]');
    console.log('ID удаленных стандартных программ:', deletedSampleProgramIds);
    
    // Фильтруем стандартные программы, исключая удаленные
    const filteredSamplePrograms = SAMPLE_PROGRAMS.filter(
      program => !deletedSampleProgramIds.includes(program.id)
    );
    console.log('Отфильтрованные стандартные программы:', filteredSamplePrograms);
    
    // Объединяем отфильтрованные стандартные программы с пользовательскими
    const allPrograms = [...filteredSamplePrograms, ...savedPrograms];
    console.log('Все программы для отображения:', allPrograms);
    
    setPrograms(allPrograms);
    setIsLoaded(true);
  };

  // Загрузка программ при монтировании компонента
  useEffect(() => {
    loadPrograms();
  }, []);

  // Обновление списка программ при фокусе на окне
  useEffect(() => {
    const handleFocus = () => {
      console.log('Окно получило фокус, обновляем список программ');
      loadPrograms();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Обновление списка программ при возвращении на страницу
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/programs' && isLoaded) {
        console.log('Вернулись на страницу программ, обновляем список');
        loadPrograms();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, isLoaded]);

  // Фильтрация программ
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === '' || program.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  // Функция для запуска программы
  const startProgram = (program: Program) => {
    // Создаем новую активную программу
    const newActiveProgram: ActiveProgram = {
      programId: program.id,
      userId: 'user', // В реальном приложении здесь будет ID текущего пользователя
      startDate: new Date().toISOString(),
      currentWeek: 1,
      currentDay: 1,
      completedWorkouts: []
    };
    
    // Сохраняем активную программу в localStorage
    localStorage.setItem('activeProgram', JSON.stringify(newActiveProgram));
    
    // Сохраняем полную информацию о программе
    const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
    activePrograms.push({
      ...newActiveProgram,
      program: program // Сохраняем полную информацию о программе
    });
    localStorage.setItem('activePrograms', JSON.stringify(activePrograms));
    
    // Перенаправляем на страницу активной программы
    router.push('/active-program');
  };

  // Функция для просмотра деталей программы
  const viewProgramDetails = (programId: string) => {
    router.push(`/programs/${programId}`);
  };

  // Функция для удаления программы
  const deleteProgram = (programId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту программу?')) {
      return;
    }

    // Проверяем, является ли программа примером
    const isSample = SAMPLE_PROGRAMS.some(p => p.id === programId);
    
    if (isSample) {
      // Если это пример, запоминаем его ID в списке удаленных
      const deletedSamplePrograms = JSON.parse(localStorage.getItem('deletedSamplePrograms') || '[]');
      deletedSamplePrograms.push(programId);
      localStorage.setItem('deletedSamplePrograms', JSON.stringify(deletedSamplePrograms));
      
      // Удаляем из состояния
      setPrograms(prevPrograms => prevPrograms.filter(p => p.id !== programId));
    } else {
      // Если это пользовательская программа, удаляем из localStorage
      const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
      const updatedPrograms = savedPrograms.filter((p: Program) => p.id !== programId);
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      
      // Обновляем состояние
      // Получаем ID удаленных стандартных программ
      const deletedSampleProgramIds = JSON.parse(localStorage.getItem('deletedSamplePrograms') || '[]');
      
      // Фильтруем стандартные программы, исключая удаленные
      const filteredSamplePrograms = SAMPLE_PROGRAMS.filter(
        program => !deletedSampleProgramIds.includes(program.id)
      );
      
      setPrograms([...filteredSamplePrograms, ...updatedPrograms]);
    }

    // Если это активная программа, удаляем её
    const activeProgram = JSON.parse(localStorage.getItem('activeProgram') || 'null');
    if (activeProgram && activeProgram.programId === programId) {
      localStorage.removeItem('activeProgram');
    }

    // Удаляем из activePrograms
    const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
    const updatedActivePrograms = activePrograms.filter((p: any) => p.programId !== programId);
    localStorage.setItem('activePrograms', JSON.stringify(updatedActivePrograms));
  };

  // Функция для подсчета общего количества упражнений в программе
  const countExercisesInProgram = (program: Program): number => {
    let totalExercises = 0;
    program.workouts.forEach(workout => {
      totalExercises += workout.exercises.length;
    });
    return totalExercises;
  };

  // Функция для получения списка уникальных мышечных групп в программе
  const getMuscleGroupsInProgram = (program: Program): string[] => {
    const muscleGroups = new Set<string>();
    
    program.workouts.forEach(workout => {
      workout.exercises.forEach(workoutExercise => {
        workoutExercise.exercise.muscleGroups.forEach((muscle: string) => {
          muscleGroups.add(muscle);
        });
      });
    });
    
    return Array.from(muscleGroups);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Программы тренировок</h1>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск программ
              </label>
              <input
                type="text"
                id="search"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Название или описание..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Уровень подготовки
              </label>
              <select
                id="level"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Все уровни</option>
                <option value="beginner">Новичок</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Кнопка создания программы */}
        <div className="mb-8 flex justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-lg transition-colors duration-200 font-medium"
            onClick={() => {
              console.log('localStorage.programs:', JSON.parse(localStorage.getItem('programs') || '[]'));
              console.log('localStorage.activePrograms:', JSON.parse(localStorage.getItem('activePrograms') || '[]'));
              console.log('localStorage.activeProgram:', JSON.parse(localStorage.getItem('activeProgram') || 'null'));
              console.log('localStorage.deletedSamplePrograms:', JSON.parse(localStorage.getItem('deletedSamplePrograms') || '[]'));
              loadPrograms();
            }}
          >
            Обновить список
          </button>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 rounded-lg transition-colors duration-200 font-medium"
            onClick={() => router.push('/programs/create')}
          >
            Создать новую программу
          </button>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">{program.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {program.level === 'beginner' && 'Новичок'}
                      {program.level === 'intermediate' && 'Средний'}
                      {program.level === 'advanced' && 'Продвинутый'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {program.duration} недель
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {program.workoutsPerWeek} тр/нед
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      {countExercisesInProgram(program)} упражнений
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 h-auto overflow-hidden">
                    {program.description}
                  </p>
                  
                  {/* Добавляем информацию о мышечных группах */}
                  <div className="mt-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Целевые мышцы:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {getMuscleGroupsInProgram(program).map(muscle => (
                        <span key={muscle} className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          {translateMuscleGroup(muscle)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Добавляем краткую информацию о тренировках */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Тренировки:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {program.workouts.map((workout, index) => (
                        <div key={index} className="text-xs border border-gray-200 rounded p-2">
                          <div className="font-medium">{workout.name}</div>
                          <div className="text-gray-500 mt-1">
                            {workout.exercises.length} упражнений
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-auto pt-4">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => viewProgramDetails(program.id)}
                  >
                    Подробнее
                  </button>
                  
                  <button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => startProgram(program)}
                  >
                    Начать
                  </button>

                  {/* Добавляем кнопку удаления для всех программ */}
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => deleteProgram(program.id)}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Программы не найдены. Попробуйте изменить критерии поиска или создайте новую программу.</p>
          </div>
        )}

        {/* Кнопка сброса данных */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (confirm('Вы уверены, что хотите сбросить все данные приложения? Это действие нельзя отменить.')) {
                localStorage.clear();
                alert('Все данные сброшены. Страница будет перезагружена.');
                window.location.reload();
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            Сбросить все данные
          </button>
        </div>
      </div>
    </div>
  );
} 