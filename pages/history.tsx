import { useState } from 'react';
import { SAMPLE_WORKOUT_HISTORY, WorkoutRecord } from '../models/WorkoutHistory';

export default function WorkoutHistory() {
  const [history, setHistory] = useState<WorkoutRecord[]>(SAMPLE_WORKOUT_HISTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Фильтрация и сортировка истории тренировок
  const filteredHistory = [...SAMPLE_WORKOUT_HISTORY]
    .filter(record => 
      record.workoutName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()))
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
        
        {/* Кнопка добавления тренировки */}
        <div className="mb-8 text-right">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg"
          >
            Добавить тренировку
          </button>
        </div>
        
        {/* История тренировок */}
        <div className="space-y-4">
          {filteredHistory.map(record => (
            <div key={record.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-800">{record.workoutName}</h3>
                <div className="text-gray-500">{formatDate(record.date)}</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700">Продолжительность:</span>
                  <span className="text-lg">{record.duration} мин</span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700">Рейтинг:</span>
                  {renderRating(record.rating)}
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700">Упражнений:</span>
                  <span className="text-lg">{record.exercises.length}</span>
                </div>
              </div>
              
              {record.notes && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Заметки:</span>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{record.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded">
                  Подробнее
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded">
                  Редактировать
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Записи не найдены. Попробуйте изменить критерии поиска или добавьте новую тренировку.</p>
          </div>
        )}
      </div>
    </div>
  );
} 