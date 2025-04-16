import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Program } from '../../models/Program';

export default function ImportProgram() {
  const router = useRouter();
  const [programData, setProgramData] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    
    // Получаем параметр data из URL
    const { data } = router.query;
    
    if (!data || typeof data !== 'string') {
      setError('Ошибка: Некорректные данные программы.');
      return;
    }
    
    try {
      // Декодируем данные из base64
      const jsonData = atob(data);
      // Парсим JSON данные
      const program = JSON.parse(jsonData) as Program;
      
      // Проверяем валидность программы
      if (!program || !program.id || !program.name) {
        setError('Ошибка: Некорректный формат программы.');
        return;
      }
      
      setProgramData(program);
    } catch (err) {
      console.error('Ошибка при импорте программы:', err);
      setError('Ошибка: Не удалось расшифровать данные программы.');
    }
  }, [router.isReady, router.query]);

  const handleImport = () => {
    if (!programData) return;
    
    setImporting(true);
    
    try {
      // Создаем копию программы с новым ID
      const importedProgram: Program = {
        ...programData,
        id: Date.now().toString(),
        name: `${programData.name} (импорт)`,
        isImported: true
      };
      
      // Получаем текущие программы из localStorage
      const savedPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
      
      // Добавляем импортированную программу
      savedPrograms.push(importedProgram);
      
      // Сохраняем обновленный список
      localStorage.setItem('programs', JSON.stringify(savedPrograms));
      
      // Показываем сообщение об успехе
      setSuccess(true);
      
      // Перенаправляем на страницу программ через 2 секунды
      setTimeout(() => {
        router.push('/programs');
      }, 2000);
    } catch (err) {
      console.error('Ошибка при сохранении программы:', err);
      setError('Не удалось сохранить программу. Пожалуйста, попробуйте еще раз.');
      setImporting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Импорт программы тренировок</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => router.push('/programs')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Вернуться к программам
            </button>
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p>Программа успешно импортирована!</p>
            <p className="text-sm mt-2">Вы будете перенаправлены на страницу программ...</p>
          </div>
        ) : programData ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{programData.name}</h2>
              <p className="text-gray-600">{programData.description || 'Нет описания'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Информация о программе</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Количество тренировок:</span> {programData.workouts?.length || 0}
                </p>
                {programData.weeks && (
                  <p>
                    <span className="font-medium">Продолжительность:</span> {programData.weeks} {getWeekWord(programData.weeks)}
                  </p>
                )}
                {programData.category && (
                  <p>
                    <span className="font-medium">Категория:</span> {programData.category}
                  </p>
                )}
                {programData.difficulty && (
                  <p>
                    <span className="font-medium">Сложность:</span> {getDifficultyText(programData.difficulty)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <button
                onClick={handleImport}
                disabled={importing}
                className={`w-full ${importing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
              >
                {importing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Импортирую программу...
                  </>
                ) : (
                  'Импортировать программу'
                )}
              </button>
              
              <button
                onClick={() => router.push('/programs')}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mb-4"></div>
            <p className="text-gray-600">Загрузка данных программы...</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Вспомогательная функция для правильного склонения слова "неделя"
function getWeekWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'неделя';
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'недели';
  } else {
    return 'недель';
  }
}

// Вспомогательная функция для получения текстового описания сложности
function getDifficultyText(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return 'Начинающий';
    case 2:
      return 'Средний';
    case 3:
      return 'Продвинутый';
    case 4:
      return 'Эксперт';
    default:
      return 'Не указана';
  }
} 