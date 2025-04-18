import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Layout from '@/components/Layout';

// Интерфейс для статьи
interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  readTime: string;
  tags: string[];
}

// Демо-список статей для начального отображения
const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'kak-nachat-zanimatsya-sportom',
    title: 'Как начать заниматься спортом и не бросить через неделю',
    description: 'Практические советы для новичков, которые хотят начать регулярно тренироваться и сформировать полезную привычку.',
    imageUrl: '/images/articles/fitness-beginner.jpg',
    date: '2023-10-15',
    readTime: '8 мин',
    tags: ['начинающим', 'мотивация', 'привычки']
  },
  {
    id: '2',
    slug: 'luchshie-uprazhneniya-dlya-pohudeniya',
    title: 'Лучшие упражнения для похудения: научный подход',
    description: 'Разбираемся, какие упражнения действительно эффективны для снижения веса с точки зрения научных исследований.',
    imageUrl: '/images/articles/weight-loss-exercises.jpg',
    date: '2023-11-03',
    readTime: '12 мин',
    tags: ['похудение', 'кардио', 'исследования']
  },
  {
    id: '3',
    slug: 'silovye-trenirovki-dlya-nachinayushih',
    title: 'Силовые тренировки для начинающих: полное руководство',
    description: 'Все, что нужно знать о силовых тренировках, если вы только начинаете путь в фитнесе.',
    imageUrl: '/images/articles/strength-training.jpg',
    date: '2023-12-10',
    readTime: '15 мин',
    tags: ['силовые тренировки', 'начинающим', 'техника']
  }
];

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();
  
  // Получаем все уникальные теги из статей
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));
  
  // Фильтрация статей по поисковому запросу и тегу
  useEffect(() => {
    let result = articles;
    
    if (searchTerm) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTag) {
      result = result.filter(article => 
        article.tags.includes(selectedTag)
      );
    }
    
    setFilteredArticles(result);
  }, [searchTerm, selectedTag, articles]);
  
  // Функция форматирования даты в читаемый вид
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout title="Полезные статьи о фитнесе и тренировках | AthleteDiary">
      <Head>
        <meta 
          name="description" 
          content="Полезные статьи о фитнесе, тренировках, здоровом образе жизни и правильном питании. Советы для начинающих и опытных спортсменов." 
        />
        <meta 
          name="keywords" 
          content="фитнес, тренировки, спорт, здоровье, упражнения, правильное питание, статьи о спорте"
        />
      </Head>
      
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Заголовок страницы */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Полезные статьи о тренировках и фитнесе</h1>
            <p className="text-lg md:text-xl opacity-90">
              Здесь мы собрали полезные материалы, которые помогут вам достичь своих спортивных целей, узнать больше о правильных тренировках и здоровом образе жизни.
            </p>
          </div>
          
          {/* Поиск и фильтрация */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              {/* Поисковая строка */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Найти статью..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <svg 
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Фильтр по тегам */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === null 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Все
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      tag === selectedTag 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Список статей */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link 
                  href={`/articles/${article.slug}`} 
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Изображение статьи</span>
                    </div>
                    {/* Заглушка для изображения, в реальном приложении используйте Image */}
                    {/* <Image 
                      src={article.imageUrl} 
                      alt={article.title} 
                      fill 
                      className="object-cover"
                    /> */}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{formatDate(article.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center shadow">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Статьи не найдены</h3>
              <p className="mt-2 text-gray-500">
                Попробуйте изменить параметры поиска или выбрать другой тег.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag(null);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
} 