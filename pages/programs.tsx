import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import { SAMPLE_ACTIVE_PROGRAM, ActiveProgram } from '../models/ActiveProgram';

export default function Programs() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>(SAMPLE_PROGRAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  // Загрузка программ из localStorage при монтировании
  useEffect(() => {
    const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
    setPrograms([...SAMPLE_PROGRAMS, ...savedPrograms]);
  }, []);

  // Фильтрация программ
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === '' || program.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  // Функция для запуска программы
  const startProgram = (program: Program) => {
    // Создаем новую активную программу
    const newActiveProgram: ActiveProgram = {
      programId: program.id,
      userId: 'user', // В реальном приложении здесь будет ID текущего пользователя
      startDate: new Date().toISOString(),
      currentWeek: 1,
      currentDay: 1,
      completedWorkouts: []
    };
    
    // Сохраняем активную программу в localStorage
    localStorage.setItem('activeProgram', JSON.stringify(newActiveProgram));
    
    // Сохраняем полную информацию о программе
    const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]');
    activePrograms.push({
      ...newActiveProgram,
      program: program // Сохраняем полную информацию о программе
    });
    localStorage.setItem('activePrograms', JSON.stringify(activePrograms));
    
    // Перенаправляем на страницу активной программы
    router.push('/active-program');
  };

  // Функция для просмотра деталей программы
  const viewProgramDetails = (programId: string) => {
    router.push(`/programs/${programId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Программы тренировок</h1>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Поиск программ
              </label>
              <input
                type="text"
                id="search"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Название или описание..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Уровень подготовки
              </label>
              <select
                id="level"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
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
            className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 rounded-lg transition-colors duration-200 font-medium"
            onClick={() => router.push('/programs/create')}
          >
            Создать новую программу
          </button>
        </div>
        
        {/* Результаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">{program.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {program.level === 'beginner' && 'Новичок'}
                      {program.level === 'intermediate' && 'Средний'}
                      {program.level === 'advanced' && 'Продвинутый'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {program.duration} недель
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {program.workoutsPerWeek} тр/нед
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 h-[4.5rem] overflow-hidden">
                    {program.description}
                  </p>
                </div>
                
                <div className="flex gap-3 mt-auto pt-4">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => viewProgramDetails(program.id)}
                  >
                    Подробнее
                  </button>
                  
                  <button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => startProgram(program)}
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