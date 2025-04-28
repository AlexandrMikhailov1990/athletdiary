import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { Exercise, getAllExercises, translateMuscleGroup, translateEquipment, getAllMuscleGroups, getAllEquipment } from '../../../models/Exercise';
import { Program, WorkoutExercise, getProgramById, copyProgram, SAMPLE_PROGRAMS } from '../../../models/Program';
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
    restBetweenExercises: 60,
  });
  
  // Состояние для выбора упражнений
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<ProgramExerciseEdit | null>(null);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'list' | 'tree'>('list');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  
  // Добавим состояние для редактируемого упражнения
  const [editingExercise, setEditingExercise] = useState<ProgramExerciseEdit | null>(null);
  
  // Добавим состояние для проверки стандартной программы
  const [isSampleProgram, setIsSampleProgram] = useState(false);
  
  // Добавим состояние для модального окна добавления упражнения
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  
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
        
        // Проверяем, является ли программа стандартной
        const isSample = SAMPLE_PROGRAMS.some(p => p.id === program.id);
        setIsSampleProgram(isSample);
        
        // Если программа стандартная, создаем копию
        if (isSample) {
          const copiedProgram = copyProgram(id as string);
          router.push(`/programs/edit/${copiedProgram.id}`);
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
              exerciseData: ex.exercise || {
                id: ex.exerciseId,
                name: 'Неизвестное упражнение',
                type: 'reps',
                difficulty: 'beginner',
                muscleGroups: [],
                description: ''
              }
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
      restTime: 60,
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
      restTime: ex.restTime,
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

  // Обработчик копирования программы
  const handleCopyProgram = () => {
    try {
      const copiedProgram = copyProgram(id as string);
      router.push(`/programs/edit/${copiedProgram.id}`);
    } catch (error) {
      console.error('Ошибка при копировании программы:', error);
      alert('Произошла ошибка при копировании программы');
    }
  };

  // Добавим обработчик для редактирования упражнения
  const handleEditExercise = (exercise: ProgramExerciseEdit) => {
    setEditingExercise(exercise);
  };

  // Добавим обработчик для сохранения изменений упражнения
  const handleSaveExerciseEdit = () => {
    if (!editingExercise) return;
    
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === editingExercise.id ? editingExercise : ex
      )
    }));
    
    setEditingExercise(null);
  };

  // Заголовок страницы
  return (
    <Layout>
      <div className="container mx-auto px-4 pb-24 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Редактирование программы</h1>
          <div className="flex w-full sm:w-auto gap-3 justify-center">
            <button
              onClick={handleCopyProgram}
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 text-base font-medium"
            >
              Копировать программу
            </button>
            <button
              onClick={() => router.push('/programs')}
              className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 text-base font-medium"
            >
              Отмена
            </button>
          </div>
        </div>
        
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
                        {editingExercise?.id === exercise.id ? (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">{exercise.exerciseData.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Подходы
                                </label>
                                <input
                                  type="number"
                                  value={editingExercise.sets}
                                  onChange={(e) => setEditingExercise(prev => prev ? {
                                    ...prev,
                                    sets: parseInt(e.target.value)
                                  } : null)}
                                  min="1"
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                              
                              {exercise.exerciseData.type === 'reps' && (
                                <>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Повторения
                                    </label>
                                    <input
                                      type="number"
                                      value={editingExercise.reps || 0}
                                      onChange={(e) => setEditingExercise(prev => prev ? {
                                        ...prev,
                                        reps: parseInt(e.target.value)
                                      } : null)}
                                      min="0"
                                      className="w-full p-2 border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Вес (кг)
                                    </label>
                                    <input
                                      type="number"
                                      value={editingExercise.weight || 0}
                                      onChange={(e) => setEditingExercise(prev => prev ? {
                                        ...prev,
                                        weight: parseFloat(e.target.value)
                                      } : null)}
                                      min="0"
                                      step="0.5"
                                      className="w-full p-2 border border-gray-300 rounded"
                                    />
                                  </div>
                                </>
                              )}
                              
                              {exercise.exerciseData.type === 'timed' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Длительность (сек)
                                  </label>
                                  <input
                                    type="number"
                                    value={editingExercise.duration || 0}
                                    onChange={(e) => setEditingExercise(prev => prev ? {
                                      ...prev,
                                      duration: parseInt(e.target.value)
                                    } : null)}
                                    min="0"
                                    className="w-full p-2 border border-gray-300 rounded"
                                  />
                                </div>
                              )}
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Отдых между подходами (сек)
                                </label>
                                <input
                                  type="number"
                                  value={editingExercise.restTime}
                                  onChange={(e) => setEditingExercise(prev => prev ? {
                                    ...prev,
                                    restTime: parseInt(e.target.value)
                                  } : null)}
                                  min="0"
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingExercise(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                Отмена
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveExerciseEdit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                              >
                                Сохранить
                              </button>
                            </div>
                          </div>
                        ) : (
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
                                  <span className="text-xs text-gray-500 block">Отдых между подходами (сек)</span>
                                  <span className="font-medium">{exercise.restTime}</span>
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
                                onClick={() => handleEditExercise(exercise)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                ✎
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
                        )}
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div className="w-full sm:w-auto">
                      <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                        Поиск упражнений
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <div className="flex-1">
                          <input
                            type="text"
                            id="searchQuery"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Название или описание..."
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={toggleSelectionMode}
                          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
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
                        <div className="grid grid-cols-1 gap-2">
                          {filteredExercises.map(exercise => (
                            <div
                              key={exercise.id}
                              onClick={() => handleSelectExercise(exercise)}
                              className={`p-3 rounded cursor-pointer ${
                                selectedExercise?.id === exercise.id
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-gray-500">{exercise.type === 'reps' ? 'Силовое' : 'Кардио'}</div>
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
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h3 className="text-md font-medium mb-2">Группы мышц</h3>
                        <div className="h-40 overflow-y-auto border rounded p-2">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {muscleGroups.map(group => (
                              <div
                                key={group}
                                onClick={() => handleSelectMuscleGroup(group)}
                                className={`p-2 rounded cursor-pointer text-sm ${
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
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium mb-2">Оборудование</h3>
                        <div className="h-40 overflow-y-auto border rounded p-2">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {equipmentTypes.map(equipment => (
                              <div
                                key={equipment}
                                onClick={() => handleSelectEquipment(equipment)}
                                className={`p-2 rounded cursor-pointer text-sm ${
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
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium mb-2">Результаты</h3>
                        <div className="h-40 overflow-y-auto border rounded p-2">
                          {filteredExercises.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                              {filteredExercises.map(exercise => (
                                <div
                                  key={exercise.id}
                                  onClick={() => handleSelectExercise(exercise)}
                                  className={`p-3 rounded cursor-pointer ${
                                    selectedExercise?.id === exercise.id
                                      ? 'bg-blue-100 border border-blue-300'
                                      : 'hover:bg-gray-100 border border-transparent'
                                  }`}
                                >
                                  <div className="font-medium">{exercise.name}</div>
                                  <div className="text-sm text-gray-500">{exercise.type === 'reps' ? 'Силовое' : 'Кардио'}</div>
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
                        <label htmlFor="restTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Отдых между подходами (сек)
                        </label>
                        <input
                          type="number"
                          id="restTime"
                          name="restTime"
                          value={exerciseDetails.restTime}
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
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center gap-3 z-50">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(true)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 text-base font-medium"
                >
                  Добавить упражнение
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 text-base font-medium"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Добавить упражнение</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Название или описание..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => setShowExerciseModal(false)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => {
                    // Здесь будет логика добавления упражнения
                    setShowExerciseModal(false);
                  }}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditProgram; 