import { useState, useEffect } from 'react';
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

  // Инициализация дней тренировок при монтировании компонента
  useEffect(() => {
    initializeWorkoutDays(form.workoutsPerWeek);
  }, []);

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
      const newValue = name === 'workoutsPerWeek' || name === 'duration' ? Number(value) : value;
      const newForm = { ...prev, [name]: newValue };
      
      if (name === 'workoutsPerWeek' || name === 'duration') {
        const totalWorkouts = 
          name === 'workoutsPerWeek' 
            ? Number(value) * prev.duration
            : prev.workoutsPerWeek * Number(value);
            
        const newWorkoutDays = Array(totalWorkouts).fill(null).map((_, index) => 
          prev.workoutDays[index] || { exercises: [] }
        );
        
        return {
          ...newForm,
          workoutDays: newWorkoutDays
        };
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
      description: form.description || 'Персональная программа тренировок',
      level: form.level,
      duration: Number(form.duration),
      workoutsPerWeek: Number(form.workoutsPerWeek),
      workouts: workouts,
      createdBy: 'user',
      isPublic: true
    };

    // Сохраняем в localStorage
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    programs.push(newProgram);
    localStorage.setItem('programs', JSON.stringify(programs));

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

            {/* Навигация по дням */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Дни тренировок
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {form.workoutDays.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentDay(index)}
                    className={`px-4 py-2 rounded-lg ${
                      currentDay === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    День {index + 1}
                    {form.workoutDays[index].exercises.length > 0 && (
                      <span className="ml-2 bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {form.workoutDays[index].exercises.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Список упражнений текущего дня */}
              {form.workoutDays[currentDay]?.exercises.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Упражнения - День {currentDay + 1}
                  </h3>
                  <div className="space-y-3">
                    {form.workoutDays[currentDay].exercises.map((exercise, index) => {
                      const exerciseData = SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
                      return (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{exerciseData?.name}</span>
                            <span className="text-gray-500 ml-2">
                              {exercise.sets} × {exercise.reps || exercise.duration}
                              {exercise.weight ? ` | ${exercise.weight}кг` : ''}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExerciseFromDay(currentDay, index)}
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

              {/* Форма добавления упражнения */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
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
                          value={exerciseDetails.reps || ''}
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
                          step="0.5"
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
                  className={`mt-4 px-6 py-2 rounded-lg ${
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