import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Exercise, normalizeExerciseImageUrls, NORMALIZED_SAMPLE_EXERCISES } from '../../models/Exercise';

// Интерфейс для формы создания/редактирования упражнения
interface ExerciseForm {
  id: string;
  name: string;
  type: 'reps' | 'timed';
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  restTime: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  recommendations: string[];
  imageUrl?: string;
}

export default function ManageExercises() {
  const router = useRouter();
  const { action, id } = router.query;
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  
  const [form, setForm] = useState<ExerciseForm>({
    id: '',
    name: '',
    type: 'reps',
    sets: 3,
    reps: 10,
    restTime: 60,
    description: '',
    difficulty: 'beginner',
    muscleGroups: [],
    equipment: [],
    recommendations: []
  });

  // Список всех доступных групп мышц
  const allMuscleGroups = [
    { id: 'chest', name: 'Грудь' },
    { id: 'back', name: 'Спина' },
    { id: 'shoulders', name: 'Плечи' },
    { id: 'biceps', name: 'Бицепс' },
    { id: 'triceps', name: 'Трицепс' },
    { id: 'forearms', name: 'Предплечья' },
    { id: 'abs', name: 'Пресс' },
    { id: 'core', name: 'Кор' },
    { id: 'quads', name: 'Квадрицепсы' },
    { id: 'hamstrings', name: 'Бицепс бедра' },
    { id: 'glutes', name: 'Ягодицы' },
    { id: 'calves', name: 'Икры' },
    { id: 'traps', name: 'Трапеции' },
    { id: 'lats', name: 'Широчайшие' },
    { id: 'lower_back', name: 'Нижняя часть спины' },
    { id: 'legs', name: 'Ноги' }
  ];

  // Список доступного оборудования
  const allEquipment = [
    { id: 'barbell', name: 'Штанга' },
    { id: 'dumbbell', name: 'Гантели' },
    { id: 'kettlebell', name: 'Гиря' },
    { id: 'resistance bands', name: 'Резиновые петли' },
    { id: 'pull-up bar', name: 'Турник' },
    { id: 'bench', name: 'Скамья' },
    { id: 'stability ball', name: 'Фитбол' },
    { id: 'medicine ball', name: 'Медбол' },
    { id: 'cable machine', name: 'Тросовый тренажер' },
    { id: 'squat rack', name: 'Силовая рама' },
    { id: 'bodyweight', name: 'Собственный вес' },
    { id: 'treadmill', name: 'Беговая дорожка' },
    { id: 'exercise bike', name: 'Велотренажер' },
    { id: 'elliptical', name: 'Эллиптический тренажер' },
    { id: 'rowing machine', name: 'Гребной тренажер' }
  ];
  
  // Загрузка упражнений из localStorage
  useEffect(() => {
    const loadExercises = () => {
      setIsLoading(true);
      try {
        const savedExercises = localStorage.getItem('userExercises');
        const parsedExercises = savedExercises 
          ? JSON.parse(savedExercises) 
          : NORMALIZED_SAMPLE_EXERCISES;
        
        setExercises(parsedExercises);
      } catch (error) {
        console.error('Ошибка при загрузке упражнений:', error);
        setExercises(NORMALIZED_SAMPLE_EXERCISES);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExercises();
  }, []);
  
  // Загрузка упражнения для редактирования при изменении параметров URL
  useEffect(() => {
    if (action === 'edit' && id && !isLoading) {
      const exerciseToEdit = exercises.find(ex => ex.id === id);
      if (exerciseToEdit) {
        setIsEditing(true);
        setForm({
          id: exerciseToEdit.id,
          name: exerciseToEdit.name,
          type: exerciseToEdit.type,
          sets: exerciseToEdit.sets || 3,
          reps: exerciseToEdit.reps,
          duration: exerciseToEdit.duration,
          weight: exerciseToEdit.weight,
          restTime: exerciseToEdit.restTime || 60,
          description: exerciseToEdit.description || '',
          difficulty: exerciseToEdit.difficulty,
          muscleGroups: exerciseToEdit.muscleGroups || [],
          equipment: exerciseToEdit.equipment || [],
          recommendations: exerciseToEdit.recommendations || [],
          imageUrl: exerciseToEdit.imageUrl || exerciseToEdit.image
        });
        setSelectedMuscles(exerciseToEdit.muscleGroups || []);
        setSelectedEquipment(exerciseToEdit.equipment || []);
      }
    }
  }, [action, id, exercises, isLoading]);
  
  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Для числовых полей преобразуем значение в число
    if (['sets', 'reps', 'duration', 'weight', 'restTime'].includes(name)) {
      setForm(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Обработчик добавления/удаления группы мышц
  const handleMuscleGroupToggle = (muscleId: string) => {
    setSelectedMuscles(prev => {
      const isSelected = prev.includes(muscleId);
      
      // Если группа мышц уже выбрана, удаляем ее
      if (isSelected) {
        return prev.filter(m => m !== muscleId);
      }
      
      // Иначе добавляем
      return [...prev, muscleId];
    });
    
    setForm(prev => ({
      ...prev,
      muscleGroups: selectedMuscles.includes(muscleId)
        ? prev.muscleGroups.filter(m => m !== muscleId)
        : [...prev.muscleGroups, muscleId]
    }));
  };
  
  // Обработчик добавления/удаления оборудования
  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => {
      const isSelected = prev.includes(equipmentId);
      
      if (isSelected) {
        return prev.filter(e => e !== equipmentId);
      }
      
      return [...prev, equipmentId];
    });
    
    setForm(prev => ({
      ...prev,
      equipment: selectedEquipment.includes(equipmentId)
        ? prev.equipment.filter(e => e !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };
  
  // Обработчик добавления рекомендации
  const handleAddRecommendation = () => {
    const newRecommendation = prompt('Введите рекомендацию:');
    if (newRecommendation && newRecommendation.trim()) {
      setForm(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, newRecommendation.trim()]
      }));
    }
  };
  
  // Обработчик удаления рекомендации
  const handleRemoveRecommendation = (index: number) => {
    setForm(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index)
    }));
  };
  
  // Сохранение нового или отредактированного упражнения
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем новое упражнение на основе формы
    const newExercise: Exercise = {
      id: form.id || Date.now().toString(),
      name: form.name,
      type: form.type,
      sets: form.sets,
      description: form.description,
      difficulty: form.difficulty,
      muscleGroups: selectedMuscles,
      restTime: form.restTime,
      equipment: selectedEquipment,
      recommendations: form.recommendations,
      ...(form.imageUrl && { imageUrl: form.imageUrl, image: form.imageUrl }),
      ...(form.type === 'reps' && { reps: form.reps }),
      ...(form.type === 'timed' && { duration: form.duration }),
      ...(form.weight && { weight: form.weight })
    };
    
    // Нормализуем URL изображений
    const normalizedExercise = normalizeExerciseImageUrls(newExercise);
    
    // Обновляем список упражнений
    let updatedExercises: Exercise[];
    
    if (isEditing) {
      // Если редактируем существующее упражнение, заменяем его
      updatedExercises = exercises.map(ex => 
        ex.id === normalizedExercise.id ? normalizedExercise : ex
      );
    } else {
      // Иначе добавляем новое
      updatedExercises = [...exercises, normalizedExercise];
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
    
    // Обновляем состояние
    setExercises(updatedExercises);
    
    // Возвращаемся на список упражнений
    router.push('/exercises');
  };
  
  // Удаление упражнения
  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm('Вы уверены, что хотите удалить это упражнение?')) {
      const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
      localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
      setExercises(updatedExercises);
    }
  };
  
  // Отмена редактирования
  const handleCancel = () => {
    router.push('/exercises');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          {isEditing ? 'Редактирование упражнения' : 'Создание нового упражнения'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Название упражнения*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Тип упражнения*
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="reps">На повторения (силовое)</option>
                  <option value="timed">На время (кардио)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Сложность*
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Начинающий</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
                  Количество подходов*
                </label>
                <input
                  type="number"
                  id="sets"
                  name="sets"
                  value={form.sets}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {form.type === 'reps' ? (
                <>
                  <div>
                    <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
                      Повторений*
                    </label>
                    <input
                      type="number"
                      id="reps"
                      name="reps"
                      value={form.reps || ''}
                      onChange={handleInputChange}
                      required={form.type === 'reps'}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Рекомендуемый вес (кг)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={form.weight || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Продолжительность (секунды)*
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={form.duration || ''}
                    onChange={handleInputChange}
                    required={form.type === 'timed'}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="restTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Отдых между подходами (секунды)*
                </label>
                <input
                  type="number"
                  id="restTime"
                  name="restTime"
                  value={form.restTime}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL изображения
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={form.imageUrl || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            {/* Описание */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание упражнения*
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Группы мышц */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Целевые группы мышц*
              </label>
              <div className="flex flex-wrap gap-2">
                {allMuscleGroups.map(muscle => (
                  <button
                    key={muscle.id}
                    type="button"
                    onClick={() => handleMuscleGroupToggle(muscle.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedMuscles.includes(muscle.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {muscle.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Оборудование */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Необходимое оборудование
              </label>
              <div className="flex flex-wrap gap-2">
                {allEquipment.map(equipment => (
                  <button
                    key={equipment.id}
                    type="button"
                    onClick={() => handleEquipmentToggle(equipment.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedEquipment.includes(equipment.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {equipment.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Рекомендации */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Рекомендации по выполнению
                </label>
                <button
                  type="button"
                  onClick={handleAddRecommendation}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Добавить рекомендацию
                </button>
              </div>
              <div className="space-y-2">
                {form.recommendations.length === 0 ? (
                  <p className="text-gray-500 text-sm">Нет рекомендаций</p>
                ) : (
                  form.recommendations.map((rec, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{rec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecommendation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Удалить
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Кнопки */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Отмена
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleDeleteExercise(form.id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Удалить
                </button>
              )}
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {isEditing ? 'Сохранить изменения' : 'Создать упражнение'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 