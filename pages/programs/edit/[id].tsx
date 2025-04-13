import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { Exercise, getAllExercises, translateMuscleGroup, translateEquipment, getAllMuscleGroups, getAllEquipment } from '../../../models/Exercise';
import { Program, WorkoutExercise, getProgramById } from '../../../models/Program';
import { v4 as uuidv4 } from 'uuid';

interface ProgramExerciseEdit extends WorkoutExercise {
  exerciseData: Exercise;
}

interface EditProgramForm {
  id: string;
  name: string;
  description: string;
  exercises: ProgramExerciseEdit[];
  restBetweenExercises: number;
}

const EditProgram: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  
  // Состояние формы
  const [form, setForm] = useState<EditProgramForm>({
    id: '',
    name: '',
    description: '',
    exercises: [],
    restBetweenExercises: 120,
  });
  
  // Состояние для выбора упражнений
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<ProgramExerciseEdit | null>(null);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'list' | 'tree'>('list');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  
  // Загрузка программы для редактирования
  useEffect(() => {
    if (!id) return;
    
    const loadProgram = () => {
      try {
        const program = getProgramById(id as string);
        if (!program) {
          alert('Программа не найдена');
          router.push('/programs');
          return;
        }
        
        // Подготовка упражнений для формы редактирования
        const programExercises: ProgramExerciseEdit[] = [];
        
        // Предпочитаем exercises, но если его нет, берем из первой тренировки
        const exercisesToUse = program.exercises || 
          (program.workouts && program.workouts.length > 0 ? program.workouts[0].exercises : []);
        
        if (exercisesToUse && exercisesToUse.length > 0) {
          exercisesToUse.forEach(ex => {
            programExercises.push({
              ...ex,
              exerciseData: ex.exercise
            });
          });
        }
        
        setForm({
          id: program.id,
          name: program.name,
          description: program.description,
          exercises: programExercises,
          restBetweenExercises: program.restBetweenExercises || 120
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке программы:', error);
        alert('Произошла ошибка при загрузке программы');
        router.push('/programs');
      }
    };
    
    loadProgram();
  }, [id, router]);
  
  // Получение уникальных групп мышц и типов оборудования
  const muscleGroups = useMemo(() => {
    return getAllMuscleGroups();
  }, []);
  
  const equipmentTypes = useMemo(() => {
    return getAllEquipment();
  }, []);
  
  // Фильтрация упражнений
  const filteredExercises = useMemo(() => {
    let result = availableExercises;
    
    // Поиск по запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(query) || 
        ex.description.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по группе мышц
    if (selectedMuscleGroup) {
      result = result.filter(ex => 
        ex.muscleGroups.includes(selectedMuscleGroup)
      );
    }
    
    // Фильтрация по оборудованию
    if (selectedEquipment) {
      result = result.filter(ex => 
        ex.equipment?.includes(selectedEquipment)
      );
    }
    
    return result;
  }, [availableExercises, searchQuery, selectedMuscleGroup, selectedEquipment]);
  
  // Загрузка упражнений
  useEffect(() => {
    const exercises = getAllExercises();
    setAvailableExercises(exercises);
  }, []);
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'restBetweenExercises' ? parseInt(value) : value
    }));
  };
  
  // Обработчик изменения деталей упражнения
  const handleExerciseDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!exerciseDetails) return;
    
    setExerciseDetails(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: ['sets', 'reps', 'weight', 'rest', 'duration'].includes(name) ? parseInt(value) : value
      };
    });
  };
  
  // Сброс выбора
  const resetSelection = () => {
    setSelectedExercise(null);
    setExerciseDetails(null);
    setSelectedMuscleGroup(null);
    setSelectedEquipment(null);
    setSearchQuery('');
  };
  
  // Переключение режима выбора упражнений
  const toggleSelectionMode = () => {
    setSelectionMode(prev => prev === 'list' ? 'tree' : 'list');
    resetSelection();
  };
  
  // Выбор упражнения
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseDetails({
      id: uuidv4(),
      exercise: exercise,
      exerciseId: exercise.id,
      sets: 3,
      reps: exercise.type === 'reps' ? 10 : undefined,
      duration: exercise.type === 'timed' ? 30 : undefined,
      weight: 0,
      rest: 60,
      exerciseData: exercise
    });
  };
  
  // Выбор группы мышц
  const handleSelectMuscleGroup = (group: string) => {
    setSelectedMuscleGroup(prev => prev === group ? null : group);
    setSelectedEquipment(null);
  };
  
  // Выбор оборудования
  const handleSelectEquipment = (equipment: string) => {
    setSelectedEquipment(prev => prev === equipment ? null : equipment);
  };
  
  // Добавление упражнения в программу
  const handleAddExercise = () => {
    if (!exerciseDetails) return;
    
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseDetails]
    }));
    
    resetSelection();
  };
  
  // Удаление упражнения из программы
  const handleRemoveExercise = (id: string) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  };

  // Изменение порядка упражнений
  const handleMoveExercise = (id: string, direction: 'up' | 'down') => {
    const exerciseIndex = form.exercises.findIndex(ex => ex.id === id);
    if (exerciseIndex === -1) return;
    
    const newExercises = [...form.exercises];
    
    if (direction === 'up' && exerciseIndex > 0) {
      // Меняем местами с предыдущим упражнением
      [newExercises[exerciseIndex], newExercises[exerciseIndex - 1]] = 
      [newExercises[exerciseIndex - 1], newExercises[exerciseIndex]];
    } else if (direction === 'down' && exerciseIndex < newExercises.length - 1) {
      // Меняем местами со следующим упражнением
      [newExercises[exerciseIndex], newExercises[exerciseIndex + 1]] = 
      [newExercises[exerciseIndex + 1], newExercises[exerciseIndex]];
    }
    
    setForm(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (form.exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение в программу');
      return;
    }
    
    // Подготовка данных программы
    const workoutExercises = form.exercises.map(ex => ({
      id: ex.id,
      exerciseId: ex.exerciseId,
      exercise: ex.exerciseData,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      duration: ex.duration,
      rest: ex.rest,
    }));
    
    // Создание и сохранение программы
    const updatedProgram: Program = {
      id: form.id,
      name: form.name,
      description: form.description,
      workouts: [
        {
          id: form.id + "_workout",
          programId: form.id,
          exercises: workoutExercises,
          name: `${form.name} - Тренировка`
        }
      ],
      exercises: workoutExercises,
      restBetweenExercises: form.restBetweenExercises,
      isPublic: false,
      createdBy: 'user'
    };
    
    try {
      // Сохранение программы в localStorage
      const savedPrograms = localStorage.getItem('programs');
      const programs = savedPrograms ? JSON.parse(savedPrograms) : [];
      
      // Находим индекс редактируемой программы
      const programIndex = programs.findIndex((p: Program) => p.id === form.id);
      
      if (programIndex !== -1) {
        // Обновляем существующую программу
        programs[programIndex] = updatedProgram;
      } else {
        // Добавляем новую программу
        programs.push(updatedProgram);
      }
      
      localStorage.setItem('programs', JSON.stringify(programs));
      
      alert('Программа успешно обновлена!');
      router.push(`/programs/${form.id}`);
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
      alert('Произошла ошибка при сохранении программы');
    }
  };

  // Заголовок страницы
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Редактирование программы</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-8">Измените данные программы и нажмите "Сохранить изменения"</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Основная информация о программе */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Основная информация</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Название программы <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Описание программы
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="restBetweenExercises" className="block text-sm font-medium text-gray-700 mb-1">
                      Время отдыха между упражнениями (сек)
                    </label>
                    <input
                      type="number"
                      id="restBetweenExercises"
                      name="restBetweenExercises"
                      value={form.restBetweenExercises}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              
              {/* Уже добавленные упражнения */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Упражнения в программе</h2>
                
                {form.exercises.length > 0 ? (
                  <div className="space-y-4">
                    {form.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="border rounded-lg p-4 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{exercise.exerciseData.name}</h3>
                            <p className="text-sm text-gray-600">{exercise.exerciseData.description}</p>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-xs text-gray-500 block">Подходы</span>
                                <span className="font-medium">{exercise.sets}</span>
                              </div>
                              
                              {exercise.exerciseData.type === 'reps' && (
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
                              
                              {exercise.exerciseData.type === 'timed' && (
                                <div className="bg-gray-50 p-2 rounded">
                                  <span className="text-xs text-gray-500 block">Длительность (сек)</span>
                                  <span className="font-medium">{exercise.duration || '-'}</span>
                                </div>
                              )}
                              
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="text-xs text-gray-500 block">Отдых (сек)</span>
                                <span className="font-medium">{exercise.rest}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(exercise.id, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${
                                index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(exercise.id, 'down')}
                              disabled={index === form.exercises.length - 1}
                              className={`p-1 rounded ${
                                index === form.exercises.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(exercise.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Упражнения не добавлены</p>
                  </div>
                )}
              </div>
              
              {/* Добавление нового упражнения */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Добавить упражнение</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                        Поиск упражнений
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="searchQuery"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Название или описание..."
                          className="p-2 border border-gray-300 rounded w-64"
                        />
                        <button
                          type="button"
                          onClick={toggleSelectionMode}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                        >
                          {selectionMode === 'list' ? 'По категориям' : 'Список'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Режим выбора упражнения */}
                  {selectionMode === 'list' ? (
                    <div className="h-60 overflow-y-auto border rounded p-2">
                      {filteredExercises.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {filteredExercises.map(exercise => (
                            <div
                              key={exercise.id}
                              onClick={() => handleSelectExercise(exercise)}
                              className={`p-2 rounded cursor-pointer ${
                                selectedExercise?.id === exercise.id
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-xs text-gray-500">{exercise.type === 'reps' ? 'Силовое' : 'Кардио'}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">Упражнения не найдены</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-md font-medium mb-2">Группы мышц</h3>
                        <div className="h-60 overflow-y-auto border rounded p-2">
                          {muscleGroups.map(group => (
                            <div
                              key={group}
                              onClick={() => handleSelectMuscleGroup(group)}
                              className={`p-2 rounded cursor-pointer ${
                                selectedMuscleGroup === group
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              {translateMuscleGroup(group)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium mb-2">Оборудование</h3>
                        <div className="h-60 overflow-y-auto border rounded p-2">
                          {equipmentTypes.map(equipment => (
                            <div
                              key={equipment}
                              onClick={() => handleSelectEquipment(equipment)}
                              className={`p-2 rounded cursor-pointer ${
                                selectedEquipment === equipment
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              {translateEquipment(equipment)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="text-md font-medium mb-2">Результаты</h3>
                        <div className="h-60 overflow-y-auto border rounded p-2">
                          {filteredExercises.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {filteredExercises.map(exercise => (
                                <div
                                  key={exercise.id}
                                  onClick={() => handleSelectExercise(exercise)}
                                  className={`p-2 rounded cursor-pointer ${
                                    selectedExercise?.id === exercise.id
                                      ? 'bg-blue-100 border border-blue-300'
                                      : 'hover:bg-gray-100 border border-transparent'
                                  }`}
                                >
                                  <div className="font-medium">{exercise.name}</div>
                                  <div className="text-xs text-gray-500">{exercise.type === 'reps' ? 'Силовое' : 'Кардио'}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500">Упражнения не найдены</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Форма с деталями упражнения */}
                {selectedExercise && exerciseDetails && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Настройка упражнения: {selectedExercise.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
                          Количество подходов
                        </label>
                        <input
                          type="number"
                          id="sets"
                          name="sets"
                          value={exerciseDetails.sets}
                          onChange={handleExerciseDetailChange}
                          min="1"
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      {selectedExercise.type === 'reps' && (
                        <>
                          <div>
                            <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
                              Количество повторений
                            </label>
                            <input
                              type="number"
                              id="reps"
                              name="reps"
                              value={exerciseDetails.reps || 0}
                              onChange={handleExerciseDetailChange}
                              min="0"
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                              Вес (кг)
                            </label>
                            <input
                              type="number"
                              id="weight"
                              name="weight"
                              value={exerciseDetails.weight || 0}
                              onChange={handleExerciseDetailChange}
                              min="0"
                              step="0.5"
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedExercise.type === 'timed' && (
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Длительность (сек)
                          </label>
                          <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={exerciseDetails.duration || 0}
                            onChange={handleExerciseDetailChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="rest" className="block text-sm font-medium text-gray-700 mb-1">
                          Отдых между подходами (сек)
                        </label>
                        <input
                          type="number"
                          id="rest"
                          name="rest"
                          value={exerciseDetails.rest}
                          onChange={handleExerciseDetailChange}
                          min="0"
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={resetSelection}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Добавить упражнение
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Кнопки управления */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.push(`/programs/${form.id}`)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditProgram; 