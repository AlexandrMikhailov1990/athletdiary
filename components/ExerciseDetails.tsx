import { Exercise } from '../models/Exercise';
import { translateMuscleGroup, translateDifficulty } from '../models/Exercise';

interface ExerciseDetailsProps {
  exercise: Exercise;
  onClose: () => void;
  onAddToWorkout?: () => void;
  onEdit?: () => void;
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

export default function ExerciseDetails({ exercise, onClose, onAddToWorkout, onEdit }: ExerciseDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-2 py-4 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full max-w-[95%] max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-blue-600 text-white py-3 px-4 flex justify-between items-center">
            <h3 className="text-xl font-bold leading-6 pr-8" id="modal-title">
              {exercise.name}
            </h3>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-white hover:bg-blue-700 transition-colors focus:outline-none"
              aria-label="Закрыть"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div>
              <div className="w-full">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Описание:</h4>
                  <p className="text-gray-600 text-sm sm:text-base">{exercise.description || 'Описание отсутствует'}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Целевые мышцы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscleGroups && exercise.muscleGroups.length > 0 ? (
                        exercise.muscleGroups.map((muscle, idx) => (
                          <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                            {translateMuscleGroup(muscle)}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Не указаны</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Сложность:</h4>
                    <span className="inline-block bg-blue-50 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                      {translateDifficulty(exercise.difficulty)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Параметры:</h4>
                    <ul className="text-gray-600 text-sm sm:text-base">
                      <li className="mb-1">Подходы: <span className="font-semibold">{exercise.sets}</span></li>
                      {exercise.type === 'reps' ? (
                        <li className="mb-1">Повторения: <span className="font-semibold">{exercise.reps}</span></li>
                      ) : (
                        <li className="mb-1">Длительность: <span className="font-semibold">{exercise.duration} сек</span></li>
                      )}
                      <li className="mb-1">Отдых: <span className="font-semibold">{exercise.restTime} сек</span></li>
                      {exercise.weight && (
                        <li className="mb-1">Вес: <span className="font-semibold">{exercise.weight} кг</span></li>
                      )}
                    </ul>
                  </div>
                  
                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Оборудование:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercise.equipment.map((item, idx) => (
                          <span key={idx} className="inline-block bg-gray-100 text-gray-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {exercise.recommendations && exercise.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Рекомендации:</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm sm:text-base">
                      {exercise.recommendations.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row-reverse sm:gap-2">
            {onAddToWorkout && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 sm:py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onAddToWorkout}
              >
                Добавить в тренировку
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                className="w-full mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 sm:py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onEdit}
              >
                Редактировать
              </button>
            )}
            <button
              type="button"
              className="w-full mt-2 sm:mt-0 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 sm:py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 