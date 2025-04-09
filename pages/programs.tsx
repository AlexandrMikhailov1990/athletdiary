import { useState } from 'react';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>(SAMPLE_PROGRAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  // Фильтрация программ
  const filteredPrograms = SAMPLE_PROGRAMS.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === '' || program.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Программы тренировок</h1>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Поиск программ
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Название или описание..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Уровень подготовки
              </label>
              <select
                id="level"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Все уровни</option>
                <option value="beginner">Новичок</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Кнопка создания программы */}
        <div className="mb-8 text-right">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg"
          >
            Создать новую программу
          </button>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{program.name}</h3>
                
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mr-2">
                    {program.level === 'beginner' && 'Новичок'}
                    {program.level === 'intermediate' && 'Средний'}
                    {program.level === 'advanced' && 'Продвинутый'}
                  </span>
                  
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded mr-2">
                    {program.duration} недель
                  </span>
                  
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    {program.workoutsPerWeek} тренировок в неделю
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{program.description}</p>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1"
                  >
                    Подробнее
                  </button>
                  
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex-1"
                  >
                    Начать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Программы не найдены. Попробуйте изменить критерии поиска или создайте новую программу.</p>
          </div>
        )}
      </div>
    </div>
  );
} 