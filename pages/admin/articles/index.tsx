import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthGuard from '@/components/AuthGuard';

// Интерфейс для статьи в админке (расширенный)
interface Article {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content?: string;
  published?: boolean;
}

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // В будущем здесь будет запрос к API для получения статей
    // Пока используем имитацию загрузки данных
    const fetchArticles = async () => {
      setIsLoading(true);
      
      // Имитация API-запроса с тестовыми данными
      try {
        // В реальном приложении будет fetch к API
        // Используем тестовые данные из pages/articles/index.tsx
        const articlesData = [
          {
            id: '1',
            slug: 'gym-beginners-guide',
            title: 'Как начать заниматься в тренажерном зале: 7 шагов для новичков',
            excerpt: 'Подробное руководство по началу тренировок в тренажерном зале для начинающих',
            image: '/images/articles/gym-beginner.jpg',
            category: 'Для начинающих',
            date: '20 июня 2023',
            readTime: '8 минут',
            published: true
          },
          {
            id: '2',
            slug: 'best-exercises-for-weight-loss',
            title: 'Лучшие упражнения для похудения: научный подход',
            excerpt: 'Научно обоснованные упражнения для эффективного сжигания жира и похудения',
            image: '/images/articles/weight-loss-exercises.jpg',
            category: 'Фитнес',
            date: '15 июня 2023',
            readTime: '10 минут',
            published: true
          },
          {
            id: '3',
            slug: 'nutrition-for-weight-loss',
            title: 'Питание для похудения: что говорит наука?',
            excerpt: 'Научно обоснованные принципы питания для устойчивого снижения веса',
            image: '/images/articles/nutrition.jpg',
            category: 'Питание',
            date: '10 июня 2023',
            readTime: '8 минут',
            published: true
          },
          {
            id: '4',
            slug: 'cardio-vs-strength-training',
            title: 'Кардио vs силовые тренировки: что выбрать?',
            excerpt: 'Сравнение эффективности разных видов тренировок для разных целей',
            image: '/images/articles/cardio-strength.jpg',
            category: 'Тренировки',
            date: '5 июня 2023',
            readTime: '7 минут',
            published: false
          },
          {
            id: '5',
            slug: 'recovery-importance',
            title: 'Восстановление после тренировки: почему это важно',
            excerpt: 'Как правильное восстановление влияет на результаты тренировок',
            image: '/images/articles/recovery.jpg',
            category: 'Восстановление',
            date: '1 июня 2023',
            readTime: '6 минут',
            published: true
          }
        ];
        
        setArticles(articlesData);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Функция для фильтрации статей по поисковому запросу
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция для управления публикацией
  const togglePublish = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, published: !article.published } 
          : article
      )
    );
    // В реальном приложении здесь будет API-запрос для изменения статуса публикации
  };

  // Функция для удаления статьи
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью? Это действие невозможно отменить.')) {
      setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
      // В реальном приложении здесь будет API-запрос для удаления статьи
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Управление статьями | AthleteDiary</title>
          <meta name="description" content="Административная панель для управления статьями" />
        </Head>

        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Управление статьями</h1>
            <Link href="/admin/articles/create" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Создать статью
            </Link>
          </div>

          {/* Поиск и фильтры */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Поиск статей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="shrink-0">
                <button onClick={() => setSearchTerm('')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          {/* Таблица статей */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Загрузка статей...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Статьи не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статья
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <div className="absolute inset-0 bg-gray-200 rounded overflow-hidden">
                                <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{article.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-md">{article.excerpt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => article.id && togglePublish(article.id)}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {article.published ? 'Опубликована' : 'Черновик'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/articles/${article.slug}`} className="text-blue-600 hover:text-blue-900" target="_blank">
                              Просмотр
                            </Link>
                            <Link href={`/admin/articles/edit/${article.slug}`} className="text-indigo-600 hover:text-indigo-900">
                              Редактировать
                            </Link>
                            <button 
                              onClick={() => article.id && handleDelete(article.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 