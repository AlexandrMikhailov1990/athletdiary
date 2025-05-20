import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

// Интерфейс для статьи
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  difficulty?: 'Начинающий' | 'Средний' | 'Продвинутый';
  tags?: string[];
}

// Данные статей
const articles: Article[] = [
  {
    slug: 'kak-sohranit-motivaciyu',
    title: 'Как сохранить мотивацию: научные методы и лайфхаки для регулярных тренировок',
    excerpt: 'Узнайте научно обоснованные методы сохранения мотивации к тренировкам. Практические советы, психологические техники и реальные истории успеха.',
    image: '/images/articles/motivation.jpg',
    category: 'Мотивация',
    date: '20 марта 2024',
    readTime: '10 минут',
    difficulty: 'Средний',
    tags: ['мотивация', 'психология', 'регулярные тренировки', 'выгорание']
  },
  {
    slug: 'domashnie-trenirovki',
    title: 'Домашние тренировки без оборудования: программа на 4 недели для любого уровня',
    excerpt: 'Эффективная программа домашних тренировок без специального оборудования. Подробные планы для начинающих и продвинутых, техника выполнения упражнений.',
    image: '/images/articles/home-workout.jpg',
    category: 'Тренировки',
    date: '20 марта 2024',
    readTime: '12 минут',
    difficulty: 'Начинающий',
    tags: ['домашние тренировки', 'без оборудования', 'для начинающих', 'программа тренировок']
  },
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

// Компонент для отображения сложности
const DifficultyBadge = ({ difficulty }: { difficulty: Article['difficulty'] }) => {
  const colors = {
    'Начинающий': 'bg-green-100 text-green-800',
    'Средний': 'bg-yellow-100 text-yellow-800',
    'Продвинутый': 'bg-red-100 text-red-800'
  } as const;

  if (!difficulty) return null;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};

// Компонент для отображения тегов
const TagsList = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map(tag => (
      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
        {tag}
      </span>
    ))}
  </div>
);

export default function Articles() {
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  // Группируем статьи по категориям
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  return (
    <Layout 
      title="Статьи о фитнесе и тренировках | Полезные советы и рекомендации | AthleteDiary"
      description="Экспертные статьи о фитнесе, тренировках и здоровом образе жизни. Практические советы по тренировкам, питанию и восстановлению. Научно обоснованные рекомендации для достижения ваших фитнес-целей."
      keywords="статьи о фитнесе, тренировки для начинающих, правильное питание, восстановление после тренировки, фитнес-советы, как начать заниматься спортом, упражнения для похудения, кардио тренировки, силовые тренировки"
    >
      <Head>
        {/* Канонический URL */}
        <link rel="canonical" href="https://athletdiary.ru/articles" />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content="Статьи о фитнесе и тренировках | AthleteDiary" />
        <meta property="og:description" content="Экспертные статьи о фитнесе, тренировках и здоровом образе жизни. Практические советы и научно обоснованные рекомендации." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://athletdiary.ru/articles" />
        <meta property="og:image" content="https://athletdiary.ru/images/articles/og-image.jpg" />
        <meta property="og:site_name" content="AthleteDiary" />
        <meta property="og:locale" content="ru_RU" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Статьи о фитнесе и тренировках | AthleteDiary" />
        <meta name="twitter:description" content="Экспертные статьи о фитнесе, тренировках и здоровом образе жизни. Практические советы и научно обоснованные рекомендации." />
        <meta name="twitter:image" content="https://athletdiary.ru/images/articles/og-image.jpg" />
        
        {/* Дополнительные мета-теги */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AthleteDiary" />
        <meta name="language" content="Russian" />
        
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Статьи о фитнесе и тренировках",
              "description": "Экспертные статьи о фитнесе, тренировках и здоровом образе жизни",
              "url": "https://athletdiary.ru/articles",
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
                    "datePublished": article.date,
                    "author": {
                      "@type": "Organization",
                      "name": "AthleteDiary"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "AthleteDiary",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://athletdiary.ru/logo.png"
                      }
                    }
                  }
                }))
              }
            })
          }}
        />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Статьи о фитнесе и тренировках
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Экспертные статьи о фитнесе, тренировках и здоровом образе жизни. Практические советы и научно обоснованные рекомендации для достижения ваших целей.
            </p>
          </header>

          {/* Главная статья */}
          <section aria-labelledby="featured-article-heading" className="mb-12">
            <h2 id="featured-article-heading" className="sr-only">Главная статья</h2>
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
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {featuredArticle.category}
                      </div>
                      {featuredArticle.difficulty && (
                        <DifficultyBadge difficulty={featuredArticle.difficulty} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {featuredArticle.excerpt}
                  </p>
                  {featuredArticle.tags && <TagsList tags={featuredArticle.tags} />}
                  <div className="flex items-center text-gray-500 text-sm mt-4">
                    <time dateTime={featuredArticle.date} className="mr-4">{featuredArticle.date}</time>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {featuredArticle.readTime} чтения
                    </span>
                  </div>
                  <Link href={`/articles/${featuredArticle.slug}`} 
                    className="mt-6 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                    Читать статью
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Последние статьи */}
          <section aria-labelledby="latest-articles-heading" className="mb-12">
            <h2 id="latest-articles-heading" className="text-2xl font-bold text-gray-800 mb-6">
              Последние статьи
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article) => (
                <article key={article.slug} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/9]">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category}
                      </div>
                      {article.difficulty && (
                        <DifficultyBadge difficulty={article.difficulty} />
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                      {article.excerpt}
                    </p>
                    {article.tags && <TagsList tags={article.tags} />}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-gray-500 text-xs flex items-center">
                        <time dateTime={article.date}>{article.date}</time>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {article.readTime}
                        </span>
                      </div>
                      <Link href={`/articles/${article.slug}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                        Читать
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Статьи по категориям */}
          <section aria-labelledby="categories-heading" className="mb-12">
            <h2 id="categories-heading" className="text-2xl font-bold text-gray-800 mb-6">
              Статьи по категориям
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
                <div key={category} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {category}
                  </h3>
                  <ul className="space-y-4">
                    {categoryArticles.map(article => (
                      <li key={article.slug}>
                        <Link 
                          href={`/articles/${article.slug}`}
                          className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors group"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <time dateTime={article.date}>{article.date}</time>
                              <span className="mx-2">•</span>
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {article.readTime}
                              </span>
                              {article.difficulty && (
                                <>
                                  <span className="mx-2">•</span>
                                  <DifficultyBadge difficulty={article.difficulty} />
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Популярные теги */}
          <section aria-labelledby="tags-heading" className="bg-white rounded-xl shadow-md p-6">
            <h2 id="tags-heading" className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Популярные теги
            </h2>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(articles.flatMap(article => article.tags || []))).map(tag => (
                <Link 
                  key={tag}
                  href={`/articles/tag/${tag}`} 
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
} 