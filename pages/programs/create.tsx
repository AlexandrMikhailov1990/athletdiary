import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Exercise, NORMALIZED_SAMPLE_EXERCISES } from '../../models/Exercise';

interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface CreateProgramForm {
  name: string;
  description: string;
  restBetweenSets: number; // Время отдыха между подходами
  restBetweenExercises: number; // Время отдыха между упражнениями
  exercises: ProgramExercise[];
}

export default function CreateProgram() {
  const router = useRouter();
  const [form, setForm] = useState<CreateProgramForm>({
    name: '',
    description: '',
    restBetweenSets: 60,
    restBetweenExercises: 90,
    exercises: []
  });

  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseDetails, setExerciseDetails] = useState<ProgramExercise>({
    exerciseId: '',
    sets: 3,
    reps: 10
  });

  // Удаляем все существующие программы при загрузке страницы
  useEffect(() => {
    // Эта функция больше не нужна, так как мы не хотим удалять все программы при создании новой
    // localStorage.setItem('programs', JSON.stringify([]));
    // localStorage.setItem('activePrograms', JSON.stringify([]));
    // localStorage.removeItem('activeProgram');
  }, []);

  // Обработка изменения базовых полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['restBetweenSets', 'restBetweenExercises'].includes(name) ? Number(value) : value
    }));
  };

  // Обработчик изменения деталей упражнения
  const handleExerciseDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExerciseDetails(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // Добавление упражнения в программу
  const addExercise = () => {
    if (!selectedExercise) return;

    const exercise = NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === selectedExercise);
    if (!exercise) return;

    const newExercise: ProgramExercise = {
      exerciseId: selectedExercise,
      sets: exerciseDetails.sets,
      ...(exercise.type === 'reps' 
        ? { reps: exerciseDetails.reps } 
        : { duration: exerciseDetails.duration || exercise.duration || 60 }
      ),
      ...(exercise.type === 'reps' && exerciseDetails.weight ? { weight: exerciseDetails.weight } : {})
    };

    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));

    // Сброс формы упражнения
    setSelectedExercise('');
    setExerciseDetails({
      exerciseId: '',
      sets: 3,
      reps: 10
    });
  };

  // Удаление упражнения из программы
  const removeExercise = (index: number) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, exerciseIndex) => exerciseIndex !== index)
    }));
  };

  // Сохранение программы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение в программу');
      return;
    }
    
    // Создаем новую программу
    const newProgram = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description || 'Персональная программа тренировок',
      restBetweenSets: form.restBetweenSets,
      restBetweenExercises: form.restBetweenExercises,
      workouts: [
        {
          id: `workout-1`,
          name: "Тренировка",
          exercises: form.exercises.map(exercise => {
            const exerciseData = NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
            if (!exerciseData) throw new Error('Exercise not found');
            
            // Создаем копию исходного упражнения, чтобы не менять исходный объект
            const exerciseCopy = { ...exerciseData };
            
            // Обновляем поля упражнения из пользовательских настроек
            if (exerciseCopy.type === 'timed' && exercise.duration) {
              exerciseCopy.duration = exercise.duration;
            } else if (exerciseCopy.type === 'reps' && exercise.reps) {
              exerciseCopy.reps = exercise.reps;
            }
            
            return {
              exercise: exerciseCopy,
              sets: exercise.sets,
              reps: exercise.reps,
              duration: exercise.duration,
              rest: form.restBetweenSets,
              weight: exercise.weight
            };
          }),
          notes: ''
        }
      ],
      level: 'beginner',
      duration: 1,
      workoutsPerWeek: 1,
      createdBy: 'user',
      isPublic: true
    };

    console.log('Создана новая программа:', newProgram);

    try {
      // Сохраняем в localStorage
      const programs = JSON.parse(localStorage.getItem('programs') || '[]');
      programs.push(newProgram);
      localStorage.setItem('programs', JSON.stringify(programs));
      console.log('Обновленный список программ в localStorage:', programs);

      // Автоматически запускаем программу
      const newActiveProgram = {
        programId: newProgram.id,
        userId: 'user',
        startDate: new Date().toISOString(),
        currentWeek: 1,
        currentDay: 1,
        completedWorkouts: []
      };

      // Сохраняем активную программу
      localStorage.setItem('activeProgram', JSON.stringify(newActiveProgram));

      // Сохраняем полную информацию о программе в activePrograms
      const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
      activePrograms.push({
        ...newActiveProgram,
        program: newProgram
      });
      localStorage.setItem('activePrograms', JSON.stringify(activePrograms));

      // Перенаправляем на страницу активной программы
      router.push('/active-program');
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
      alert('Произошла ошибка при сохранении программы. Попробуйте еще раз.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            Создание программы тренировок
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Основная информация
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название программы
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Время отдыха между подходами (сек)
                    </label>
                    <input
                      type="number"
                      name="restBetweenSets"
                      min="0"
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                      value={form.restBetweenSets}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Время отдыха между упражнениями (сек)
                    </label>
                    <input
                      type="number"
                      name="restBetweenExercises"
                      min="0"
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                      value={form.restBetweenExercises}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Добавление упражнений */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Добавление упражнений
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Упражнение
                  </label>
                  <select
                    value={selectedExercise}
                    onChange={(e) => {
                      setSelectedExercise(e.target.value);
                      const exercise = NORMALIZED_SAMPLE_EXERCISES.find(ex => ex.id === e.target.value);
                      if (exercise) {
                        setExerciseDetails(prev => ({
                          ...prev,
                          exerciseId: e.target.value,
                          ...(exercise.type === 'timed' ? { duration: exercise.duration || 60 } : {})
                        }));
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Выберите упражнение</option>
                    {NORMALIZED_SAMPLE_EXERCISES.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedExercise && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Количество подходов
                      </label>
                      <input
                        type="number"
                        name="sets"
                        min="1"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        value={exerciseDetails.sets}
                        onChange={handleExerciseDetailsChange}
                      />
                    </div>

                    {NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === selectedExercise)?.type === 'reps' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Повторений
                          </label>
                          <input
                            type="number"
                            name="reps"
                            min="1"
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                            value={exerciseDetails.reps}
                            onChange={handleExerciseDetailsChange}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Вес (кг, опционально)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={exerciseDetails.weight || ''}
                            onChange={handleExerciseDetailsChange}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Продолжительность (сек)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          min="1"
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                          value={exerciseDetails.duration}
                          onChange={handleExerciseDetailsChange}
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addExercise}
                  disabled={!selectedExercise}
                  className={`px-4 py-2 rounded ${
                    !selectedExercise ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Добавить упражнение
                </button>
              </div>

              {/* Список добавленных упражнений */}
              {form.exercises.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Добавленные упражнения
                  </h3>
                  <div className="space-y-3">
                    {form.exercises.map((exercise, index) => {
                      const exerciseData = NORMALIZED_SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
                      return (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{exerciseData?.name}</span>
                            <div className="text-sm text-gray-600">
                              {exercise.sets} подходов × {' '}
                              {exerciseData?.type === 'reps' 
                                ? `${exercise.reps} повторений`
                                : `${exercise.duration} секунд`
                              }
                              {exercise.weight ? ` × ${exercise.weight} кг` : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Удалить
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={form.exercises.length === 0}
                className={`px-8 py-3 text-lg rounded-lg font-semibold ${
                  form.exercises.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Создать программу
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 