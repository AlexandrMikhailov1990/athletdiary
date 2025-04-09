import { Exercise } from '../models/Exercise';
import { useState } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: () => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const [imageError, setImageError] = useState(false);

  const getExerciseTypeLabel = (type: 'reps' | 'timed'): string => {
    return type === 'reps' ? 'Повторения' : 'Время';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
      role="article"
      aria-label={`Карточка упражнения: ${exercise.name}`}
    >
      <div className="aspect-video bg-gray-100 relative">
        {exercise.image && !imageError ? (
          <img 
            src={exercise.image} 
            alt={exercise.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg 
              className="w-16 h-16"
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
          className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm"
          role="status"
          aria-label={`Тип упражнения: ${getExerciseTypeLabel(exercise.type)}`}
        >
          {getExerciseTypeLabel(exercise.type)}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 line-clamp-1">{exercise.name}</h3>
        
        <div className="mb-4 flex-grow">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium mr-1">Подходы:</span> {exercise.sets}
            </div>
            {exercise.type === 'reps' ? (
              <>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-1">Повторения:</span> {exercise.reps}
                </div>
                {exercise.weight && (
                  <div className="flex items-center text-sm text-gray-600 col-span-2">
                    <span className="font-medium mr-1">Вес:</span> {exercise.weight} кг
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-1">Длительность:</span> {exercise.duration}с
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Отдых: {exercise.restTime}с
          </div>
          
          <button
            onClick={onSelect}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
            aria-label={`Подробнее о упражнении ${exercise.name}`}
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
} 