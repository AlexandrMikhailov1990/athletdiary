import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Program } from '../models/Program';

interface ProgramCardProps {
  program: Program;
  onStart?: (program: Program) => void;
  onEdit?: (program: Program) => void;
  onDelete?: (programId: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onStart, onEdit, onDelete }) => {
  // Получаем количество упражнений во всех тренировках
  const exerciseCount = program.workouts.reduce((acc, workout) => {
    return acc + (workout.exercises?.length || 0);
  }, 0);
  
  // Получаем количество дней тренировок
  const daysCount = program.workouts.length;

  // --- Избранное ---
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
    setIsFavorite(favorites.includes(program.id));
  }, [program.id]);

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem('favoritePrograms') || '[]');
    if (!favorites.includes(program.id)) {
      favorites.push(program.id);
      localStorage.setItem('favoritePrograms', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white relative group flex flex-col h-full">
      <Link href={`/programs/${program.id}`} className="block p-4 flex-1">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">{program.name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
        
        <div className="flex flex-wrap gap-2 text-sm mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {exerciseCount} упражнений
          </span>
          
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {daysCount} {daysCount === 1 ? 'день' : daysCount < 5 ? 'дня' : 'дней'}
          </span>
        </div>
      </Link>
      <button
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium border transition ${
          isFavorite
            ? 'bg-yellow-300 text-yellow-900 border-yellow-400'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-yellow-100'
        }`}
        onClick={handleAddToFavorites}
        disabled={isFavorite}
        title={isFavorite ? 'В избранном' : 'Добавить в избранное'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      {(onStart || onEdit || onDelete) && (
        <div className="flex gap-1 justify-end p-2 border-t bg-gray-50">
          {onStart && (
            <button
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition"
              onClick={e => { e.stopPropagation(); e.preventDefault(); onStart(program); }}
              title="Начать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              Начать
            </button>
          )}
          {onEdit && (
            <button
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-400 hover:bg-yellow-500 text-white transition"
              onClick={e => { e.stopPropagation(); e.preventDefault(); onEdit(program); }}
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          )}
          {onDelete && (
            <button
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition"
              onClick={e => { e.stopPropagation(); e.preventDefault(); onDelete(program.id); }}
              title="Удалить"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramCard; 