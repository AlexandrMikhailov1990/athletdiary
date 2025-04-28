/**
 * Функции для работы с API истории тренировок и избранного
 */

// Получение истории тренировок с сервера
export async function fetchWorkoutHistory() {
  try {
    // Сначала пробуем получить данные с сервера
    const res = await fetch('/api/user/history');
    
    if (res.ok) {
      const data = await res.json();
      
      // Обновляем локальное хранилище
      if (typeof window !== 'undefined') {
        localStorage.setItem('workoutHistory', JSON.stringify(data));
      }
      
      return data;
    } else {
      // Если сервер недоступен, используем локальные данные
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      }
      return [];
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
    // Сперва сохраняем в локальное хранилище
    const workouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    workouts.push(workout);
    localStorage.setItem('workoutHistory', JSON.stringify(workouts));
    
    // Преобразуем формат данных для сервера
    const serverWorkoutData = {
      date: workout.date,
      programId: workout.programId,
      programName: workout.programName,
      workoutId: workout.workoutId,
      workoutName: workout.workoutName,
      exercises: workout.exercises.map((ex: any) => ({
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
      notes: workout.notes || '',
      rating: workout.rating || 0
    };
    
    // Затем отправляем на сервер
    const res = await fetch('/api/user/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverWorkoutData)
    });
    
    if (!res.ok) {
      console.error('Failed to save workout to server:', await res.json());
    }
    
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