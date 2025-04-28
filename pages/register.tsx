import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { register } from '@/utils/auth';
import { signIn } from 'next-auth/react';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const user = localStorage.getItem('user');
    if (user) {
      // Если пользователь уже авторизован, перенаправляем его
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess('Регистрация успешна! Входим...');
      // Автоматический вход через NextAuth
      await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      router.push('/profile');
    } else {
      setError(data.message || 'Ошибка регистрации');
    }
  };

  return (
    <>
      <Head>
        <title>Регистрация | AthleteDiary</title>
        <meta name="description" content="Регистрация в AthleteDiary для доступа к расширенным функциям" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Создание аккаунта</h1>
        
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}
          
            {success && (
              <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                {success}
              </div>
            )}
          
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя пользователя
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
            
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите ваш email"
                  required
                />
              </div>
            
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Введите пароль"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Минимум 6 символов
                </p>
              </div>
            
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Я согласен с <a href="#" className="text-blue-600 hover:text-blue-800">условиями использования</a> и <a href="#" className="text-blue-600 hover:text-blue-800">политикой конфиденциальности</a>
                  </span>
                </label>
              </div>
            
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Зарегистрироваться
              </button>
            </form>
          
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                  Войти
                </Link>
              </p>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 