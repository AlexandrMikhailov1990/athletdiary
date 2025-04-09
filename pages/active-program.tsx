import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SAMPLE_PROGRAMS, Program } from '../models/Program';
import type { ActiveProgram } from '../models/ActiveProgram';

export default function ActiveProgram() {
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    // Загружаем активную программу из localStorage
    const savedProgram = localStorage.getItem('activeProgram');
    if (!savedProgram) {
      router.push('/programs');
      return;
    }

    const activeProgramData = JSON.parse(savedProgram) as ActiveProgram;
    setActiveProgram(activeProgramData);

    // Находим программу по ID
    const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]') as Program[];
    const programData = [...SAMPLE_PROGRAMS, ...savedPrograms].find(p => p.id === activeProgramData.programId);
    
    if (programData) {
      setProgram(programData);
    } else {
      // Если программа не найдена, пробуем найти в активных программах
      const activePrograms = JSON.parse(localStorage.getItem('activePrograms') || '[]') as (ActiveProgram & { program: Program })[];
      const activeProgram = activePrograms.find(p => p.programId === activeProgramData.programId);
      if (activeProgram?.program) {
        setProgram(activeProgram.program);
      } else {
        // Если программа не найдена нигде, возвращаемся к списку программ
        router.push('/programs');
      }
    }
  }, [router]);

  if (!activeProgram || !program) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка программы...</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const startDate = new Date(activeProgram.startDate);
  const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">{program.name}</h1>

          {/* Прогресс программы */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Ваш прогресс</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{activeProgram.currentWeek}</div>
                <div className="text-gray-600">Неделя</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{activeProgram.currentDay}</div>
                <div className="text-gray-600">День недели</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">{daysSinceStart}</div>
                <div className="text-gray-600">Дней с начала</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {activeProgram.completedWorkouts.length}
                </div>
                <div className="text-gray-600">Завершено</div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Прогресс
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round((activeProgram.completedWorkouts.length / (program.duration * program.workoutsPerWeek)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{
                    width: `${(activeProgram.completedWorkouts.length / (program.duration * program.workoutsPerWeek)) * 100}%`
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>

          {/* Текущая тренировка */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Сегодняшняя тренировка</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Неделя {activeProgram.currentWeek}, День {activeProgram.currentDay}
              </p>
              
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold"
                onClick={() => router.push('/workout')}
              >
                Начать тренировку
              </button>
            </div>
          </div>

          {/* Кнопка отмены программы */}
          <div className="text-center">
            <button
              className="text-red-600 hover:text-red-700 font-semibold"
              onClick={() => {
                if (confirm('Вы уверены, что хотите отменить программу? Весь прогресс будет потерян.')) {
                  localStorage.removeItem('activeProgram');
                  router.push('/programs');
                }
              }}
            >
              Отменить программу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 