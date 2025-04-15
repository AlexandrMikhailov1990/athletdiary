import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Определение типов для безопасной работы с TypeScript
interface WorkoutSet {
  weight?: number;
  reps?: number;
  duration?: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  type: string;
  sets: number;
  completedSets: number;
  setDetails: WorkoutSet[];
  completed: boolean;
}

interface Workout {
  programId: string;
  workoutId: string;
  currentExerciseIndex: number;
  exercises: WorkoutExercise[];
}

interface HistoryItem {
  weight: number;
  reps: number;
  date: string;
}

export default function ActiveWorkout() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentSet, setCurrentSet] = useState<{weight: string; reps: string}>({ weight: '', reps: '' });
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Загружаем текущую тренировку из localStorage
    const savedWorkout = localStorage.getItem('activeWorkout');
    if (savedWorkout) {
      try {
        const parsedWorkout = JSON.parse(savedWorkout) as Workout;
        setWorkout(parsedWorkout);
        
        // Загружаем текущий сет
        const exercise = parsedWorkout.exercises[parsedWorkout.currentExerciseIndex];
        const set = exercise.setDetails[exercise.completedSets];
        
        setCurrentSet({
          weight: set.weight ? set.weight.toString() : '',
          reps: set.reps ? set.reps.toString() : ''
        });
        
        // Загружаем историю
        loadHistory(exercise.exerciseId);
      } catch (error) {
        console.error('Ошибка при загрузке тренировки:', error);
        router.push('/programs');
      }
    } else {
      router.push('/programs');
    }
  }, [router]);

  const loadHistory = (exerciseId: string) => {
    try {
      const historyData = localStorage.getItem('workoutHistory');
      if (!historyData) return;
      
      const parsedHistory = JSON.parse(historyData);
      const filteredItems: HistoryItem[] = [];
      
      // Поиск упражнения в истории
      for (const historyWorkout of parsedHistory) {
        for (const exercise of historyWorkout.exercises || []) {
          if (exercise.exerciseId === exerciseId) {
            for (const set of exercise.sets || []) {
              if (set.weight && set.reps) {
                filteredItems.push({
                  weight: set.weight,
                  reps: set.reps,
                  date: historyWorkout.date
                });
              }
            }
          }
        }
      }
      
      setHistoryItems(filteredItems);
    } catch (error) {
      console.error('Ошибка при загрузке истории:', error);
    }
  };

  const handleChange = (field: 'weight' | 'reps', value: string) => {
    // Обновляем локальное состояние
    setCurrentSet({
      ...currentSet,
      [field]: value
    });
    
    if (!workout) return;
    
    // Обновляем значения в тренировке
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[updatedWorkout.currentExerciseIndex];
    const set = exercise.setDetails[exercise.completedSets];
    
    set[field] = value ? Number(value) : undefined;
    
    // Сохраняем в localStorage
    localStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
    setWorkout(updatedWorkout);
  };

  if (!workout) {
    return <div className="p-4">Загрузка...</div>;
  }

  const exercise = workout.exercises[workout.currentExerciseIndex];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{exercise.name}</h1>
      
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl mb-4">
          Подход {exercise.completedSets + 1} из {exercise.sets}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1">Вес (кг)</label>
            <input
              type="number"
              value={currentSet.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Повторения</label>
            <input
              type="number"
              value={currentSet.reps}
              onChange={(e) => handleChange('reps', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!workout) return;
            
            // Отмечаем сет как выполненный
            const updatedWorkout = { ...workout };
            const exercise = updatedWorkout.exercises[updatedWorkout.currentExerciseIndex];
            const currentSet = exercise.setDetails[exercise.completedSets];
            
            currentSet.completed = true;
            
            // Преобразуем строковые значения в числа
            if (currentSet.weight) {
              currentSet.weight = Number(currentSet.weight);
            }
            
            if (currentSet.reps) {
              currentSet.reps = Number(currentSet.reps);
            }
            
            // Переходим к следующему сету или упражнению
            if (exercise.completedSets + 1 < exercise.sets) {
              exercise.completedSets++;
            } else {
              // Упражнение завершено
              exercise.completed = true;
              
              // Переходим к следующему упражнению
              if (updatedWorkout.currentExerciseIndex + 1 < updatedWorkout.exercises.length) {
                updatedWorkout.currentExerciseIndex++;
              } else {
                // Тренировка завершена
                alert('Тренировка завершена!');
                localStorage.removeItem('activeWorkout');
                router.push('/programs');
                return;
              }
            }
            
            // Обновляем состояние
            localStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
            setWorkout(updatedWorkout);
            
            // Обновляем текущий сет
            const newExercise = updatedWorkout.exercises[updatedWorkout.currentExerciseIndex];
            const newSet = newExercise.setDetails[newExercise.completedSets];
            
            setCurrentSet({
              weight: newSet.weight ? newSet.weight.toString() : '',
              reps: newSet.reps ? newSet.reps.toString() : ''
            });
            
            // Загружаем историю для нового упражнения
            loadHistory(newExercise.exerciseId);
          }}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Завершить подход
        </button>
      </div>
      
      {historyItems.length > 0 && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl mb-4">История подходов</h2>
          <div className="space-y-2">
            {historyItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  // Простой inline обработчик для прямого копирования данных
                  console.log('Clicked on history item:', item);
                  
                  // Обновляем локальное состояние
                  setCurrentSet({
                    weight: item.weight.toString(),
                    reps: item.reps.toString()
                  });
                  
                  // Обновляем данные в тренировке
                  if (workout) {
                    const updatedWorkout = { ...workout };
                    const exercise = updatedWorkout.exercises[updatedWorkout.currentExerciseIndex];
                    const set = exercise.setDetails[exercise.completedSets];
                    
                    set.weight = item.weight;
                    set.reps = item.reps;
                    
                    localStorage.setItem('activeWorkout', JSON.stringify(updatedWorkout));
                    setWorkout(updatedWorkout);
                    
                    // Показываем уведомление для подтверждения
                    alert(`Скопировано: ${item.reps} повт. × ${item.weight} кг`);
                  }
                }}
                className="p-3 border rounded cursor-pointer hover:bg-blue-50 active:bg-blue-100"
              >
                <div className="font-medium">{item.reps} повт. × {item.weight} кг</div>
                <div className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 