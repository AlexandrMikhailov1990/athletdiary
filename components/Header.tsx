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
          {/* Затемнение фона */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeMenu}
          />
          
          {/* Меню */}
          <div className="absolute right-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-xl">
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

              {/* Содержимое меню */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <Link href="/exercises" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname === '/exercises' ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  Упражнения
                </Link>
                <Link href="/programs" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname === '/programs' ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  Программы
                </Link>
                <Link href="/history" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname === '/history' ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  История
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 