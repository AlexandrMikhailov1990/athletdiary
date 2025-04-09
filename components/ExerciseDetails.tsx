import { Exercise } from '../models/Exercise';
import { useState } from 'react';

interface ExerciseDetailsProps {
  exercise: Exercise;
  onClose: () => void;
  onAddToWorkout?: () => void;
}

const getExerciseTypeLabel = (type: 'reps' | 'timed'): string => {
  return type === 'reps' ? 'Повторения' : 'Время';
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default function ExerciseDetails({ exercise, onClose, onAddToWorkout }: ExerciseDetailsProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{exercise.name}</h2>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Закрыть"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              {exercise.image && !imageError ? (
                <div className="bg-gray-200 h-64 rounded-lg mb-4">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover rounded-lg"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Изображение недоступно</span>
                </div>
              )}

              {exercise.description && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-gray-700">{exercise.description}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Тип упражнения</h3>
                  <p className="font-medium">{getExerciseTypeLabel(exercise.type)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Целевые мышцы</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.map((muscle, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Рекомендации</h3>
                  <p className="font-medium">
                    {exercise.type === 'reps' 
                      ? `${exercise.sets} подхода по ${exercise.reps} повторений`
                      : `${exercise.sets} подхода по ${exercise.duration} секунд`
                    }
                    {exercise.type === 'reps' && exercise.weight && ` с весом ${exercise.weight} кг`}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Отдых между подходами</h3>
                  <p className="font-medium">{exercise.restTime} секунд</p>
                </div>
              </div>

              {exercise.equipment && exercise.equipment.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Необходимое оборудование</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipment.map((item, index) => (
                      <span key={index} className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {onAddToWorkout && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onAddToWorkout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Добавить в тренировку
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 