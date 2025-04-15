import React, { useState, useEffect } from 'react';

export default function ActiveWorkoutTest() {
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  
  // Тестовые данные истории
  const historyItems = [
    { weight: 10, reps: 5, date: '2023-04-10' },
    { weight: 12, reps: 8, date: '2023-04-12' },
    { weight: 15, reps: 6, date: '2023-04-15' }
  ];
  
  // Обработчик клика по элементу истории
  const handleHistoryClick = (weight: number, reps: number) => {
    console.log('Clicked on history item:', { weight, reps });
    setWeightInput(weight.toString());
    setRepsInput(reps.toString());
    
    // Показываем алерт для подтверждения, что клик работает
    alert(`Скопировано: ${reps} повт. × ${weight} кг`);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Тестовая страница активной тренировки</h1>
      
      {/* Форма ввода */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">Текущий подход</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Вес (кг)</label>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Повторения</label>
            <input
              type="number"
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Завершить подход
        </button>
      </div>
      
      {/* История подходов */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">История подходов</h2>
        <div className="space-y-2">
          {historyItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleHistoryClick(item.weight, item.reps)}
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
    </div>
  );
} 