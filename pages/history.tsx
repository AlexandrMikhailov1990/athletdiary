import { useState, useEffect } from 'react';
import { WorkoutRecord } from '../models/WorkoutHistory';

export default function WorkoutHistory() {
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Загружаем историю тренировок из localStorage
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Фильтрация и сортировка истории тренировок
  const filteredHistory = [...history]
    .filter(record => 
      (record?.workoutName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (record?.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }
    });

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Отображение рейтинга в виде звезд
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">История тренировок</h1>
        
        {/* Фильтры и сортировка */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Поиск
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Название или заметки..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Сортировать по
              </label>
              <select
                id="sortBy"
                className="w-full p-2 border border-gray-300 rounded"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              >
                <option value="date">Дате</option>
                <option value="rating">Рейтингу</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Порядок
              </label>
              <select
                id="sortOrder"
                className="w-full p-2 border border-gray-300 rounded"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* История тренировок */}
        <div className="space-y-6">
          {filteredHistory.map(record => (
            <div key={record.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-800">{record.workoutName || 'Без названия'}</h3>
                <div className="text-gray-500">{formatDate(record.date)}</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <span className="block text-sm font-medium text-gray-700">Продолжительность:</span>
                  <span className="text-lg">{record.duration || 0} мин</span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700">Рейтинг:</span>
                  {renderRating(record.rating)}
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700">Упражнений:</span>
                  <span className="text-lg">{record.exercises?.length || 0}</span>
                </div>
              </div>

              {/* Детали упражнений */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Выполненные упражнения:</h4>
                <div className="space-y-4">
                  {record.exercises?.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">
                        {exercise?.name || exercise?.exercise?.name || 'Без названия'}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {exercise?.sets?.map((set, setIndex) => (
                          <div key={setIndex} className="bg-white p-3 rounded border border-gray-200">
                            <div className="text-sm text-gray-600">Подход {setIndex + 1}:</div>
                            <div className="font-medium">
                              {set?.weight && set.weight > 0 && `${set.weight} кг`}
                              {set?.weight && set.weight > 0 && set?.reps && set.reps > 0 && ' × '}
                              {set?.reps && set.reps > 0 && `${set.reps} повторений`}
                              {set?.duration && set.duration > 0 && `${set.duration} сек`}
                              {!set?.weight && (!set?.reps || set.reps === 0) && (!set?.duration || set.duration === 0) && 'Выполнено'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {record.notes && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Заметки:</span>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">История тренировок пуста. Начните тренироваться, чтобы увидеть здесь свои результаты.</p>
          </div>
        )}
      </div>
    </div>
  );
} 