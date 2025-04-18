import { User } from '@/models/User';
import Router from 'next/router';

/**
 * Получение данных авторизованного пользователя
 * @returns {Promise<User | null>} Объект пользователя или null, если пользователь не авторизован
 */
export const getUser = async (): Promise<User | null> => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
  }
  return null;
};

/**
 * Проверка, является ли пользователь администратором
 * @returns {Promise<boolean>} true, если пользователь - администратор
 */
export const isAdmin = async (): Promise<boolean> => {
  const user = await getUser();
  return user?.role === 'admin';
};

/**
 * Выход из системы
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    Router.push('/');
  }
};

/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<{success: boolean, message?: string, user?: User}>} - Результат авторизации
 */
export const login = async (email: string, password: string): Promise<{success: boolean, message?: string, user?: User}> => {
  try {
    // Здесь будет API запрос на авторизацию
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Ошибка при авторизации' };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Ошибка соединения с сервером' };
  }
};

/**
 * Регистрация нового пользователя
 * @param {string} username - Имя пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<{success: boolean, message?: string, user?: User}>} - Результат регистрации
 */
export const register = async (username: string, email: string, password: string): Promise<{success: boolean, message?: string, user?: User}> => {
  try {
    // Здесь будет API запрос на регистрацию
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Ошибка при регистрации' };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Ошибка соединения с сервером' };
  }
}; 