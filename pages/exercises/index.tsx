import { Exercise, NORMALIZED_SAMPLE_EXERCISES, translateMuscleGroup } from '../../models/Exercise';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseDetails from '../../components/ExerciseDetails';
import ExerciseFilter from '../../components/ExerciseFilter';
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
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
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
      const { searchTerm, muscleGroup, difficulty, equipment } = JSON.parse(savedFilters);
      setSearchTerm(searchTerm);
      setSelectedMuscleGroup(muscleGroup);
      setSelectedType(difficulty);
      setSelectedEquipment(equipment || []);
    }
  }, []);

  // Сохранение фильтров при их изменении
  useEffect(() => {
    localStorage.setItem('exerciseFilters', JSON.stringify({
      searchTerm,
      muscleGroup: selectedMuscleGroup,
      difficulty: selectedType,
      equipment: selectedEquipment
    }));
  }, [searchTerm, selectedMuscleGroup, selectedType, selectedEquipment]);

  // Фильтрация упражнений
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      // Фильтр по поисковому запросу
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Фильтр по группе мышц
      const matchesMuscleGroup = selectedMuscleGroup === '' || 
                               exercise.muscleGroups.includes(selectedMuscleGroup);
      // Фильтр по инвентарю
      const matchesEquipment = selectedEquipment.length === 0 || 
                              selectedEquipment.every(eq => exercise.equipment?.includes(eq));
      return matchesSearch && matchesMuscleGroup && matchesEquipment;
    });
  }, [exercises, searchTerm, selectedMuscleGroup, selectedEquipment]);

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
          <h1 className="text-2xl font-bold text-gray-900">Упражнения</h1>
          <div className="flex gap-2">
            <button
              onClick={handleCreateExercise}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Добавить упражнение
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={clearLocalStorageAndResetExercises}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Сбросить все
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск упражнений..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все группы мышц</option>
            {muscleGroups.map(group => (
              <option key={group} value={group}>
                {translateMuscleGroup(group)}
              </option>
            ))}
          </select>

          <ExerciseFilter
            exercises={exercises}
            selectedEquipment={selectedEquipment}
            onFilterChange={setSelectedEquipment}
          />
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={() => handleEditExercise(exercise.id)}
              onDelete={() => handleDeleteExercise(exercise.id)}
              onClick={() => setSelectedExercise(exercise)}
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
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Модальное окно с деталями упражнения */}
        {selectedExercise && (
          <ExerciseDetails
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </div>
    </div>
  );
} 