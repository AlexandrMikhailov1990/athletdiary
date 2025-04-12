import React from 'react';
import Link from 'next/link';
import { Program } from '../models/Program';

interface ProgramCardProps {
  program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  // Получаем количество упражнений во всех тренировках
  const exerciseCount = program.workouts.reduce((acc, workout) => {
    return acc + (workout.exercises?.length || 0);
  }, 0);
  
  // Получаем количество дней тренировок
  const daysCount = program.workouts.length;

  return (
    <Link href={`/programs/${program.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">{program.name}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {exerciseCount} упражнений
            </span>
            
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {daysCount} {daysCount === 1 ? 'день' : daysCount < 5 ? 'дня' : 'дней'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProgramCard; 