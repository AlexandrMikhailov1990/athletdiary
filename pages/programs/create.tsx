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

interface CreateProgramForm {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // недель
  workoutsPerWeek: number;
  exercises: ProgramExercise[];
}

export default function CreateProgram() {
  const router = useRouter();
  const [form, setForm] = useState<CreateProgramForm>({
    name: '',
    description: '',
    level: 'beginner',
    duration: 4,
    workoutsPerWeek: 3,
    exercises: []
  });

  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseDetails, setExerciseDetails] = useState<ProgramExercise>({
    exerciseId: '',
    sets: 3,
    reps: 10
  });

  // Обработка изменения базовых полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'workoutsPerWeek' || name === 'duration' ? Number(value) : value
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

    const exercise = SAMPLE_EXERCISES.find(e => e.id === selectedExercise);
    if (!exercise) return;

    const newExercise: ProgramExercise = {
      exerciseId: selectedExercise,
      sets: exerciseDetails.sets,
      ...(exercise.type === 'reps' ? { reps: exerciseDetails.reps } : { duration: exerciseDetails.duration || 60 }),
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
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  // Сохранение программы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем новую программу
    const newProgram = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description || 'Персональная программа тренировок',
      level: form.level,
      duration: Number(form.duration),
      workoutsPerWeek: Number(form.workoutsPerWeek),
      workouts: [{
        id: 'workout-1',
        name: 'Тренировка',
        exercises: form.exercises.map(exercise => {
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
      }],
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Продолжительность (недель)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      required
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
                      min="1"
                      max="7"
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                      value={form.workoutsPerWeek}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание программы
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                    value={form.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Добавление упражнений */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Упражнения программы
              </h2>

              <div className="space-y-4">
                {/* Форма добавления упражнения */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Упражнение
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
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
                      className="w-full p-2 border border-gray-300 rounded"
                      value={exerciseDetails.sets}
                      onChange={handleExerciseDetailsChange}
                    />
                  </div>

                  {selectedExercise && SAMPLE_EXERCISES.find(e => e.id === selectedExercise)?.type === 'reps' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Количество повторений
                        </label>
                        <input
                          type="number"
                          name="reps"
                          min="1"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={exerciseDetails.reps}
                          onChange={handleExerciseDetailsChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Вес (кг)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          min="0"
                          step="0.5"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={exerciseDetails.weight || ''}
                          onChange={handleExerciseDetailsChange}
                        />
                      </div>
                    </>
                  )}

                  {selectedExercise && SAMPLE_EXERCISES.find(e => e.id === selectedExercise)?.type === 'timed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Продолжительность (сек)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={exerciseDetails.duration || 60}
                        onChange={handleExerciseDetailsChange}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Добавить упражнение
                  </button>
                </div>

                {/* Список добавленных упражнений */}
                <div className="mt-6 space-y-4">
                  {form.exercises.map((exercise, index) => {
                    const exerciseData = SAMPLE_EXERCISES.find(e => e.id === exercise.exerciseId);
                    if (!exerciseData) return null;

                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{exerciseData.name}</h3>
                          <p className="text-sm text-gray-600">
                            {exercise.sets} подходов × {' '}
                            {exerciseData.type === 'reps' 
                              ? `${exercise.reps} повторений${exercise.weight ? ` × ${exercise.weight} кг` : ''}`
                              : `${exercise.duration} секунд`
                            }
                          </p>
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
            </div>

            {/* Кнопка сохранения */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
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