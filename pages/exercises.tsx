import { useState, useEffect } from 'react';
import { Exercise, SAMPLE_EXERCISES } from '../models/Exercise';
import ExerciseCard from '../components/ExerciseCard';

const ITEMS_PER_PAGE = 9;

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>(SAMPLE_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'reps' | 'timed'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Загрузка сохраненных фильтров при монтировании компонента
  useEffect(() => {
    const savedFilters = localStorage.getItem('exerciseFilters');
    if (savedFilters) {
      const { searchTerm, muscleGroup, difficulty } = JSON.parse(savedFilters);
      setSearchTerm(searchTerm);
      setSelectedMuscleGroup(muscleGroup);
      setSelectedDifficulty(difficulty);
    }
  }, []);

  // Сохранение фильтров при их изменении
  useEffect(() => {
    localStorage.setItem('exerciseFilters', JSON.stringify({
      searchTerm,
      muscleGroup: selectedMuscleGroup,
      difficulty: selectedDifficulty
    }));
  }, [searchTerm, selectedMuscleGroup, selectedDifficulty]);

  // Получение уникальных групп мышц из всех упражнений
  const muscleGroups = Array.from(
    new Set(
      SAMPLE_EXERCISES.flatMap(exercise => exercise.muscleGroups)
    )
  ).sort();

  // Фильтрация упражнений
  const filteredExercises = SAMPLE_EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || exercise.type === selectedType;
    
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Упражнения</h1>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Поиск упражнений
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Название упражнения..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Тип упражнения
              </label>
              <select
                id="type"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'reps' | 'timed')}
              >
                <option value="all">Все типы</option>
                <option value="reps">Повторения</option>
                <option value="timed">Время</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
            />
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