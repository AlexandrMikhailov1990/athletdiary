import { useState } from 'react';
import { SAMPLE_USER, User } from '../models/User';
import { SAMPLE_WORKOUT_HISTORY } from '../models/WorkoutHistory';

export default function Profile() {
  const [user, setUser] = useState<User>(SAMPLE_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email
  });

  // Обработка изменения формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменений
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email
    }));
    setIsEditing(false);
  };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Получение последних тренировок пользователя
  const recentWorkouts = SAMPLE_WORKOUT_HISTORY
    .filter(record => record.userId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Профиль пользователя</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-blue-700 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white mb-4 md:mb-0 md:mr-6">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-3xl text-gray-500">
                        {user.firstName?.[0] || user.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </h2>
                  <p className="text-blue-200">Участник с {formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formValues.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                      onClick={() => setIsEditing(false)}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-700">Имя:</h3>
                      <p className="text-lg">{user.firstName || '-'}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Фамилия:</h3>
                      <p className="text-lg">{user.lastName || '-'}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Имя пользователя:</h3>
                      <p className="text-lg">{user.username}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Email:</h3>
                      <p className="text-lg">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      onClick={() => setIsEditing(true)}
                    >
                      Редактировать профиль
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Статистика */}
          {user.stats && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Статистика тренировок</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{user.stats.totalWorkouts}</div>
                  <div className="text-gray-600">Тренировок</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{user.stats.totalExercises}</div>
                  <div className="text-gray-600">Упражнений</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{Math.round(user.stats.totalDuration / 60)}</div>
                  <div className="text-gray-600">Часов</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{user.stats.currentStreak}</div>
                  <div className="text-gray-600">Дней подряд</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Последние тренировки */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Последние тренировки</h2>
              <a href="/history" className="text-blue-600 hover:text-blue-800">
                Показать все
              </a>
            </div>
            
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map(workout => (
                  <div key={workout.id} className="border-b border-gray-200 pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-semibold text-blue-700">{workout.workoutName}</h3>
                      <span className="text-gray-500">{formatDate(workout.date)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Продолжительность: {workout.duration} мин • Упражнений: {workout.exercises.length}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">У вас пока нет записей о тренировках.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 