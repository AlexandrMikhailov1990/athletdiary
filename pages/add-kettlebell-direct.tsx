import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { KETTLEBELL_DAILY_PROGRAM } from '../models/KettlebellProgram';

const AddKettlebellDirect = () => {
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    try {
      // Принудительное создание программы с гирей напрямую
      const programToAdd = {
        ...KETTLEBELL_DAILY_PROGRAM,
        id: "kettlebell_direct_id" // Фиксированный ID для гарантированного обновления
      };
      
      // Получаем существующие программы из localStorage
      const programsJson = localStorage.getItem('programs');
      let programs = programsJson ? JSON.parse(programsJson) : [];
      
      // Удаляем программу с таким же именем, если она существует
      programs = programs.filter((p: any) => p.name !== programToAdd.name);
      
      // Добавляем нашу программу
      programs.push(programToAdd);
      
      // Сохраняем обратно в localStorage
      localStorage.setItem('programs', JSON.stringify(programs));
      
      // Если используется альтернативное хранилище
      const userProgramsJson = localStorage.getItem('userPrograms');
      if (userProgramsJson) {
        let userPrograms = JSON.parse(userProgramsJson);
        userPrograms = userPrograms.filter((p: any) => p.name !== programToAdd.name);
        userPrograms.push(programToAdd);
        localStorage.setItem('userPrograms', JSON.stringify(userPrograms));
      }
      
      // Проверяем активную программу
      const activeProgramJson = localStorage.getItem('activeProgram');
      if (activeProgramJson) {
        const activeProgram = JSON.parse(activeProgramJson);
        if (activeProgram.name === programToAdd.name) {
          // Если у нас уже есть активная программа, обновляем ее
          const updatedActiveProgram = {
            ...programToAdd,
            startDate: activeProgram.startDate,
            currentWeek: activeProgram.currentWeek || 1,
            currentDay: activeProgram.currentDay || 1,
            completedWorkouts: activeProgram.completedWorkouts || [],
            historyIds: activeProgram.historyIds || []
          };
          localStorage.setItem('activeProgram', JSON.stringify(updatedActiveProgram));
        }
      }
      
      setStatus('Программа успешно добавлена и обновлена!');
    } catch (error) {
      console.error('Ошибка при добавлении программы:', error);
      setStatus('Произошла ошибка при добавлении программы.');
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Добавление гиревой программы | АтлетДиари</title>
        <meta name="description" content="Прямое добавление программы с гирей" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">Добавление гиревой программы</h1>
                <p className="mt-2 text-gray-600">Прямое добавление программы "Программа на каждый день с гирей"</p>
                
                {status && (
                  <div className="mt-4 p-3 rounded bg-green-100 text-green-800">
                    {status}
                  </div>
                )}
                
                <div className="mt-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Добавить еще раз
                  </button>
                </div>
                
                <div className="mt-6 flex justify-center space-x-4">
                  <Link href="/programs" className="text-blue-600 hover:text-blue-800">
                    К программам
                  </Link>
                  <Link href="/" className="text-blue-600 hover:text-blue-800">
                    На главную
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddKettlebellDirect; 