import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import type { Program, Workout, WorkoutExercise } from '@/models/Program';
import type { WorkoutRecord } from '@/models/WorkoutHistory';
import { translateMuscleGroup } from '@/models/Exercise';

// Расширяем тип Program, чтобы включить exercises
interface ExtendedProgram extends Program {
  exercises: WorkoutExercise[];
}

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [program, setProgram] = useState<ExtendedProgram | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [allExercises, setAllExercises] = useState<WorkoutExercise[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const loadProgramData = useCallback(async () => {
    if (!id) return;

    try {
      // Загружаем программу
      const programs = JSON.parse(localStorage.getItem('programs') || '[]');
      const samplePrograms = JSON.parse(localStorage.getItem('samplePrograms') || '[]');
      const foundProgram = [...programs, ...samplePrograms].find(p => p.id === id);
      
      if (foundProgram) {
        // Преобразуем программу в ExtendedProgram с exercises
        const extendedProgram: ExtendedProgram = {
          ...foundProgram,
          // Обеспечиваем совместимость со старыми данными - преобразуем duration в durationWeeks если нужно
          durationWeeks: foundProgram.durationWeeks || foundProgram.duration || 4,
          // Обеспечиваем совместимость - если exercises не существует, получаем их из первой тренировки
          exercises: foundProgram.exercises || (foundProgram.workouts?.[0]?.exercises || [])
        };
        
        setProgram(extendedProgram);

        // Получаем упражнения
        const exercises = extendedProgram.exercises || [];
        setAllExercises(exercises);

        // Загружаем историю тренировок, связанную с этой программой
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const programHistory = history.filter((workout: WorkoutRecord) => 
          workout.workoutId && foundProgram.workouts?.some((w: Workout) => w.id === workout.workoutId)
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

  // Обработчики перетаскивания
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Это необходимо, чтобы разрешить drop
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300', 'shadow-md', 'scale-[1.01]', 'transform');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300', 'shadow-md', 'scale-[1.01]', 'transform');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300', 'shadow-md', 'scale-[1.01]', 'transform');
    
    // Если мы не знаем, какой элемент перетаскивали, выходим
    if (draggedItemIndex === null || !program) return;

    // Если перетаскивание на то же место, ничего не делаем
    if (draggedItemIndex === targetIndex) return;

    // Создаем копию массива упражнений
    const newExercises = [...allExercises];
    
    // Удаляем упражнение из исходной позиции
    const [movedItem] = newExercises.splice(draggedItemIndex, 1);
    
    // Вставляем упражнение на новую позицию
    newExercises.splice(targetIndex, 0, movedItem);
    
    // Обновляем состояние со всеми упражнениями
    setAllExercises(newExercises);
    
    // Создаем копию программы с обновленным списком упражнений
    const newProgram = { 
      ...program,
      exercises: newExercises 
    };
    
    // Обновляем программу в состоянии
    setProgram(newProgram);
    
    // Сохраняем обновленную программу
    saveUpdatedProgram(newProgram);
    
    // Сбрасываем индекс перетаскиваемого элемента
    setDraggedItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  // Функция для сохранения обновленной программы
  const saveUpdatedProgram = (updatedProgram: ExtendedProgram) => {
    try {
      // Проверяем, принадлежит ли программа пользователю или это пример
      const programs = JSON.parse(localStorage.getItem('programs') || '[]');
      const samplePrograms = JSON.parse(localStorage.getItem('samplePrograms') || '[]');
      
      const isUserProgram = programs.some((p: Program) => p.id === updatedProgram.id);
      
      if (isUserProgram) {
        // Обновляем пользовательскую программу
        const updatedPrograms = programs.map((p: Program) => 
          p.id === updatedProgram.id ? updatedProgram : p
        );
        localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      } else {
        // Это пример программы - копируем его в пользовательские программы
        const programCopy = {
          ...updatedProgram,
          id: `${updatedProgram.id}-copy-${Date.now()}`, // Создаем новый ID
          isCopy: true
        };
        localStorage.setItem('programs', JSON.stringify([...programs, programCopy]));
        
        // Обновляем текущую программу в состоянии
        setProgram(programCopy);
        
        // Перенаправляем на страницу новой копии
        router.replace(`/programs/${programCopy.id}`);
      }
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
      alert('Произошла ошибка при сохранении программы. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для включения/выключения режима редактирования
  const toggleReordering = () => {
    setReordering(!reordering);
  };

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Основная информация о программе */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-800">{program.name}</h1>
            <button
              onClick={toggleReordering}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                reordering 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {reordering ? 'Завершить' : 'Изменить порядок упражнений'}
            </button>
          </div>
          <p className="text-gray-600 mb-4">{program.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600">Сложность:</span>
              <span className="ml-2 font-medium">{program.level}</span>
            </div>
            <div>
              <span className="text-gray-600">Длительность:</span>
              <span className="ml-2 font-medium">{program.durationWeeks} недель</span>
            </div>
            <div>
              <span className="text-gray-600">Тренировок в неделю:</span>
              <span className="ml-2 font-medium">{program.workoutsPerWeek}</span>
            </div>
          </div>
        </div>

        {/* Список упражнений */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Список упражнений</h2>
          
          {reordering && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Режим изменения порядка:</span> Перетащите упражнения, чтобы изменить их порядок. Нажмите "Завершить", когда закончите.
                </p>
                <button 
                  onClick={() => {
                    if (program) {
                      const newProgram = { 
                        ...program,
                        exercises: allExercises 
                      };
                      saveUpdatedProgram(newProgram);
                      alert('Порядок упражнений сохранен!');
                      setReordering(false); // Выключаем режим редактирования после сохранения
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сохранить порядок
                </button>
              </div>
            </div>
          )}
          
          {allExercises.length > 0 ? (
            <div className="space-y-3">
              {allExercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  draggable={reordering}
                  onDragStart={reordering ? () => handleDragStart(index) : undefined}
                  onDragOver={reordering ? handleDragOver : undefined}
                  onDragEnter={reordering ? handleDragEnter : undefined}
                  onDragLeave={reordering ? handleDragLeave : undefined}
                  onDrop={reordering ? (e) => handleDrop(e, index) : undefined}
                  onDragEnd={reordering ? handleDragEnd : undefined}
                  className={`border rounded-lg p-4 ${
                    reordering 
                      ? 'border-dashed border-gray-400 cursor-move transform transition hover:shadow-lg hover:-translate-y-1 hover:border-blue-500' 
                      : 'border-gray-200'
                  } ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{exercise.exercise.name}</h3>
                      <p className="text-sm text-gray-600">{exercise.exercise.description}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                          {exercise.exercise.type === 'reps' ? 'Силовое' : 'Кардио'}
                        </span>
                        {exercise.exercise.muscleGroups?.map(muscle => (
                          <span key={muscle} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {translateMuscleGroup(muscle)}
                          </span>
                        ))}
                      </div>
                    </div>
                    {reordering && (
                      <div className="flex flex-col items-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        <span className="text-xs mt-1">Перетащить</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500 block">Подходы</span>
                      <span className="font-medium">{exercise.sets}</span>
                    </div>
                    {exercise.exercise.type === 'reps' && (
                      <>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-xs text-gray-500 block">Повторения</span>
                          <span className="font-medium">{exercise.reps || '-'}</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-xs text-gray-500 block">Вес (кг)</span>
                          <span className="font-medium">{exercise.weight || '-'}</span>
                        </div>
                      </>
                    )}
                    {exercise.exercise.type === 'timed' && (
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-xs text-gray-500 block">Длительность (мин)</span>
                        <span className="font-medium">{exercise.duration || '-'}</span>
                      </div>
                    )}
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500 block">Отдых (сек)</span>
                      <span className="font-medium">{exercise.rest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">В этой программе пока нет упражнений.</p>
          )}
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