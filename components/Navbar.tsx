import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <span className="text-2xl font-bold text-blue-800">AthletDiary</span>
              </span>
            </Link>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/exercises">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/exercises' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                Упражнения
              </span>
            </Link>
            <Link href="/programs">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/programs' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                Программы
              </span>
            </Link>
            <Link href="/history">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/history' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                История
              </span>
            </Link>

            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button 
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-800 focus:outline-none"
                    onClick={toggleMenu}
                  >
                    <span>Профиль</span>
                    <svg 
                      className={`ml-1 h-5 w-5 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <Link href="/profile">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Настройки профиля
                      </span>
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Войти
                  </span>
                </Link>
                <Link href="/register">
                  <span className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                    Регистрация
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center">
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

      {/* Мобильное меню, переключение видимости */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/exercises">
            <span className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/exercises' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Упражнения
            </span>
          </Link>
          <Link href="/programs">
            <span className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/programs' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Программы
            </span>
          </Link>
          <Link href="/history">
            <span className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/history' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              История
            </span>
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Настройки профиля
                </span>
              </Link>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Войти
                </span>
              </Link>
              <Link href="/register">
                <span className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                  Регистрация
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 