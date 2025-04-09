import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../../models/Exercise';
import { useState, useEffect, useMemo } from 'react';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseDetails from '../../components/ExerciseDetails';
import { useRouter } from 'next/router';

const ITEMS_PER_PAGE = 9;

export default function Exercises() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>(NORMALIZED_SAMPLE_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка упражнений из localStorage
  useEffect(() => {
    const loadExercises = () => {
      setIsLoading(true);
      try {
        const savedExercises = localStorage.getItem('userExercises');
        const parsedExercises = savedExercises 
          ? JSON.parse(savedExercises) 
          : NORMALIZED_SAMPLE_EXERCISES;
        
        setExercises(parsedExercises);
      } catch (error) {
        console.error('Ошибка при загрузке упражнений:', error);
        setExercises(NORMALIZED_SAMPLE_EXERCISES);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExercises();
  }, []);

  // Загрузка сохраненных фильтров при монтировании компонента
  useEffect(() => {
    const savedFilters = localStorage.getItem('exerciseFilters');
    if (savedFilters) {
      const { searchTerm, muscleGroup, difficulty } = JSON.parse(savedFilters);
      setSearchTerm(searchTerm);
      setSelectedMuscleGroup(muscleGroup);
      setSelectedType(difficulty);
    }
  }, []);

  // Сохранение фильтров при их изменении
  useEffect(() => {
    localStorage.setItem('exerciseFilters', JSON.stringify({
      searchTerm,
      muscleGroup: selectedMuscleGroup,
      difficulty: selectedType
    }));
  }, [searchTerm, selectedMuscleGroup, selectedType]);

  // Фильтрация упражнений
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      // Фильтр по поисковому запросу
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фильтр по группе мышц
      const matchesMuscleGroup = selectedMuscleGroup === '' || 
                               exercise.muscleGroups.includes(selectedMuscleGroup);
      
      // Фильтр по типу упражнения
      const matchesType = selectedType === '' || exercise.type === selectedType;
      
      return matchesSearch && matchesMuscleGroup && matchesType;
    });
  }, [exercises, searchTerm, selectedMuscleGroup, selectedType]);

  // Получение уникальных групп мышц
  const muscleGroups = useMemo(() => {
    const allMuscleGroups = exercises.flatMap(exercise => exercise.muscleGroups);
    return Array.from(new Set(allMuscleGroups)).sort();
  }, [exercises]);

  // Пагинация
  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Переход к созданию нового упражнения
  const handleCreateExercise = () => {
    router.push('/exercises/manage');
  };

  // Переход к редактированию упражнения
  const handleEditExercise = (exerciseId: string) => {
    router.push(`/exercises/manage?action=edit&id=${exerciseId}`);
  };

  // Удаление упражнения
  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm('Вы уверены, что хотите удалить это упражнение?')) {
      try {
        const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
        localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
        setExercises(updatedExercises);
      } catch (error) {
        console.error('Ошибка при удалении упражнения:', error);
        alert('Не удалось удалить упражнение. Попробуйте еще раз.');
      }
    }
  };

  // Для отладки
  const clearLocalStorageAndResetExercises = () => {
    if (confirm('Вы уверены, что хотите сбросить все упражнения?')) {
      localStorage.removeItem('userExercises');
      setExercises(NORMALIZED_SAMPLE_EXERCISES);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка упражнений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Упражнения</h1>
          <button
            onClick={handleCreateExercise}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            + Добавить упражнение
          </button>
        </div>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск упражнений
              </label>
              <input
                type="text"
                id="search"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Название упражнения..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Группа мышц
              </label>
              <select
                id="muscleGroup"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              >
                <option value="">Все группы мышц</option>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Тип упражнения
              </label>
              <select
                id="type"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Все типы</option>
                <option value="reps">Повторения</option>
                <option value="timed">Время</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExercises.map(exercise => (
            <div key={exercise.id} className="relative">
              <ExerciseCard
                exercise={exercise}
                onSelect={() => handleEditExercise(exercise.id)}
              />
              
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEditExercise(exercise.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200"
                  title="Редактировать"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200"
                  title="Удалить"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Пагинация">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="Предыдущая страница"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label={`Страница ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="Следующая страница"
              >
                →
              </button>
            </nav>
          </div>
        )}
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">
              Упражнения не найдены. Попробуйте изменить критерии поиска.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 