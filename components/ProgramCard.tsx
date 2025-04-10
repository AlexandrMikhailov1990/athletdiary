import { Program } from '../models/Program';

interface ProgramCardProps {
  program: Program;
  onSelect?: () => void;
  onStart?: () => void;
}

export default function ProgramCard({ program, onSelect, onStart }: ProgramCardProps) {
  // Функция для отображения уровня сложности на русском языке
  const getLevelLabel = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'Новичок';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">{program.name}</h3>
        
        <div className="mb-4 flex flex-wrap">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mr-2 mb-2">
            {getLevelLabel(program.level)}
          </span>
          
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded mr-2 mb-2">
            {program.durationWeeks} недель
          </span>
          
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded mb-2">
            {program.workoutsPerWeek} трен./неделю
          </span>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-2">{program.description}</p>
        
        <div className="flex space-x-3">
          {onSelect && (
            <button 
              onClick={onSelect}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Подробнее
            </button>
          )}
          
          {onStart && (
            <button 
              onClick={onStart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Начать
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 