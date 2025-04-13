import { Exercise } from '../models/Exercise';
import { useState } from 'react';
import { translateMuscleGroup, translateDifficulty } from '../models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: () => void;
  onMoreInfo?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
}

export default function ExerciseCard({ 
  exercise, 
  onSelect, 
  onMoreInfo, 
  onEdit, 
  onDelete, 
  selected = false 
}: ExerciseCardProps) {
  const getExerciseTypeLabel = (type: 'reps' | 'timed'): string => {
    return type === 'reps' ? 'Повторения' : 'Время';
  };

  // Используем более удобный для кнопок метод
  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoreInfo) onMoreInfo();
    else if (onSelect) onSelect(); // Для обратной совместимости
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 ${onSelect || onMoreInfo ? 'cursor-pointer' : ''} ${selected ? 'ring-2 ring-blue-500' : ''}`}
      role="article"
      aria-label={`Карточка упражнения: ${exercise.name}`}
      onClick={onSelect || onMoreInfo ? (onSelect ? onSelect : onMoreInfo) : undefined}
    >
      <div className="relative">
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 z-10">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200"
                title="Редактировать"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200"
                title="Удалить"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-base sm:text-xl font-semibold text-blue-800 mb-2 sm:mb-3 line-clamp-1">{exercise.name}</h3>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2">{exercise.description}</p>
        
        <div className="mb-2 sm:mb-4">
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {exercise.muscleGroups.map((muscle, idx) => (
              <span key={idx} className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                {translateMuscleGroup(muscle)}
              </span>
            ))}
          </div>
          
          <div className="bg-blue-50 text-blue-800 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded inline-block mb-2 sm:mb-3">
            {translateDifficulty(exercise.difficulty)}
          </div>
        </div>
        
        <div className="mb-2 sm:mb-4 flex-grow">
          <div className="grid grid-cols-2 gap-y-1 sm:gap-y-3 gap-x-2 sm:gap-x-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <span className="font-medium mr-1">Подходы:</span> {exercise.sets}
            </div>
            {exercise.type === 'reps' ? (
              <>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium mr-1">Повторения:</span> {exercise.reps}
                </div>
                {exercise.weight && exercise.weight > 0 && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 col-span-2">
                    <span className="font-medium mr-1">Вес:</span> {exercise.weight} кг
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <span className="font-medium mr-1">Длительность:</span> {exercise.duration}с
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 sm:pt-4 border-t border-gray-100">
          <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            Отдых: {exercise.restTime}с
          </div>
          
          <div className="flex items-center justify-between w-full sm:justify-end">
            <div className="text-xs text-gray-500 sm:hidden">
              Отдых: {exercise.restTime}с
            </div>
            <button
              onClick={handleMoreInfo}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
              aria-label={`Подробнее о упражнении ${exercise.name}`}
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 