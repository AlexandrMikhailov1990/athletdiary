import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

// Массив упражнений с гирей
const kettlebellExercises = [
  {
    id: '20',
    name: 'Махи гирей (свинг)',
    description: 'Базовое упражнение с гирей, которое задействует всё тело с акцентом на ягодицы, заднюю поверхность бедра и кор.',
    muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
    equipment: ['kettlebell'],
    difficulty: 'beginner',
    type: 'reps',
    reps: 15,
    restTime: 60,
    isPublic: true,
  },
  {
    id: '21',
    name: 'Турецкий подъем',
    description: 'Комплексное упражнение с гирей, помогающее развить координацию, баланс и силу кора. Упражнение выполняется из положения лежа в положение стоя с гирей.',
    muscleGroups: ['shoulders', 'core', 'legs', 'arms'],
    equipment: ['kettlebell'],
    difficulty: 'advanced',
    type: 'reps',
    reps: 5,
    restTime: 120,
    isPublic: true,
  },
  {
    id: '22',
    name: 'Рывок гири',
    description: 'Мощное упражнение, которое развивает взрывную силу и выносливость. Гиря из положения между ног выполняет траекторию вверх до полного выпрямления руки.',
    muscleGroups: ['shoulders', 'back', 'legs', 'core'],
    equipment: ['kettlebell'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 10,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '23',
    name: 'Приседания с гирей',
    description: 'Приседания с гирей, удерживаемой у груди или в вытянутых руках перед собой. Отлично прорабатывает ноги и стабилизирующие мышцы.',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    equipment: ['kettlebell'],
    difficulty: 'beginner',
    type: 'reps',
    reps: 12,
    restTime: 60,
    isPublic: true,
  },
  {
    id: '24',
    name: 'Жим гири стоя',
    description: 'Упражнение для плеч и рук с гирей. Гиря выжимается над головой из положения у плеча.',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['kettlebell'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 8,
    restTime: 60,
    isPublic: true,
  },
  {
    id: '25',
    name: 'Тяга гири к подбородку',
    description: 'Упражнение для плеч и верхней части спины. Гиря поднимается вдоль тела до уровня подбородка.',
    muscleGroups: ['shoulders', 'traps', 'biceps'],
    equipment: ['kettlebell'],
    difficulty: 'beginner',
    type: 'reps',
    reps: 12,
    restTime: 60,
    isPublic: true,
  },
  {
    id: '26',
    name: 'Мельница с гирей',
    description: 'Упражнение для укрепления боковых мышц корпуса. С гирей в одной руке выполняется наклон корпуса к противоположной ноге.',
    muscleGroups: ['core', 'obliques', 'shoulders', 'hamstrings'],
    equipment: ['kettlebell'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 8,
    restTime: 60,
    isPublic: true,
  }
];

export default function AddKettlebellExercises() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Функция для добавления упражнений в localStorage
    const addKettlebellExercises = () => {
      try {
        // Получаем текущие упражнения
        const existingExercises = JSON.parse(localStorage.getItem('userExercises') || '[]');
        
        // Проверяем, есть ли уже упражнения с такими ID
        const existingIds = new Set(existingExercises.map((ex: any) => ex.id));
        const newExercises = kettlebellExercises.filter(ex => !existingIds.has(ex.id));
        
        if (newExercises.length === 0) {
          setStatus('success');
          setMessage('Все упражнения с гирей уже добавлены в базу данных.');
          return;
        }
        
        // Добавляем новые упражнения
        const updatedExercises = [...existingExercises, ...newExercises];
        localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
        
        setStatus('success');
        setMessage(`Успешно добавлено ${newExercises.length} упражнений с гирей.`);
      } catch (error) {
        console.error('Ошибка при добавлении упражнений:', error);
        setStatus('error');
        setMessage('Произошла ошибка при добавлении упражнений. Пожалуйста, попробуйте еще раз.');
      }
    };

    // Добавляем упражнения при загрузке страницы
    addKettlebellExercises();
  }, []);

  return (
    <Layout title="Добавление упражнений с гирей">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Добавление упражнений с гирей</h1>
          
          {status === 'pending' && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
              <p>Добавление упражнений...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              <p className="text-center">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              <p className="text-center">{message}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Добавленные упражнения:</h2>
            <ul className="space-y-3">
              {kettlebellExercises.map(exercise => (
                <li key={exercise.id} className="border rounded-lg p-3">
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">Сложность:</span> {exercise.difficulty} | 
                    <span className="font-medium"> Подходы:</span> {exercise.reps} повторений × {exercise.restTime} сек отдыха
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => router.push('/exercises')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Перейти к упражнениям
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 