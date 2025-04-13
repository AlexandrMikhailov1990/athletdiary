import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { KETTLEBELL_DAILY_PROGRAM } from '../models/KettlebellProgram';
import { YOGA_BACK_PROGRAM } from '../models/YogaProgram';

const UpdatePrograms = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [updated, setUpdated] = useState<string[]>([]);
  
  const updateAllPrograms = () => {
    setMessage('Обновление программ...');
    const updatedPrograms: string[] = [];
    
    // Обновление программы с гирей
    try {
      // Проверяем оба возможных ключа хранилища
      const userPrograms = localStorage.getItem('userPrograms');
      const savedPrograms = localStorage.getItem('programs');
      
      // Обрабатываем ключ 'userPrograms'
      if (userPrograms) {
        const programs = JSON.parse(userPrograms);
        
        // Найти существующую программу с гирей по ID или имени
        const existingProgramIndex = programs.findIndex(
          (p: any) => p.id === KETTLEBELL_DAILY_PROGRAM.id || p.name === KETTLEBELL_DAILY_PROGRAM.name
        );
        
        if (existingProgramIndex !== -1) {
          // Обновить существующую программу
          programs[existingProgramIndex] = KETTLEBELL_DAILY_PROGRAM;
          updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (userPrograms)`);
        } else {
          // Добавить новую программу
          programs.push(KETTLEBELL_DAILY_PROGRAM);
          updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (userPrograms)`);
        }
        
        localStorage.setItem('userPrograms', JSON.stringify(programs));
      }
      
      // Обрабатываем ключ 'programs'
      if (savedPrograms) {
        const programs = JSON.parse(savedPrograms);
        
        // Найти существующую программу с гирей по ID или имени
        const existingProgramIndex = programs.findIndex(
          (p: any) => p.id === KETTLEBELL_DAILY_PROGRAM.id || p.name === KETTLEBELL_DAILY_PROGRAM.name
        );
        
        if (existingProgramIndex !== -1) {
          // Обновить существующую программу
          programs[existingProgramIndex] = KETTLEBELL_DAILY_PROGRAM;
          updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (programs)`);
        } else {
          // Добавить новую программу
          programs.push(KETTLEBELL_DAILY_PROGRAM);
          updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (programs)`);
        }
        
        localStorage.setItem('programs', JSON.stringify(programs));
      }
      
      // Если ни один из ключей не существует, создаем новое хранилище
      if (!userPrograms && !savedPrograms) {
        localStorage.setItem('programs', JSON.stringify([KETTLEBELL_DAILY_PROGRAM]));
        updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (programs, новый)`);
      }
      
      // Проверить, используется ли программа как активная и обновить её
      const activeProgram = localStorage.getItem('activeProgram');
      if (activeProgram) {
        const active = JSON.parse(activeProgram);
        if (active.id === KETTLEBELL_DAILY_PROGRAM.id || active.name === KETTLEBELL_DAILY_PROGRAM.name) {
          localStorage.setItem('activeProgram', JSON.stringify(KETTLEBELL_DAILY_PROGRAM));
          updatedPrograms.push(`${KETTLEBELL_DAILY_PROGRAM.name} (активная программа)`);
        }
      }
    } catch (error) {
      console.error('Ошибка при обновлении программы с гирей:', error);
    }
    
    // Обновление программы йоги для спины
    try {
      // Проверяем оба возможных ключа хранилища
      const userPrograms = localStorage.getItem('userPrograms');
      const savedPrograms = localStorage.getItem('programs');
      
      // Обрабатываем ключ 'userPrograms'
      if (userPrograms) {
        const programs = JSON.parse(userPrograms);
        
        // Найти существующую программу йоги по ID или имени
        const existingProgramIndex = programs.findIndex(
          (p: any) => p.id === YOGA_BACK_PROGRAM.id || p.name === YOGA_BACK_PROGRAM.name
        );
        
        if (existingProgramIndex !== -1) {
          // Обновить существующую программу
          programs[existingProgramIndex] = YOGA_BACK_PROGRAM;
          updatedPrograms.push(`${YOGA_BACK_PROGRAM.name} (userPrograms)`);
        } else {
          // Добавить новую программу
          programs.push(YOGA_BACK_PROGRAM);
          updatedPrograms.push(`${YOGA_BACK_PROGRAM.name} (userPrograms)`);
        }
        
        localStorage.setItem('userPrograms', JSON.stringify(programs));
      }
      
      // Обрабатываем ключ 'programs'
      if (savedPrograms) {
        const programs = JSON.parse(savedPrograms);
        
        // Найти существующую программу йоги по ID или имени
        const existingProgramIndex = programs.findIndex(
          (p: any) => p.id === YOGA_BACK_PROGRAM.id || p.name === YOGA_BACK_PROGRAM.name
        );
        
        if (existingProgramIndex !== -1) {
          // Обновить существующую программу
          programs[existingProgramIndex] = YOGA_BACK_PROGRAM;
          updatedPrograms.push(`${YOGA_BACK_PROGRAM.name} (programs)`);
        } else {
          // Добавить новую программу
          programs.push(YOGA_BACK_PROGRAM);
          updatedPrograms.push(`${YOGA_BACK_PROGRAM.name} (programs)`);
        }
        
        localStorage.setItem('programs', JSON.stringify(programs));
      }
      
      // Проверить, используется ли программа как активная и обновить её
      const activeProgram = localStorage.getItem('activeProgram');
      if (activeProgram) {
        const active = JSON.parse(activeProgram);
        if (active.id === YOGA_BACK_PROGRAM.id || active.name === YOGA_BACK_PROGRAM.name) {
          localStorage.setItem('activeProgram', JSON.stringify(YOGA_BACK_PROGRAM));
          updatedPrograms.push(`${YOGA_BACK_PROGRAM.name} (активная программа)`);
        }
      }
    } catch (error) {
      console.error('Ошибка при обновлении программы йоги:', error);
    }
    
    setUpdated(updatedPrograms);
    setMessage(updatedPrograms.length > 0 
      ? `Программы успешно обновлены: ${updatedPrograms.join(', ')}` 
      : 'Нет программ для обновления');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Обновление программ тренировок</h1>
              <p className="mt-2 text-gray-600">Обновите программы тренировок до последней версии</p>
              
              {message && (
                <div className={`mt-4 p-3 rounded ${updated.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {message}
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={updateAllPrograms}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Обновить все программы
                </button>
              </div>
              
              <div className="mt-6">
                <Link href="/programs">
                  <a className="text-blue-600 hover:text-blue-800">Вернуться к программам</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrograms; 