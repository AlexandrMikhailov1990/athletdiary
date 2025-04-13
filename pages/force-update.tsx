import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { KETTLEBELL_DAILY_PROGRAM } from '../models/KettlebellProgram';
import Head from 'next/head';

const ForceUpdate = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [updated, setUpdated] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const forceUpdateKettlebellProgram = () => {
    setIsUpdating(true);
    setMessage('Удаление и добавление заново программы с гирей...');
    const updatedPrograms: string[] = [];
    
    try {
      // Проверяем все возможные ключи хранилища
      const storageKeys = ['userPrograms', 'programs'];
      
      // Проходим по всем возможным ключам хранилища и удаляем программу
      storageKeys.forEach(key => {
        const programsJson = localStorage.getItem(key);
        if (programsJson) {
          let programs = JSON.parse(programsJson);
          
          // Фильтруем массив, удаляя программу по имени
          const oldLength = programs.length;
          programs = programs.filter((p: any) => p.name !== KETTLEBELL_DAILY_PROGRAM.name);
          
          if (oldLength !== programs.length) {
            updatedPrograms.push(`Удалена из ${key}`);
            localStorage.setItem(key, JSON.stringify(programs));
          }
          
          // Добавляем новую программу с обновленными параметрами
          programs.push(KETTLEBELL_DAILY_PROGRAM);
          localStorage.setItem(key, JSON.stringify(programs));
          updatedPrograms.push(`Добавлена в ${key}`);
        } else {
          // Если хранилище не существует, создаем новое
          localStorage.setItem(key, JSON.stringify([KETTLEBELL_DAILY_PROGRAM]));
          updatedPrograms.push(`Создано новое хранилище ${key}`);
        }
      });
      
      // Проверяем, если программа была активной, обновляем её
      const activeProgramJson = localStorage.getItem('activeProgram');
      if (activeProgramJson) {
        const activeProgram = JSON.parse(activeProgramJson);
        if (activeProgram.name === KETTLEBELL_DAILY_PROGRAM.name) {
          // Удаляем активную программу, чтобы не было конфликтов
          localStorage.removeItem('activeProgram');
          updatedPrograms.push('Активная программа удалена');
        }
      }
      
      setUpdated(updatedPrograms);
      setMessage(`Операции выполнены: ${updatedPrograms.join(', ')}`);
    } catch (error) {
      console.error('Ошибка при обновлении программы:', error);
      setMessage('Произошла ошибка при обновлении программы');
    } finally {
      setIsUpdating(false);
    }
  };

  // Вызываем функцию обновления автоматически при загрузке страницы
  useEffect(() => {
    forceUpdateKettlebellProgram();
  }, []);

  return (
    <>
      <Head>
        <title>Принудительное обновление программы | АтлетДиари</title>
        <meta name="description" content="Обновление программы тренировок с гирей" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900">Принудительное обновление</h1>
                <p className="mt-2 text-gray-600">Удаление и добавление заново программы с гирей</p>
                
                {message && (
                  <div className={`mt-4 p-3 rounded ${updated.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {message}
                  </div>
                )}
                
                <div className="mt-6">
                  <button
                    onClick={forceUpdateKettlebellProgram}
                    disabled={isUpdating}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    {isUpdating ? 'Обновление...' : 'Обновить еще раз'}
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

export default ForceUpdate; 