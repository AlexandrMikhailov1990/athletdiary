import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

// Массив подтягиваний различными хватами
const pullupExercises = [
  {
    id: '11',
    name: 'Подтягивания прямым хватом',
    description: 'Классические подтягивания прямым хватом на ширине плеч. Отлично развивает мышцы спины и бицепсы.',
    imageUrl: '/images/exercises/pullup-normal.jpg',
    muscleGroups: ['back', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 8,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '12',
    name: 'Подтягивания обратным хватом',
    description: 'Подтягивания обратным хватом (ладони к себе). Акцент смещается на бицепсы, также хорошо прорабатывает нижнюю часть широчайших мышц спины.',
    imageUrl: '/images/exercises/pullup-reverse.jpg',
    muscleGroups: ['back', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 6,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '13',
    name: 'Подтягивания широким хватом',
    description: 'Подтягивания с широким хватом акцентируют нагрузку на верхнюю и среднюю часть широчайших мышц спины, делая их более массивными и V-образными.',
    imageUrl: '/images/exercises/pullup-wide.jpg',
    muscleGroups: ['back', 'traps', 'biceps', 'forearms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 6,
    restTime: 120,
    isPublic: true,
  },
  {
    id: '14',
    name: 'Подтягивания параллельным хватом',
    description: 'Подтягивания параллельным (нейтральным) хватом снижают нагрузку на плечевые суставы и хорошо прорабатывают нижнюю часть широчайших мышц спины.',
    imageUrl: '/images/exercises/pullup-neutral.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    type: 'reps',
    reps: 7,
    restTime: 90,
    isPublic: true,
  },
  {
    id: '15',
    name: 'Подтягивания разнохватом',
    description: 'Подтягивания с одной рукой в прямом, а другой в обратном хвате. Хорошо прорабатывает широчайшие и добавляет асимметричную нагрузку для баланса.',
    imageUrl: '/images/exercises/pullup-mixed.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar'],
    difficulty: 'advanced',
    type: 'reps',
    reps: 5,
    restTime: 120,
    isPublic: true,
  },
  {
    id: '16',
    name: 'Подтягивания с весом',
    description: 'Классические подтягивания с дополнительным отягощением на поясе или между ног. Отлично увеличивает силу и мышечную массу спины.',
    imageUrl: '/images/exercises/pullup-weighted.jpg',
    muscleGroups: ['back', 'biceps', 'forearms', 'core'],
    equipment: ['pull-up bar', 'weight'],
    difficulty: 'advanced',
    type: 'reps',
    reps: 4,
    weight: 10,
    restTime: 150,
    isPublic: true,
  }
];

export default function AddPullups() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Функция для добавления упражнений в localStorage
    const addPullupExercises = () => {
      try {
        // Получаем текущие упражнения
        const existingExercises = JSON.parse(localStorage.getItem('userExercises') || '[]');
        
        // Проверяем, есть ли уже упражнения с такими ID
        const existingIds = new Set(existingExercises.map((ex: any) => ex.id));
        const newExercises = pullupExercises.filter(ex => !existingIds.has(ex.id));
        
        if (newExercises.length === 0) {
          setStatus('success');
          setMessage('Все упражнения уже добавлены в базу данных.');
          return;
        }
        
        // Добавляем новые упражнения
        const updatedExercises = [...existingExercises, ...newExercises];
        localStorage.setItem('userExercises', JSON.stringify(updatedExercises));
        
        setStatus('success');
        setMessage(`Успешно добавлено ${newExercises.length} новых упражнений с подтягиваниями.`);
      } catch (error) {
        console.error('Ошибка при добавлении упражнений:', error);
        setStatus('error');
        setMessage('Произошла ошибка при добавлении упражнений. Пожалуйста, попробуйте еще раз.');
      }
    };

    // Добавляем упражнения при загрузке страницы
    addPullupExercises();
  }, []);

  return (
    <Layout title="Добавление подтягиваний">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Добавление упражнений с подтягиваниями</h1>
          
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
              {pullupExercises.map(exercise => (
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