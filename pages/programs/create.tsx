import { useState } from 'react';
import { useRouter } from 'next/router';
import { Exercise, SAMPLE_EXERCISES } from '../../models/Exercise';

interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface WorkoutDay {
  exercises: ProgramExercise[];
}

interface CreateProgramForm {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // недель
  workoutsPerWeek: number;
  workoutDays: WorkoutDay[];
}

export default function CreateProgram() {
  const router = useRouter();
  const [form, setForm] = useState<CreateProgramForm>({
    name: '',
    description: '',
    level: 'beginner',
    duration: 4,
    workoutsPerWeek: 3,
    workoutDays: []
  });

  const [currentDay, setCurrentDay] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseDetails, setExerciseDetails] = useState<ProgramExercise>({
    exerciseId: '',
    sets: 3,
    reps: 10
  });

  // Инициализация дней тренировок при изменении количества тренировок в неделю
  const initializeWorkoutDays = (count: number) => {
    const totalWorkouts = count * form.duration;
    const newWorkoutDays = Array(totalWorkouts).fill(null).map(() => ({
      exercises: []
    }));
    setForm(prev => ({
      ...prev,
      workoutDays: newWorkoutDays
    }));
  };

  // Обработка изменения базовых полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: value };
      if (name === 'workoutsPerWeek' || name === 'duration') {
        initializeWorkoutDays(
          name === 'workoutsPerWeek' ? Number(value) : prev.workoutsPerWeek
        );
      }
      return newForm;
    });
  };

  // Обработчик изменения деталей упражнения
  const handleExerciseDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExerciseDetails(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // Добавление упражнения в день тренировки
  const addExerciseToDay = () => {
    if (!selectedExercise || !form.workoutDays[currentDay]) return;

    const exercise = SAMPLE_EXERCISES.find(e => e.id === selectedExercise);
    if (!exercise) return;

    const newExercise: ProgramExercise = {
      exerciseId: selectedExercise,
      sets: exerciseDetails.sets,
      ...(exercise.type === 'reps' ? { reps: exerciseDetails.reps } : { duration: exerciseDetails.duration || 60 }),
      ...(exercise.type === 'reps' && exerciseDetails.weight ? { weight: exerciseDetails.weight } : {})
    };

    setForm(prev => {
      const newWorkoutDays = [...prev.workoutDays];
      newWorkoutDays[currentDay] = {
        ...newWorkoutDays[currentDay],
        exercises: [...newWorkoutDays[currentDay].exercises, newExercise]
      };
      return {
        ...prev,
        workoutDays: newWorkoutDays
      };
    });

    // Сброс формы упражнения
    setSelectedExercise('');
    setExerciseDetails({
      exerciseId: '',
      sets: 3,
      reps: 10
    });
  };

  // Удаление упражнения из дня тренировки
  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    setForm(prev => {
      const newWorkoutDays = [...prev.workoutDays];
      newWorkoutDays[dayIndex].exercises.splice(exerciseIndex, 1);
      return {
        ...prev,
        workoutDays: newWorkoutDays
      };
    });
  };

  // Сохранение программы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Преобразуем workoutDays в формат workouts
    const workouts = form.workoutDays.map((day, index) => ({
      id: `workout-${index + 1}`,
      name: `День ${index + 1}`,
      exercises: day.exercises.map(exercise => {
        const exerciseData = SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
        if (!exerciseData) throw new Error('Exercise not found');
        
        return {
          exercise: exerciseData,
          sets: exercise.sets,
          reps: exercise.reps || (exerciseData.type === 'timed' ? 'timed' : 10),
          rest: exerciseData.restTime,
          weight: exercise.weight
        };
      }),
      notes: ''
    }));

    // Создаем новую программу в правильном формате
    const newProgram = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      level: form.level,
      duration: form.duration,
      workoutsPerWeek: form.workoutsPerWeek,
      workouts: workouts,
      createdBy: 'user',
      isPublic: true
    };

    // Сохраняем в localStorage
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    programs.push(newProgram);
    localStorage.setItem('programs', JSON.stringify(programs));

    router.push('/programs');
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Уровень сложности
                  </label>
                  <select
                    name="level"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.level}
                    onChange={handleInputChange}
                  >
                    <option value="beginner">Новичок</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Продолжительность (недель)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    required
                    min="1"
                    max="52"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.duration}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тренировок в неделю
                  </label>
                  <input
                    type="number"
                    name="workoutsPerWeek"
                    required
                    min="1"
                    max="7"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.workoutsPerWeek}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание программы
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* План тренировок */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  План тренировок
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setCurrentDay(prev => Math.max(0, prev - 1))}
                    disabled={currentDay === 0}
                  >
                    ←
                  </button>
                  <span className="text-gray-600">
                    День {currentDay + 1} из {form.workoutDays.length}
                  </span>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setCurrentDay(prev => Math.min(form.workoutDays.length - 1, prev + 1))}
                    disabled={currentDay === form.workoutDays.length - 1}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Список упражнений текущего дня */}
              <div className="mb-6">
                {form.workoutDays[currentDay]?.exercises.map((exercise, index) => {
                  const exerciseData = SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
                  if (!exerciseData) return null;

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
                      <div>
                        <span className="font-medium">{exerciseData.name}</span>
                        <span className="text-gray-600 text-sm ml-2">
                          {exercise.sets} × {
                            exerciseData.type === 'reps' 
                              ? `${exercise.reps} повторений` 
                              : `${exercise.duration}с`
                          }
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeExerciseFromDay(currentDay, index)}
                      >
                        Удалить
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Форма добавления упражнения */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Добавить упражнение в день {currentDay + 1}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Упражнение
                    </label>
                    <select
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Выберите упражнение</option>
                      {SAMPLE_EXERCISES.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество подходов
                    </label>
                    <input
                      type="number"
                      name="sets"
                      min="1"
                      value={exerciseDetails.sets}
                      onChange={handleExerciseDetailsChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  {selectedExercise && SAMPLE_EXERCISES.find(e => e.id === selectedExercise)?.type === 'reps' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Количество повторений
                        </label>
                        <input
                          type="number"
                          name="reps"
                          min="1"
                          value={exerciseDetails.reps}
                          onChange={handleExerciseDetailsChange}
                          className="w-full p-2 border border-gray-300 rounded"
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
                          value={exerciseDetails.weight || ''}
                          onChange={handleExerciseDetailsChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </>
                  ) : selectedExercise && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Длительность (секунд)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        value={exerciseDetails.duration || 60}
                        onChange={handleExerciseDetailsChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addExerciseToDay}
                  disabled={!selectedExercise}
                  className={`mt-4 px-4 py-2 rounded ${
                    selectedExercise
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Добавить упражнение
                </button>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => router.push('/programs')}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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