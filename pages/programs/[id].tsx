import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import type { Program, Workout, WorkoutExercise } from '@/models/Program';
import type { WorkoutRecord } from '@/models/WorkoutHistory';
import { translateMuscleGroup } from '@/models/Exercise';

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgramData = useCallback(async () => {
    if (!id) return;

    try {
      // Загружаем программу
      const programs = JSON.parse(localStorage.getItem('programs') || '[]');
      const samplePrograms = JSON.parse(localStorage.getItem('samplePrograms') || '[]');
      const foundProgram = [...programs, ...samplePrograms].find(p => p.id === id);
      
      if (foundProgram) {
        setProgram(foundProgram);

        // Загружаем историю тренировок
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const programHistory = history.filter((workout: WorkoutRecord) => 
          workout.workoutId && foundProgram.workouts.some((w: Workout) => w.id === workout.workoutId)
        );
        setWorkoutHistory(programHistory);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProgramData();
  }, [loadProgramData]);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Программа не найдена</p>
            <button
              onClick={() => router.push('/programs')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Вернуться к списку программ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Собираем все упражнения из всех тренировок в один список
  const allExercises = program.workouts.reduce<WorkoutExercise[]>((acc, workout) => {
    return [...acc, ...workout.exercises];
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Основная информация о программе */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">{program.name}</h1>
          <p className="text-gray-600 mb-4">{program.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600">Сложность:</span>
              <span className="ml-2 font-medium">{program.level}</span>
            </div>
            <div>
              <span className="text-gray-600">Длительность:</span>
              <span className="ml-2 font-medium">{program.duration} недель</span>
            </div>
            <div>
              <span className="text-gray-600">Тренировок в неделю:</span>
              <span className="ml-2 font-medium">{program.workoutsPerWeek}</span>
            </div>
          </div>
        </div>

        {/* Список упражнений */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-6">Упражнения программы</h2>
          <div className="space-y-4">
            {allExercises.map((exercise: WorkoutExercise, index: number) => (
              <div key={`${exercise.exercise.id}-${index}`} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-800">{exercise.exercise.name}</h3>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {exercise.exercise.type === 'reps' ? 'Силовое' : 'Кардио'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{exercise.exercise.description}</p>
                
                <div className="flex gap-3 flex-wrap mt-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block text-sm">Подходы:</span>
                    <span className="font-medium text-lg">{exercise.sets}</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block text-sm">{exercise.exercise.type === 'reps' ? 'Повторения' : 'Время выполнения'}:</span>
                    {exercise.exercise.type === 'reps' ? (
                      <span className="font-medium text-lg">{exercise.reps}</span>
                    ) : (
                      <span className="font-medium text-lg">{exercise.exercise.duration} сек</span>
                    )}
                  </div>
                  
                  {exercise.exercise.type === 'reps' && exercise.weight && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="text-gray-600 block text-sm">Вес:</span>
                      <span className="font-medium text-lg">{exercise.weight} кг</span>
                    </div>
                  )}
                  
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block text-sm">Отдых:</span>
                    <span className="font-medium text-lg">{exercise.exercise.restTime} сек</span>
                  </div>
                </div>

                {exercise.exercise.muscleGroups && exercise.exercise.muscleGroups.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-600 text-sm">Целевые мышцы:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {exercise.exercise.muscleGroups.map((muscle: string, muscleIndex: number) => (
                        <span
                          key={muscleIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {translateMuscleGroup(muscle)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* История тренировок */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">История тренировок</h2>
          {workoutHistory.length > 0 ? (
            <div className="space-y-4">
              {workoutHistory.map((workout, index) => (
                <div key={`${workout.id}-${index}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{workout.workoutName}</h3>
                    <span className="text-gray-500">{formatDate(workout.date)}</span>
                  </div>
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={`${exercise.exercise.id}-${exIndex}`} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">{exercise.exercise.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {exercise.sets.map((set, setIndex) => (
                            <div key={`${exercise.exercise.id}-${setIndex}`} className="flex items-center gap-2">
                              <span className="text-gray-500">Подход {setIndex + 1}:</span>
                              <span className="font-medium">
                                {set.weight && `${set.weight} кг`}
                                {set.weight && set.reps && ' × '}
                                {set.reps && `${set.reps} повт`}
                                {exercise.exercise.type === 'timed' && `${exercise.exercise.duration} сек`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">История тренировок по этой программе пока пуста</p>
          )}
        </div>
      </div>
    </div>
  );
} 