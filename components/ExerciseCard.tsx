import { Exercise } from '../models/Exercise';
import { useState } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: () => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const [imageError, setImageError] = useState(false);

  // Функция для отображения уровня сложности на русском языке
  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'Новичок';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return difficulty;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      role="article"
      aria-label={`Карточка упражнения: ${exercise.name}`}
    >
      <div className="h-48 bg-gray-200 relative">
        {exercise.imageUrl && !imageError ? (
          <img 
            src={exercise.imageUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg 
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        )}
        
        <div 
          className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded"
          role="status"
          aria-label={`Уровень сложности: ${getDifficultyLabel(exercise.difficulty)}`}
        >
          {getDifficultyLabel(exercise.difficulty)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">{exercise.name}</h3>
        
        <div className="mb-3 flex flex-wrap" role="list" aria-label="Задействованные мышцы">
          {exercise.muscleGroups.map(group => (
            <span 
              key={group} 
              className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded mr-2 mb-2"
              role="listitem"
            >
              {group}
            </span>
          ))}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {exercise.equipment.length > 0 ? (
              <span>Оборудование: {exercise.equipment.join(', ')}</span>
            ) : (
              <span>Без оборудования</span>
            )}
          </div>
          
          <button
            onClick={onSelect}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
            aria-label={`Подробнее о упражнении ${exercise.name}`}
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
} 