import { Exercise, NORMALIZED_SAMPLE_EXERCISES, translateMuscleGroup } from '../../models/Exercise';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseDetails from '../../components/ExerciseDetails';
import { useRouter } from 'next/router';
import { addHomeExercisesToUserExercises } from '../../models/HomeExercises';
import { addExtendedHomeExercises } from '../../models/HomeExercisesExtended';
import { pullupExercises } from '../../data/pullup-exercises';
import { kettlebellExercises } from '../../data/kettlebell-exercises';

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
  const [allExercisesLoaded, setAllExercisesLoaded] = useState(false);

  // Функция для добавления всех наборов упражнений
  const addAllExerciseSets = useCallback(async () => {
    try {
      // Добавляем базовые упражнения
      addHomeExercisesToUserExercises();
      
      // Добавляем расширенный набор упражнений
      addExtendedHomeExercises();
      
      // Добавляем упражнения с подтягиваниями и гирями напрямую
      try {
        // Получаем текущие упражнения
        const existingExercises = JSON.parse(localStorage.getItem('userExercises') || '[]');
        
        // Проверяем, есть ли уже упражнения с такими ID
        const existingIds = new Set(existingExercises.map((ex: any) => ex.id));
        
        // Фильтруем только новые упражнения с подтягиваниями
        const newPullupExercises = pullupExercises.filter((ex: Exercise) => !existingIds.has(ex.id));
        
        // Фильтруем только новые упражнения с гирями
        const newKettlebellExercises = kettlebellExercises.filter((ex: Exercise) => !existingIds.has(ex.id));
        
        // Объединяем все новые упражнения
        const allNewExercises = [...newPullupExercises, ...newKettlebellExercises];
        
        if (allNewExercises.length > 0) {
          // Добавляем новые упражнения
          const updatedExercises = [...existingExercises, ...allNewExercises];
          localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
          console.log(`Добавлено ${allNewExercises.length} новых упражнений (подтягивания и гири).`);
        } else {
          console.log('Все упражнения с подтягиваниями и гирями уже добавлены.');
        }
      } catch (error) {
        console.error('Ошибка при добавлении упражнений:', error);
      }
      
      setAllExercisesLoaded(true);
    } catch (error) {
      console.error('Ошибка при загрузке всех наборов упражнений:', error);
    }
  }, []);

  // Загрузка упражнений из localStorage - выносим как переиспользуемую функцию
  const loadExercises = useCallback(() => {
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
  }, []);

  // Загрузка всех упражнений при первом рендере
  useEffect(() => {
    const initExercises = async () => {
      setIsLoading(true);
      await addAllExerciseSets();
      loadExercises();
    };
    
    initExercises();
  }, [addAllExerciseSets, loadExercises]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-800">Упражнения</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                addAllExerciseSets().then(() => {
                  loadExercises();
                  alert('Все наборы упражнений успешно добавлены');
                });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-sm sm:text-base rounded-lg transition-colors duration-200 text-center"
            >
              Обновить все упражнения
            </button>
            <button
              onClick={handleCreateExercise}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm sm:text-base rounded-lg transition-colors duration-200 text-center"
            >
              Создать упражнение
            </button>
          </div>
        </div>
        
        {/* Фильтры и поиск */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск упражнений
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Название или описание..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Группа мышц
              </label>
              <div className="relative">
                <select
                  id="muscleGroup"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none pr-10"
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                >
                  <option value="">Все группы мышц</option>
                  {muscleGroups.map(group => (
                    <option key={group} value={group}>
                      {translateMuscleGroup(group)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Сложность
              </label>
              <div className="relative">
                <select
                  id="difficulty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none pr-10"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Любая сложность</option>
                  <option value="beginner">Начинающий</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onMoreInfo={() => setSelectedExercise(exercise)}
              onEdit={() => handleEditExercise(exercise.id)}
              onDelete={() => handleDeleteExercise(exercise.id)}
            />
          ))}
        </div>
        
        {/* Сообщение, если нет результатов */}
        {filteredExercises.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
            <p className="text-gray-500 text-lg mb-4">
              Упражнений не найдено. Попробуйте изменить параметры поиска или создайте новое упражнение.
            </p>
            <button
              onClick={handleCreateExercise}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm sm:text-base rounded-lg transition-colors duration-200"
            >
              Создать упражнение
            </button>
          </div>
        )}
        
        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-700'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNumber)}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
                      currentPage === pageNumber
                        ? 'z-10 bg-blue-600 text-white focus:z-20 border-blue-600'
                        : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-700'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
        
        {/* Модальное окно с деталями упражнения */}
        {selectedExercise && (
          <ExerciseDetails
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onEdit={() => {
              setSelectedExercise(null);
              handleEditExercise(selectedExercise.id);
            }}
          />
        )}
        
        {/* Кнопка сброса для отладки */}
        <div className="mt-16 text-center">
          <button
            onClick={clearLocalStorageAndResetExercises}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            Сбросить все упражнения
          </button>
        </div>
      </div>
    </div>
  );
} 