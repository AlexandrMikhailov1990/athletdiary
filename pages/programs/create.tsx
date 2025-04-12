import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Exercise, getAllExercises, translateMuscleGroup, translateEquipment, getAllMuscleGroups, getAllEquipment } from '../../models/Exercise';
import { Program, WorkoutExercise } from '../../models/Program';
import { v4 as uuidv4 } from 'uuid';

interface ProgramExerciseEdit extends WorkoutExercise {
  exerciseData: Exercise;
}

interface CreateProgramForm {
  name: string;
  description: string;
  exercises: ProgramExerciseEdit[];
  restBetweenExercises: number;
}

interface ActiveProgram {
  programId: string;
  userId: string;
  startDate: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: string[];
}

const CreateProgram: React.FC = () => {
  const router = useRouter();
  
  // Состояние формы
  const [form, setForm] = useState<CreateProgramForm>({
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
    const programId = uuidv4();
    const now = new Date();
    
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
    const newProgram: Program = {
      id: programId,
      name: form.name,
      description: form.description,
      workouts: [
        {
          id: uuidv4(),
          programId: programId,
          exercises: workoutExercises,
          name: `${form.name} - Тренировка`
        }
      ],
      restBetweenExercises: form.restBetweenExercises,
      isPublic: false,
      createdBy: 'user'
    };
    
    try {
      // Сохранение программы в localStorage
      const savedPrograms = localStorage.getItem('programs');
      const programs = savedPrograms ? JSON.parse(savedPrograms) : [];
      localStorage.setItem('programs', JSON.stringify([...programs, newProgram]));
      
      alert('Программа успешно создана!');
      router.push('/programs');
    } catch (error) {
      console.error('Ошибка при сохранении программы:', error);
      alert('Произошла ошибка при сохранении программы. Пожалуйста, попробуйте снова.');
    }
  };
  
  return (
    <Layout title="Создание тренировочной программы" bgColor="bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-blue-600 text-white rounded-lg shadow-md mb-6 p-4">
          <h1 className="text-2xl font-bold">Создание новой программы тренировок</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Название программы *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Описание программы *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Отдых между упражнениями (сек)</label>
                <input
                  type="number"
                  name="restBetweenExercises"
                  value={form.restBetweenExercises}
                  onChange={handleInputChange}
                  min="0"
                  max="600"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
          
          {/* Список упражнений в программе */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Упражнения программы</h2>
            
            {form.exercises.length > 0 ? (
              <div className="space-y-3">
                {form.exercises.map((ex, index) => (
                  <div key={ex.id} className="flex items-center p-3 border rounded bg-gray-50 relative">
                    <div className="flex-grow">
                      <div className="font-medium">{ex.exerciseData.name}</div>
                      <div className="text-sm text-gray-600">
                        {ex.sets} подходов × {ex.exerciseData.type === 'reps' ? `${ex.reps} повторений` : `${ex.duration} сек`}
                        {ex.weight && ex.weight > 0 && ` • ${ex.weight} кг`}
                        {` • ${ex.rest} сек отдыха`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(ex.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-full ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExercise(ex.id, 'down')}
                        disabled={index === form.exercises.length - 1}
                        className={`p-1 rounded-full ${index === form.exercises.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(ex.id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded bg-gray-50">
                <p className="text-gray-500">Нет добавленных упражнений. Добавьте упражнения ниже.</p>
              </div>
            )}
          </div>
          
          {/* Выбор упражнений */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Добавить упражнения</h2>
            
            <div className="flex mb-4">
              <button
                type="button"
                onClick={toggleSelectionMode}
                className="flex-1 p-2 border-b-2 text-center font-medium transition-colors"
                style={{ borderColor: selectionMode === 'list' ? '#4f46e5' : 'transparent', color: selectionMode === 'list' ? '#4f46e5' : '#6b7280' }}
              >
                Список
              </button>
              <button
                type="button"
                onClick={toggleSelectionMode}
                className="flex-1 p-2 border-b-2 text-center font-medium transition-colors"
                style={{ borderColor: selectionMode === 'tree' ? '#4f46e5' : 'transparent', color: selectionMode === 'tree' ? '#4f46e5' : '#6b7280' }}
              >
                По группам
              </button>
            </div>
            
            {selectionMode === 'list' ? (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Поиск упражнений..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map(exercise => (
                      <div
                        key={exercise.id}
                        onClick={() => handleSelectExercise(exercise)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedExercise?.id === exercise.id ? 'bg-blue-50 border-blue-300' : ''}`}
                      >
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-gray-600">{exercise.muscleGroups.map(m => translateMuscleGroup(m)).join(', ')}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">Не найдено упражнений по вашему запросу</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Группы мышц</h3>
                  <div className="max-h-60 overflow-y-auto border rounded">
                    {muscleGroups.map(group => (
                      <div
                        key={group}
                        onClick={() => handleSelectMuscleGroup(group)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedMuscleGroup === group ? 'bg-blue-50 border-blue-300' : ''}`}
                      >
                        {translateMuscleGroup(group)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Оборудование</h3>
                  <div className="max-h-60 overflow-y-auto border rounded">
                    {equipmentTypes.map(equipment => (
                      <div
                        key={equipment}
                        onClick={() => handleSelectEquipment(equipment)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedEquipment === equipment ? 'bg-blue-50 border-blue-300' : ''}`}
                      >
                        {translateEquipment(equipment)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h3 className="font-medium mb-2">Найдено упражнений: {filteredExercises.length}</h3>
                  <div className="max-h-60 overflow-y-auto border rounded">
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map(exercise => (
                        <div
                          key={exercise.id}
                          onClick={() => handleSelectExercise(exercise)}
                          className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedExercise?.id === exercise.id ? 'bg-blue-50 border-blue-300' : ''}`}
                        >
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-gray-600">{exercise.muscleGroups.map(m => translateMuscleGroup(m)).join(', ')}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">Не найдено упражнений по вашему запросу</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {selectedExercise && exerciseDetails && (
              <div className="mt-6 border rounded p-4 bg-gray-50">
                <h3 className="font-medium mb-3">Настройка упражнения: {selectedExercise.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Количество подходов</label>
                    <input
                      type="number"
                      name="sets"
                      value={exerciseDetails.sets}
                      onChange={handleExerciseDetailChange}
                      min="1"
                      max="10"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                  </div>
                  
                  {selectedExercise.type === 'reps' ? (
                    <div>
                      <label className="block mb-1">Количество повторений</label>
                      <input
                        type="number"
                        name="reps"
                        value={exerciseDetails.reps}
                        onChange={handleExerciseDetailChange}
                        min="1"
                        max="100"
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block mb-1">Длительность (секунд)</label>
                      <input
                        type="number"
                        name="duration"
                        value={exerciseDetails.duration}
                        onChange={handleExerciseDetailChange}
                        min="5"
                        max="300"
                        step="5"
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block mb-1">Вес (кг, 0 если без веса)</label>
                    <input
                      type="number"
                      name="weight"
                      value={exerciseDetails.weight}
                      onChange={handleExerciseDetailChange}
                      min="0"
                      max="500"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Отдых между подходами (секунд)</label>
                    <input
                      type="number"
                      name="rest"
                      value={exerciseDetails.rest}
                      onChange={handleExerciseDetailChange}
                      min="0"
                      max="300"
                      step="5"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 mr-2"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Кнопки формы */}
          <div className="flex justify-between py-4 sticky bottom-0 bg-white shadow-md rounded-lg p-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 font-medium shadow-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
            >
              Создать программу
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProgram; 