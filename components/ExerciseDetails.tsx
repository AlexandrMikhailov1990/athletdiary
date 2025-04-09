import { Exercise } from '../models/Exercise';
import { useState } from 'react';

interface ExerciseDetailsProps {
  exercise: Exercise;
  onClose: () => void;
  onAddToWorkout?: () => void;
}

export default function ExerciseDetails({ exercise, onClose, onAddToWorkout }: ExerciseDetailsProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

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

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-90vh overflow-auto"
        role="document"
      >
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 id="exercise-title" className="text-xl font-bold">{exercise.name}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Закрыть"
          >
            <svg 
              className="w-6 h-6" 
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
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Основная информация */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-200 h-64 rounded-lg mb-4">
                {exercise.imageUrl && !imageError ? (
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover rounded-lg"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
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
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Основная информация</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Сложность</p>
                    <p className="font-medium">{getDifficultyLabel(exercise.difficulty)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Оборудование</p>
                    <p className="font-medium">
                      {exercise.equipment.length > 0 
                        ? exercise.equipment.join(', ')
                        : 'Не требуется'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Задействованные мышцы</h3>
                <div 
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Список задействованных мышц"
                >
                  {exercise.muscleGroups.map(group => (
                    <span 
                      key={group} 
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      role="listitem"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Описание</h3>
              <p className="text-gray-600 mb-6">{exercise.description}</p>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Техника выполнения</h3>
              <ol 
                className="list-decimal list-inside space-y-2 mb-6"
                role="list"
                aria-label="Пошаговая инструкция выполнения упражнения"
              >
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-600" role="listitem">{instruction}</li>
                ))}
              </ol>

              {exercise.videoUrl && !videoError && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Видео</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <a 
                      href={exercise.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      aria-label="Открыть видео-инструкцию в новом окне"
                    >
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Смотреть видео-инструкцию
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Закрыть окно с деталями упражнения"
            >
              Закрыть
            </button>
            
            {onAddToWorkout && (
              <button
                onClick={onAddToWorkout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label={`Добавить упражнение "${exercise.name}" в тренировку`}
              >
                Добавить в тренировку
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 