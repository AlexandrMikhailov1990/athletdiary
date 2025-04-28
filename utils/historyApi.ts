/**
 * Функции для работы с API истории тренировок и избранного
 */

// Получение истории тренировок с сервера
export async function fetchWorkoutHistory() {
  try {
    // Получаем локальные данные
    const localWorkouts = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('workoutHistory') || '[]') 
      : [];
    
    // Пробуем получить данные с сервера
    const res = await fetch('/api/user/history');
    
    if (res.ok) {
      const serverData = await res.json();
      
      // Объединяем данные с сервера и локальные данные
      // Используем Map с id в качестве ключа для избежания дубликатов
      const workoutsMap = new Map();
      
      // Сначала добавляем данные с сервера
      serverData.forEach((workout: any) => {
        workoutsMap.set(workout.id, workout);
      });
      
      // Затем добавляем локальные данные, которых нет на сервере
      localWorkouts.forEach((workout: any) => {
        if (!workoutsMap.has(workout.id)) {
          workoutsMap.set(workout.id, workout);
        }
      });
      
      // Преобразуем Map обратно в массив
      const combinedWorkouts = Array.from(workoutsMap.values());
      
      // Сортируем по дате (от новых к старым)
      combinedWorkouts.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Обновляем локальное хранилище
      if (typeof window !== 'undefined') {
        localStorage.setItem('workoutHistory', JSON.stringify(combinedWorkouts));
      }
      
      return combinedWorkouts;
    } else {
      console.warn('Не удалось получить историю тренировок с сервера:', res.status);
      return localWorkouts;
    }
  } catch (error) {
    console.error('Error fetching workout history:', error);
    // В случае ошибки используем локальные данные
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    }
    return [];
  }
}

// Сохранение тренировки в историю
export async function saveWorkoutToHistory(workout: any) {
  try {
    // Генерируем уникальный ID для тренировки, если его нет
    const workoutToSave = {
      ...workout,
      id: workout.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Сперва сохраняем в локальное хранилище
    const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    // Проверяем, не существует ли уже тренировка с таким ID
    const existingIndex = workouts.findIndex((w: any) => w.id === workoutToSave.id);
    if (existingIndex >= 0) {
      // Заменяем существующую запись
      workouts[existingIndex] = workoutToSave;
    } else {
      // Добавляем новую запись
      workouts.push(workoutToSave);
    }
    
    // Сортируем по дате (от новых к старым)
    workouts.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    localStorage.setItem('workoutHistory', JSON.stringify(workouts));
    
    // Преобразуем формат данных для сервера
    const serverWorkoutData = {
      id: workoutToSave.id,
      date: workoutToSave.date,
      programId: workoutToSave.programId,
      programName: workoutToSave.programName,
      workoutId: workoutToSave.workoutId,
      workoutName: workoutToSave.workoutName,
      exercises: workoutToSave.exercises.map((ex: any) => ({
        exerciseId: ex.exerciseId,
        name: ex.name || ex.exercise?.name,
        sets: ex.sets || ex.exercise?.sets || ex.setDetails?.length || 0,
        reps: ex.reps || ex.exercise?.reps,
        weight: ex.weight || ex.exercise?.weight,
        duration: ex.duration || ex.exercise?.duration,
        restTime: ex.restTime || ex.exercise?.restTime,
        muscleGroups: ex.muscleGroups || ex.exercise?.muscleGroups || [],
        note: ex.note || ''
      })),
      notes: workoutToSave.notes || '',
      rating: workoutToSave.rating || 0
    };
    
    // Затем отправляем на сервер с повторными попытками
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const res = await fetch('/api/user/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serverWorkoutData)
        });
        
        if (res.ok) {
          console.log('Тренировка успешно сохранена на сервере');
          // После успешного сохранения на сервере возвращаем true
          return true;
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
          console.error(`Попытка ${attempts + 1}/${maxAttempts}: Не удалось сохранить тренировку на сервере:`, errorData);
          
          // Если ошибка 401 (не авторизован), прекращаем попытки
          if (res.status === 401) {
            console.error('Пользователь не авторизован. Дальнейшие попытки не будут выполнены.');
            break;
          }
        }
      } catch (error) {
        console.error(`Попытка ${attempts + 1}/${maxAttempts}: Ошибка при сохранении тренировки:`, error);
      }
      
      // Увеличиваем счетчик попыток
      attempts++;
      
      // Если это не последняя попытка, делаем паузу перед следующей
      if (attempts < maxAttempts) {
        // Экспоненциальное увеличение времени ожидания между попытками
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
      }
    }
    
    // Даже если сохранение на сервере не удалось, возвращаем true
    // поскольку данные сохранены локально
    return true;
  } catch (error) {
    console.error('Error saving workout history:', error);
    return false;
  }
}

// Удаление тренировки из истории
export async function deleteWorkoutFromHistory(workoutId: string | number) {
  try {
    // Удаляем из локального хранилища
    const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const updatedWorkouts = workouts.filter((w: any) => w.id !== workoutId);
    localStorage.setItem('workoutHistory', JSON.stringify(updatedWorkouts));
    
    // Удаляем с сервера
    const res = await fetch(`/api/user/history?id=${workoutId}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      console.error('Failed to delete workout from server:', await res.json());
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
}

// Получение избранных программ
export async function fetchFavoritePrograms() {
  try {
    // Сначала пробуем получить данные с сервера
    const res = await fetch('/api/user/favorites');
    
    if (res.ok) {
      const { favorites } = await res.json();
      
      // Обновляем локальное хранилище
      if (typeof window !== 'undefined' && Array.isArray(favorites)) {
        localStorage.setItem('favoritePrograms', JSON.stringify(favorites));
      }
      
      return favorites || [];
    } else {
      // Если сервер недоступен, используем локальные данные
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching favorite programs:', error);
    
    // В случае ошибки используем локальные данные
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
    }
    return [];
  }
}

// Синхронизация избранных программ
export async function syncFavoritePrograms(favorites: string[]) {
  try {
    // Сохраняем в локальное хранилище
    localStorage.setItem('favoritePrograms', JSON.stringify(favorites));
    
    // Отправляем на сервер
    const res = await fetch('/api/user/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favorites })
    });
    
    if (!res.ok) {
      console.error('Failed to sync favorites with server:', await res.json());
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing favorites:', error);
    return false;
  }
} 