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

// Сохранение записи тренировки в историю
export const saveWorkoutToHistory = async (workoutRecord: any): Promise<boolean> => {
  try {
    // Делаем запрос к API
    const response = await fetch('/api/workout/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutRecord),
    });

    const data = await response.json();
    
    // Проверяем успешность запроса
    if (response.ok && data.success) {
      console.log('История тренировки успешно сохранена на сервере', data);
      return true;
    } else {
      console.error('Ошибка при сохранении истории тренировки:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса на сохранение истории:', error);
    return false;
  }
};

// Получение истории тренировок пользователя
export const getWorkoutHistory = async (): Promise<any[]> => {
  try {
    // Делаем запрос к API
    const response = await fetch('/api/workout/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Ошибка при получении истории тренировок:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при отправке запроса на получение истории тренировок:', error);
    return [];
  }
};

// Синхронизация истории тренировок между локальным хранилищем и сервером
export const syncWorkoutHistory = async (): Promise<void> => {
  try {
    // Получаем историю тренировок с сервера
    const serverHistory = await getWorkoutHistory();
    
    // Получаем локальную историю тренировок
    const localHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    // Создаем объединенную историю, удаляя дубликаты
    const mergedHistory = [...serverHistory];
    
    // Проверяем локальные записи, которых нет на сервере
    for (const localRecord of localHistory) {
      // Проверяем, есть ли эта запись уже на сервере
      const existsOnServer = serverHistory.some(
        serverRecord => serverRecord.id === localRecord.id
      );
      
      // Если записи нет на сервере - добавляем в список для сохранения
      if (!existsOnServer) {
        await saveWorkoutToHistory(localRecord);
        mergedHistory.push(localRecord);
      }
    }
    
    // Обновляем локальное хранилище объединенной историей
    localStorage.setItem('workoutHistory', JSON.stringify(mergedHistory));
    
    console.log('История тренировок успешно синхронизирована');
  } catch (error) {
    console.error('Ошибка при синхронизации истории тренировок:', error);
  }
};

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