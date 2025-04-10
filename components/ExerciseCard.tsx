import { Exercise } from '../models/Exercise';
import { useState } from 'react';
import { translateMuscleGroup, translateDifficulty } from '../models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: () => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const getExerciseTypeLabel = (type: 'reps' | 'timed'): string => {
    return type === 'reps' ? 'Повторения' : 'Время';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
      role="article"
      aria-label={`Карточка упражнения: ${exercise.name}`}
      onClick={onSelect}
    >
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-blue-800 mb-3 line-clamp-1">{exercise.name}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {exercise.muscleGroups.map((muscle, idx) => (
              <span key={idx} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {translateMuscleGroup(muscle)}
              </span>
            ))}
          </div>
          
          <div className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded inline-block mb-3">
            {translateDifficulty(exercise.difficulty)}
          </div>
        </div>
        
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
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывал onClick родительского div
              if (onSelect) onSelect();
            }}
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