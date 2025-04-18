import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ContinueWorkoutButton from './ContinueWorkoutButton';
import { getUser, isAdmin, logout } from '@/utils/auth';
import { User } from '@/models/User';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
      }
    };
    
    checkAuth();
  }, []);

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

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAdminUser(false);
    router.push('/');
  };

  // Компонент обертка для ссылок в мобильном меню
  const MobileMenuLink = ({ href, className, children }: { href: string, className: string, children: React.ReactNode }) => {
    return (
      <Link href={href} className={className} onClick={closeMenu}>
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 border-0">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-800">AthleteDiary</span>
            </Link>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/exercises" className={`nav-link ${
              router.pathname === '/exercises' ? 'nav-link-active' : 'nav-link-default'
            }`}>
              Упражнения
            </Link>
            <Link href="/programs" className={`nav-link ${
              router.pathname === '/programs' ? 'nav-link-active' : 'nav-link-default'
            }`}>
              Программы
            </Link>
            <Link href="/calendar" className={`nav-link ${
              router.pathname === '/calendar' ? 'nav-link-active' : 'nav-link-default'
            }`}>
              Календарь
            </Link>
            <Link href="/history" className={`nav-link ${
              router.pathname === '/history' ? 'nav-link-active' : 'nav-link-default'
            }`}>
              История
            </Link>
            <Link href="/articles" className={`px-3 py-2 rounded-md hover:bg-gray-100 ${
              router.pathname.startsWith('/articles') ? 'font-semibold text-blue-600' : 'text-gray-700'
            }`}>
              Статьи
            </Link>
            
            {/* Admin panel link for desktop - uncommented */}
            {isAdminUser && (
              <Link href="/admin/articles" className={`px-3 py-2 rounded-md hover:bg-gray-100 ${
                router.pathname.startsWith('/admin') ? 'font-semibold text-blue-600' : 'text-gray-700'
              }`}>
                Админ
              </Link>
            )}
            
            <Link href="/settings" className={`nav-link ${
              router.pathname === '/settings' ? 'nav-link-active' : 'nav-link-default'
            }`}>
              Настройки
              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Новое
              </span>
            </Link>

            {/* Кнопка продолжения тренировки */}
            <ContinueWorkoutButton className="py-1 px-2 text-sm" iconOnly={true} />

            {user ? (
              <div className="relative">
                <button 
                  className="nav-link nav-link-default flex items-center"
                  onClick={toggleMenu}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden mr-2">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user.firstName?.[0] || user.username?.[0] || '').toUpperCase()}</span>
                    )}
                  </div>
                  <span>Профиль</span>
                  <svg 
                    className={`ml-1 h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                      Личный кабинет
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                      Настройки профиля
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
              <div className="hidden">
                <Link href="/login" className="nav-link nav-link-default">
                  Войти
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </div>
            )}
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
                <Link href="/calendar" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname === '/calendar' ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  Календарь
                </Link>
                <Link href="/history" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname === '/history' ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  История
                </Link>
                <Link href="/articles" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname.startsWith('/articles') ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  Статьи
                </Link>
                
                {/* Admin panel link for desktop - uncommented */}
                {isAdminUser && (
                  <Link href="/admin/articles" className={`block p-2 rounded-md hover:bg-gray-100 ${
                    router.pathname.startsWith('/admin') ? 'font-semibold text-blue-600' : 'text-gray-700'
                  }`} onClick={closeMenu}>
                    Админ
                  </Link>
                )}
                
                <Link href="/settings" className={`block p-2 rounded-md hover:bg-gray-100 ${
                  router.pathname.startsWith('/settings') ? 'font-semibold text-blue-600' : 'text-gray-700'
                }`} onClick={closeMenu}>
                  Настройки
                </Link>
                
                {/* Кнопка продолжения тренировки в мобильном меню */}
                <div className="p-2">
                  <ContinueWorkoutButton fullWidth={true} />
                </div>
                
                {user ? (
                  <>
                    {user.profilePicture ? (
                      <div className="p-2 flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img src={user.profilePicture} alt="Аватар" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName || user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                          <span className="text-lg font-medium">{(user.firstName?.[0] || user.username?.[0] || '').toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName || user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    )}
                    <Link href="/dashboard" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={closeMenu}>
                      Личный кабинет
                    </Link>
                    <Link href="/profile" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={closeMenu}>
                      Настройки профиля
                    </Link>
                    <button
                      className="block w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <div className="hidden">
                    <Link href="/login" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={closeMenu}>
                      Войти
                    </Link>
                    <Link href="/register" className="block p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={closeMenu}>
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 