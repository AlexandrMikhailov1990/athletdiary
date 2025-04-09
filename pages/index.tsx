import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero секция */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">AthletDiary</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Ваш персональный дневник тренировок</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Отслеживайте прогресс, планируйте тренировки и достигайте своих спортивных целей
            с помощью удобного дневника тренировок
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/exercises')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-lg"
            >
              Просмотреть упражнения
            </button>
            <button
              onClick={() => router.push('/programs')}
              className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-8 rounded-lg shadow-lg"
            >
              Просмотреть программы
            </button>
          </div>
        </div>

        {/* Функции */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300">
            <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-3 text-center">Программы тренировок</h3>
            <p className="text-gray-600 text-center mb-4">
              Создавайте и настраивайте программы тренировок под свои цели.
              Выбирайте из готовых шаблонов или создавайте свои с нуля.
            </p>
            <div className="text-center">
              <Link href="/programs">
                <span className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                  Подробнее
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300">
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-700 mb-3 text-center">Каталог упражнений</h3>
            <p className="text-gray-600 text-center mb-4">
              Библиотека упражнений с подробным описанием техники выполнения и видеоинструкциями.
              Выбирайте упражнения для включения в свои тренировочные программы.
            </p>
            <div className="text-center">
              <Link href="/exercises">
                <span className="text-green-600 hover:text-green-800 inline-flex items-center">
                  Подробнее
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300">
            <div className="bg-purple-100 text-purple-700 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-purple-700 mb-3 text-center">История тренировок</h3>
            <p className="text-gray-600 text-center mb-4">
              Отслеживайте свои тренировки и наблюдайте за прогрессом.
              Анализируйте статистику и улучшайте свои результаты.
            </p>
            <div className="text-center">
              <Link href="/history">
                <span className="text-purple-600 hover:text-purple-800 inline-flex items-center">
                  Подробнее
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Почему выбирают AthletDiary?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Персонализация</h3>
              <p className="text-gray-600">Гибкая настройка тренировок под ваши индивидуальные цели и возможности</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Удобный учет</h3>
              <p className="text-gray-600">Быстрая и простая запись результатов тренировок в удобном формате</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Аналитика</h3>
              <p className="text-gray-600">Отслеживание прогресса и анализ результатов с помощью наглядных графиков</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Справочник</h3>
              <p className="text-gray-600">Подробное описание упражнений с рекомендациями по правильной технике</p>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="bg-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Начните тренироваться с умом уже сегодня</h2>
          <p className="text-xl mb-6 opacity-90">Присоединяйтесь к тысячам спортсменов, которые уже улучшили свои результаты</p>
          <Link href="/register">
            <span className="inline-block bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg">
              Создать аккаунт бесплатно
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 