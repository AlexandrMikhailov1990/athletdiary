import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { login } from '@/utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { returnUrl } = router.query;

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const user = localStorage.getItem('user');
    if (user) {
      // Если пользователь уже авторизован, перенаправляем его
      router.push(returnUrl?.toString() || '/dashboard');
    }
  }, [returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Авторизация пользователя
      const { success, message, user } = await login(email, password);

      if (success && user) {
        // Перенаправляем на страницу, с которой пришли, или на дашборд
        router.push(returnUrl?.toString() || '/dashboard');
      } else {
        setError(message || 'Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setError('Произошла ошибка при попытке входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Вход в аккаунт | AthleteDiary</title>
        <meta name="description" content="Вход в аккаунт AthleteDiary для доступа к расширенным функциям" />
      </Head>

      <Navbar />

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Вход в аккаунт</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите ваш email"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите ваш пароль"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isLoading ? 'Выполняется вход...' : 'Войти'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Для тестирования используйте:<br />
                Email: admin@athletdiary.com<br />
                Пароль: admin123
              </p>
              <p className="mt-2">
                Или:<br />
                Email: user@athletdiary.com<br />
                Пароль: user123
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">
                Еще нет аккаунта?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800">
                  Зарегистрироваться
                </Link>
              </p>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 