import { useState } from 'react';
import { SAMPLE_EXERCISES, Exercise } from '../models/Exercise';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>(SAMPLE_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Получение уникальных групп мышц из всех упражнений
  const muscleGroups = Array.from(
    new Set(
      SAMPLE_EXERCISES.flatMap(exercise => exercise.muscleGroups)
    )
  ).sort();

  // Фильтрация упражнений
  const filteredExercises = SAMPLE_EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMuscleGroup = selectedMuscleGroup === '' || 
                              exercise.muscleGroups.includes(selectedMuscleGroup);
    
    const matchesDifficulty = selectedDifficulty === '' || 
                             exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesMuscleGroup && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Каталог упражнений</h1>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Поиск упражнений
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Название или описание..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-1">
                Группа мышц
              </label>
              <select
                id="muscleGroup"
                className="w-full p-2 border border-gray-300 rounded"
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
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Уровень сложности
              </label>
              <select
                id="difficulty"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">Все уровни</option>
                <option value="beginner">Новичок</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {exercise.imageUrl ? (
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Изображение недоступно
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{exercise.name}</h3>
                
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mr-2 mb-2">
                    {exercise.difficulty === 'beginner' && 'Новичок'}
                    {exercise.difficulty === 'intermediate' && 'Средний'}
                    {exercise.difficulty === 'advanced' && 'Продвинутый'}
                  </span>
                  
                  {exercise.muscleGroups.map(group => (
                    <span 
                      key={group} 
                      className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded mr-2 mb-2"
                    >
                      {group}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4">{exercise.description}</p>
                
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Упражнения не найдены. Попробуйте изменить критерии поиска.</p>
          </div>
        )}
      </div>
    </div>
  );
} 