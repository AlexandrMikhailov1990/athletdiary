import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Program, getPrograms, SAMPLE_PROGRAMS } from '../models/Program';
import { SAMPLE_ACTIVE_PROGRAM, ActiveProgram } from '../models/ActiveProgram';
import { Exercise, translateMuscleGroup } from '../models/Exercise';
import ContinueWorkoutButton from '../components/ContinueWorkoutButton';
import ProgramCard from '../components/ProgramCard';

export default function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка программ
  const loadPrograms = () => {
    try {
      // Получаем программы из localStorage
      const savedPrograms = getPrograms();
      
      // Получаем ID удаленных стандартных программ
      const deletedSampleProgramIds = JSON.parse(localStorage.getItem('deletedSamplePrograms') || '[]');
      
      // Фильтруем стандартные программы, исключая удаленные
      const filteredSamplePrograms = SAMPLE_PROGRAMS.filter(
        program => !deletedSampleProgramIds.includes(program.id)
      );
      
      // Объединяем пользовательские и доступные стандартные программы
      setPrograms([...filteredSamplePrograms, ...savedPrograms]);
      setIsLoaded(true);
    } catch (error) {
      console.error('Ошибка при загрузке программ:', error);
      setIsLoaded(true);
    }
  };

  // Загрузка программ при монтировании компонента
  useEffect(() => {
    loadPrograms();

    // Обновление при фокусе на окне (если пользователь вернулся с другой вкладки)
    const handleFocus = () => {
      loadPrograms();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Добавляем обработчик изменения маршрута для обновления программ
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/programs' && isLoaded) {
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
    
    return matchesSearch;
  });

  // Функция для запуска программы
  const startProgram = (program: Program) => {
    try {
      // Подгружаем дополнительные наборы упражнений, если они еще не загружены
      // Так мы гарантируем, что все упражнения доступны
      import('../models/HomeExercises').then(module => {
        if (typeof module.addHomeExercisesToUserExercises === 'function') {
          module.addHomeExercisesToUserExercises();
        }
      }).catch(error => {
        console.error('Ошибка при загрузке базовых упражнений:', error);
      });
      
      import('../models/HomeExercisesExtended').then(module => {
        if (typeof module.addExtendedHomeExercises === 'function') {
          module.addExtendedHomeExercises();
        }
      }).catch(error => {
        console.error('Ошибка при загрузке расширенных упражнений:', error);
      });

      // Убедимся, что у программы есть свойство exercises
      const programWithExercises = {
        ...program,
        // Если exercises отсутствует, берем упражнения из всех тренировок
        exercises: program.exercises || (
          program.workouts && program.workouts.length > 0 
            ? program.workouts.flatMap(workout => workout.exercises)
            : []
        )
      };

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
        program: programWithExercises // Сохраняем обновленную программу с exercises
      });
      localStorage.setItem('activePrograms', JSON.stringify(activePrograms));
      
      // Перенаправляем на страницу активной программы
      router.push('/active-program');
    } catch (error) {
      console.error('Ошибка при запуске программы:', error);
      alert('Произошла ошибка при запуске программы. Пожалуйста, попробуйте еще раз.');
    }
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
        workoutExercise.exercise?.muscleGroups?.forEach((muscle: string) => {
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
        </div>
        
        {/* Кнопка создания программы */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex gap-3">
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-lg transition-colors duration-200 font-medium text-center"
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
            <ContinueWorkoutButton className="h-12" />
          </div>
          <button 
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white h-12 px-6 rounded-lg transition-colors duration-200 font-medium text-center"
            onClick={() => router.push('/programs/create')}
          >
            Создать новую программу
          </button>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              onStart={startProgram}
              onEdit={() => router.push(`/programs/edit/${program.id}`)}
              onDelete={deleteProgram}
            />
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
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm transition-colors duration-200 w-full sm:w-auto"
          >
            Сбросить все данные
          </button>
        </div>
      </div>
    </div>
  );
} 