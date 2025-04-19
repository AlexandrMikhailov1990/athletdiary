import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Интерфейс для статьи
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

// Данные статей
const articles: Article[] = [
  {
    slug: 'healthy-eating-program',
    title: 'Программа правильного питания на каждый день: принципы и готовое меню',
    excerpt: 'Узнайте основные принципы правильного питания и получите готовое сбалансированное меню на неделю',
    image: '/images/articles/healthy-eating.jpg',
    category: 'Питание',
    date: '3 февраля 2025',
    readTime: '10 минут'
  },
  {
    slug: 'recovery-after-workout',
    title: 'Восстановление после тренировки: почему это важно и как делать правильно',
    excerpt: 'Узнайте, почему восстановление после тренировки так же важно, как сама нагрузка, и как правильно восстанавливаться',
    image: '/images/articles/recovery-workout.jpg',
    category: 'Восстановление',
    date: '10 февраля 2025',
    readTime: '10 минут'
  },
  {
    slug: 'gym-beginners-guide',
    title: 'Как начать заниматься в тренажерном зале: 7 шагов для новичков',
    excerpt: 'Подробное руководство по началу тренировок в тренажерном зале для начинающих',
    image: '/images/articles/gym-beginner.jpg',
    category: 'Для начинающих',
    date: '17 февраля 2025',
    readTime: '8 минут'
  },
  {
    slug: 'best-exercises-for-weight-loss',
    title: 'Лучшие упражнения для похудения: научный подход',
    excerpt: 'Научно обоснованные упражнения для эффективного сжигания жира и похудения',
    image: '/images/articles/weight-loss-exercises.jpg',
    category: 'Фитнес',
    date: '24 февраля 2025',
    readTime: '10 минут'
  },
  {
    slug: 'nutrition-for-weight-loss',
    title: 'Питание для похудения: что говорит наука?',
    excerpt: 'Научно обоснованные принципы питания для устойчивого снижения веса',
    image: '/images/articles/nutrition.jpg',
    category: 'Питание',
    date: '3 марта 2025',
    readTime: '8 минут'
  },
  {
    slug: 'cardio-vs-strength-training',
    title: 'Кардио vs силовые тренировки: что выбрать?',
    excerpt: 'Сравнение эффективности разных видов тренировок для разных целей',
    image: '/images/articles/cardio-strength.jpg',
    category: 'Тренировки',
    date: '10 марта 2025',
    readTime: '7 минут'
  }
];

export default function Articles() {
  const featuredArticle = articles[0]; // Первая статья будет главной
  const otherArticles = articles.slice(1); // Остальные статьи

  return (
    <>
      <Head>
        <title>Статьи о фитнесе и здоровом образе жизни | AthleteDiary</title>
        <meta name="description" content="Полезные статьи о тренировках, питании, восстановлении и здоровом образе жизни" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Статьи о фитнесе и здоровом образе жизни
          </h1>

          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="relative aspect-[4/3] md:h-full">
                    <Image 
                      src={featuredArticle.image} 
                      alt={featuredArticle.title} 
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                    {featuredArticle.category}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <span className="mr-4">{featuredArticle.date}</span>
                    <span>{featuredArticle.readTime} чтения</span>
                  </div>
                  <Link href={`/articles/${featuredArticle.slug}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                    Читать статью
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <div key={article.slug} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-auto max-w-[150px]">
                      {article.category}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-gray-500 text-xs">
                      {article.date} • {article.readTime} чтения
                    </div>
                    <Link href={`/articles/${article.slug}`} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                      Читать
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Категории статей
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/articles/category/beginners" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Для начинающих
              </Link>
              <Link href="/articles/category/fitness" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Фитнес
              </Link>
              <Link href="/articles/category/nutrition" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Питание
              </Link>
              <Link href="/articles/category/training" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Тренировки
              </Link>
              <Link href="/articles/category/recovery" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Восстановление
              </Link>
              <Link href="/articles/category/motivation" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                Мотивация
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 