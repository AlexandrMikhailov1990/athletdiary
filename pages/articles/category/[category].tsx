import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

// Импортируем интерфейс и данные статей из основной страницы статей
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

// Словарь соответствия URL и отображаемых названий категорий
const categoryMap: {[key: string]: string} = {
  'beginners': 'Для начинающих',
  'fitness': 'Фитнес',
  'nutrition': 'Питание',
  'training': 'Тренировки',
  'recovery': 'Восстановление',
  'motivation': 'Мотивация'
};

// Словарь обратного соответствия: от названий категорий к URL категорий
const categoryToUrl: {[key: string]: string} = {
  'Для начинающих': 'beginners',
  'Фитнес': 'fitness',
  'Питание': 'nutrition',
  'Тренировки': 'training',
  'Восстановление': 'recovery',
  'Мотивация': 'motivation'
};

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  
  // Если страница еще загружается, показываем заглушку
  if (router.isFallback || !category) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }
  
  // Получаем отображаемое название категории
  const categoryName = categoryMap[category as string] || category;
  
  // Фильтруем статьи по категории
  const filteredArticles = articles.filter(article => {
    // Проверяем, соответствует ли категория статьи указанной категории в URL
    return categoryMap[category as string] === article.category;
  });

  return (
    <Layout 
      title={`${categoryName} - Статьи | AthleteDiary`}
      description={`Полезные статьи в категории ${categoryName} - экспертные советы, научно обоснованные рекомендации и практические руководства для достижения ваших фитнес-целей.`}
      keywords={`${typeof categoryName === 'string' ? categoryName.toLowerCase() : categoryName}, фитнес, тренировки, спорт, здоровый образ жизни, фитнес-советы, спортивные статьи, фитнес-рекомендации`}
    >
      <Head>
        <title>{categoryName} - Статьи | AthleteDiary</title>
        <meta name="description" content={`Статьи в категории ${categoryName} - полезная информация, советы и рекомендации`} />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content={`${categoryName} - Статьи | AthleteDiary`} />
        <meta property="og:description" content={`Полезные статьи в категории ${categoryName} - экспертные советы и научно обоснованные рекомендации.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://athletdiary.ru/articles/category/${category}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${categoryName} - Статьи | AthleteDiary`} />
        <meta name="twitter:description" content={`Полезные статьи в категории ${categoryName} - экспертные советы и научно обоснованные рекомендации.`} />
        
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${categoryName} - Статьи`,
              "description": `Полезные статьи в категории ${categoryName}`,
              "url": `https://athletdiary.ru/articles/category/${category}`,
              "publisher": {
                "@type": "Organization",
                "name": "AthleteDiary",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://athletdiary.ru/logo.png"
                }
              },
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": articles.map((article, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Article",
                    "headline": article.title,
                    "description": article.excerpt,
                    "url": `https://athletdiary.ru/articles/${article.slug}`,
                    "datePublished": article.date
                  }
                }))
              }
            })
          }}
        />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Навигационные ссылки */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Главная</Link>
              <span className="mx-2">/</span>
              <Link href="/articles" className="hover:text-blue-600">Статьи</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{categoryName}</span>
            </nav>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Статьи в категории «{categoryName}»
          </h1>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">В этой категории пока нет статей</h2>
              <p className="text-gray-600 mb-4">Мы работаем над созданием новых материалов. Загляните позже!</p>
              <Link href="/articles" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Вернуться к списку статей
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6 mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Все категории статей
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
    </Layout>
  );
} 