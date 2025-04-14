import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Закрывать меню при переходе на другую страницу
  useEffect(() => {
    const handleRouteChange = () => {
      closeMenu();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-800">AthletDiary</span>
            </Link>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/exercises" className={`px-3 py-2 rounded-md text-sm font-medium ${
              router.pathname === '/exercises' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}>
              Упражнения
            </Link>
            <Link href="/programs" className={`px-3 py-2 rounded-md text-sm font-medium ${
              router.pathname === '/programs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}>
              Программы
            </Link>
            <Link href="/history" className={`px-3 py-2 rounded-md text-sm font-medium ${
              router.pathname === '/history' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}>
              История
            </Link>
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeMenu}
          />
          
          <div className="absolute right-0 top-0 w-64 h-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Заголовок меню */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold">Меню</span>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Основное содержимое меню */}
              <div className="flex flex-col flex-grow">
                {/* Навигационные ссылки */}
                <nav className="flex flex-col">
                  <Link href="/exercises" 
                    className={`px-4 py-3 ${
                      router.pathname === '/exercises' 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Упражнения
                  </Link>
                  <Link href="/programs"
                    className={`px-4 py-3 ${
                      router.pathname === '/programs'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Программы
                  </Link>
                  <Link href="/history"
                    className={`px-4 py-3 ${
                      router.pathname === '/history'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    История
                  </Link>
                </nav>

                {/* Дополнительные действия */}
                <div className="border-t mt-4">
                  <Link href="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Войти
                  </Link>
                  <Link href="/register"
                    className="block px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    Регистрация
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 