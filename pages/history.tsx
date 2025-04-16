import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { WorkoutRecord } from '../models/WorkoutHistory';
import ContinueWorkoutButton from '../components/ContinueWorkoutButton';

// Функция для склонения слов в зависимости от числа
const getNounForm = (number: number, forms: [string, string, string]): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)];
  return forms[index];
};

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
        <h1 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          История тренировок
        </h1>
        
        {/* Кнопка продолжения тренировки */}
        <div className="flex justify-center mb-6">
          <ContinueWorkoutButton />
        </div>
        
        {/* Фильтры и сортировка */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Название или заметки..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Сортировать по
            </label>
            <div className="relative">
              <select
                id="sortBy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none pr-10"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              >
                <option value="date">Дате</option>
                <option value="rating">Рейтингу</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Порядок
            </label>
            <div className="relative">
              <select
                id="sortOrder"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none pr-10"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <span className="text-gray-600 mr-2 flex items-center">
            <svg className="w-5 h-5 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Показано:
          </span>
          <span className="font-semibold text-blue-800">{filteredHistory.length} {getNounForm(filteredHistory.length, ['тренировка', 'тренировки', 'тренировок'])}</span>
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
                        {(exercise?.name || exercise?.exercise?.name) || 'Без названия'}
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
                              {(!set?.weight || set.weight === 0 || isNaN(Number(set.weight))) && 
                               (!set?.reps || set.reps === 0 || isNaN(Number(set.reps))) && 
                               (!set?.duration || set.duration === 0 || isNaN(Number(set.duration))) && 
                               'Выполнено'}
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