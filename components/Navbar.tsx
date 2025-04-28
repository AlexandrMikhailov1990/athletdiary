import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ContinueWorkoutButton from './ContinueWorkoutButton';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdminUser = false; // Можно доработать при необходимости

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
            <Link href="/exercises" className={`nav-link ${router.pathname === '/exercises' ? 'nav-link-active' : 'nav-link-default'}`}>
              Упражнения
            </Link>
            <Link href="/programs" className={`nav-link ${router.pathname === '/programs' ? 'nav-link-active' : 'nav-link-default'}`}>
              Программы
            </Link>
            <Link href="/calendar" className={`nav-link ${router.pathname === '/calendar' ? 'nav-link-active' : 'nav-link-default'}`}>
              Календарь
            </Link>
            <Link href="/history" className={`nav-link ${router.pathname === '/history' ? 'nav-link-active' : 'nav-link-default'}`}>
              История
            </Link>
            <Link href="/articles" className={`px-3 py-2 rounded-md hover:bg-gray-100 ${router.pathname.startsWith('/articles') ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
              Статьи
            </Link>
            {isAdminUser && (
              <Link href="/admin/articles" className={`px-3 py-2 rounded-md hover:bg-gray-100 ${router.pathname.startsWith('/admin') ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                Админ
              </Link>
            )}
            <ContinueWorkoutButton className="py-1 px-2 text-sm" iconOnly={true} />
            {session?.user ? (
              <>
                <Link href="/profile" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Профиль
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link nav-link-default">
                  Войти
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </>
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
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeMenu} />
          <div className="absolute right-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold">Меню</span>
                <button onClick={closeMenu} className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <Link href="/exercises" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname === '/exercises' ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                  Упражнения
                </Link>
                <Link href="/programs" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname === '/programs' ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                  Программы
                </Link>
                <Link href="/calendar" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname === '/calendar' ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                  Календарь
                </Link>
                <Link href="/history" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname === '/history' ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                  История
                </Link>
                <Link href="/articles" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname.startsWith('/articles') ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                  Статьи
                </Link>
                {isAdminUser && (
                  <Link href="/admin/articles" className={`block p-2 rounded-md hover:bg-gray-100 ${router.pathname.startsWith('/admin') ? 'font-semibold text-blue-600' : 'text-gray-700'}`} onClick={closeMenu}>
                    Админ
                  </Link>
                )}
                <div className="p-2">
                  <ContinueWorkoutButton fullWidth={true} />
                </div>
                {session?.user ? (
                  <>
                    <Link href="/profile" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={closeMenu}>
                      Профиль
                    </Link>
                    <button
                      className="block w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700"
                      onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={closeMenu}>
                      Войти
                    </Link>
                    <Link href="/register" className="block p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={closeMenu}>
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}