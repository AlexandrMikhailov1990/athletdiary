import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
  content: string;
}

// Демо-статьи
const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'kak-nachat-zanimatsya-sportom',
    title: 'Как начать заниматься спортом и не бросить через неделю',
    description: 'Практические советы для новичков, которые хотят начать регулярно тренироваться и сформировать полезную привычку.',
    imageUrl: '/images/articles/fitness-beginner.jpg',
    date: '2023-10-15',
    readTime: '8 мин',
    tags: ['начинающим', 'мотивация', 'привычки'],
    content: `
      <h2>Почему так сложно начать заниматься спортом?</h2>
      <p>Начать заниматься спортом - это одно из самых распространенных намерений в современном мире. Мы все знаем о пользе физической активности для здоровья, внешнего вида и самочувствия. Однако статистика показывает, что большинство людей, начинающих тренироваться, бросают занятия уже через 1-2 недели.</p>
      
      <p>Причин для этого множество:</p>
      <ul>
        <li>Завышенные ожидания от результатов</li>
        <li>Слишком интенсивный старт, приводящий к физическому и психологическому истощению</li>
        <li>Отсутствие четкого плана тренировок</li>
        <li>Недостаток мотивации и поддержки</li>
      </ul>
      
      <h2>5 шагов, чтобы начать и не бросить</h2>
      
      <h3>1. Начинайте с малого</h3>
      <p>Вместо того чтобы сразу планировать 5 тренировок в неделю по часу, начните с 2-3 коротких занятий по 20-30 минут. Это поможет вашему организму адаптироваться и значительно снизит психологический барьер перед тренировками.</p>
      
      <h3>2. Выберите подходящую активность</h3>
      <p>Не существует "идеальной" тренировки, которая подходит всем. Экспериментируйте, чтобы найти то, что приносит вам удовольствие - будь то силовые тренировки, кардио, йога, танцы или командные виды спорта.</p>
      
      <h3>3. Поставьте конкретные, достижимые цели</h3>
      <p>Вместо расплывчатой цели "похудеть" или "стать сильнее", ставьте конкретные задачи: "выполнять 20 отжиманий за подход", "пробежать 5 км без остановки", "тренироваться 3 раза в неделю в течение месяца".</p>
      
      <h3>4. Ведите дневник тренировок</h3>
      <p>Записывайте свои достижения, отслеживайте прогресс и анализируйте результаты. Это поможет поддерживать мотивацию и корректировать программу тренировок. Наше приложение AthleteDiary идеально подходит для этой цели!</p>
      
      <h3>5. Сделайте спорт частью своего образа жизни</h3>
      <p>Встраивайте физическую активность в повседневную жизнь: ходите пешком, поднимайтесь по лестнице вместо лифта, делайте перерывы на растяжку во время работы. Тренировки должны стать привычкой, а не чем-то исключительным.</p>
      
      <h2>Как поддерживать мотивацию</h2>
      <p>Мотивация не приходит сама собой - ее нужно культивировать:</p>
      
      <ul>
        <li>Найдите партнера по тренировкам - так будет сложнее пропустить занятие</li>
        <li>Присоединитесь к группе или сообществу с общими интересами</li>
        <li>Вознаграждайте себя за достижения (только не едой!)</li>
        <li>Визуализируйте результаты и представляйте, как вы достигаете своих целей</li>
      </ul>
      
      <h2>Заключение</h2>
      <p>Начать заниматься спортом и сделать тренировки частью своей жизни возможно в любом возрасте и при любом уровне физической подготовки. Главное - правильный подход, реалистичные ожидания и постепенное формирование привычки. Помните, что даже небольшая регулярная активность гораздо лучше, чем интенсивные, но редкие тренировки.</p>
      
      <p>Начните сегодня - и через некоторое время вы будете удивляться, как раньше могли жить без спорта!</p>
    `
  }
];

// Получение статьи по slug
const getArticleBySlug = (slug: string): Article | undefined => {
  return SAMPLE_ARTICLES.find(article => article.slug === slug);
};

// Функция форматирования даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Функция для генерации оглавления
const generateTableOfContents = (content: string) => {
  const headings = content.match(/<h[2-3][^>]*>.*?<\/h[2-3]>/g) || [];
  return headings.map(heading => {
    const text = heading.replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^а-яёa-z0-9]+/g, '-');
    return { text, id };
  });
};

// Функция для добавления ID к заголовкам
const addIdsToHeadings = (content: string) => {
  return content.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/g, (match, level, attrs, text) => {
    const id = text.toLowerCase().replace(/[^а-яёa-z0-9]+/g, '-');
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
};

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Если страница еще загружается, показываем заглушку
  if (router.isFallback || !slug) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }
  
  // Получаем данные статьи по slug
  const article = getArticleBySlug(slug as string);
  
  // Если статья не найдена, показываем сообщение об ошибке
  if (!article) {
    return (
      <Layout title="Статья не найдена | AthleteDiary">
        <div className="min-h-screen container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Статья не найдена</h1>
          <p className="text-gray-600 mb-6">К сожалению, запрашиваемая статья не существует или была удалена.</p>
          <Link 
            href="/articles" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Вернуться к списку статей
          </Link>
        </div>
      </Layout>
    );
  }

  // Генерируем оглавление
  const tableOfContents = generateTableOfContents(article.content);
  
  // Добавляем ID к заголовкам
  const contentWithIds = addIdsToHeadings(article.content);

  // Формируем ключевые слова на основе тегов и заголовка
  const keywords = [
    ...article.tags,
    'фитнес',
    'тренировки',
    'спорт',
    'здоровый образ жизни',
    article.title.toLowerCase()
  ].join(', ');

  return (
    <Layout 
      title={`${article.title} | Статья о фитнесе | AthleteDiary`}
      description={article.description}
      keywords={keywords}
    >
      <Head>
        {/* Канонический URL */}
        <link rel="canonical" href={`https://athletdiary.ru/articles/${article.slug}`} />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://athletdiary.ru/articles/${article.slug}`} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:modified_time" content={article.date} />
        <meta property="article:section" content="Фитнес и здоровье" />
        <meta property="article:tag" content={article.tags.join(', ')} />
        <meta property="og:site_name" content="AthleteDiary" />
        <meta property="og:locale" content="ru_RU" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content={article.imageUrl} />
        
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
              "@type": "Article",
              "headline": article.title,
              "description": article.description,
              "image": article.imageUrl,
              "datePublished": article.date,
              "dateModified": article.date,
              "author": {
                "@type": "Organization",
                "name": "AthleteDiary",
                "url": "https://athletdiary.ru"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AthleteDiary",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://athletdiary.ru/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://athletdiary.ru/articles/${article.slug}`
              },
              "keywords": keywords,
              "articleSection": "Фитнес и здоровье",
              "inLanguage": "ru-RU",
              "wordCount": article.content.split(' ').length,
              "timeRequired": `PT${article.readTime.split(' ')[0]}M`
            })
          }}
        />
      </Head>
      
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Навигационные ссылки */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500" aria-label="Хлебные крошки">
              <Link href="/" className="hover:text-blue-600">Главная</Link>
              <span className="mx-2">/</span>
              <Link href="/articles" className="hover:text-blue-600">Статьи</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{article.title}</span>
            </nav>
          </div>
          
          {/* Контент статьи */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Заголовок и мета-информация */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
                <span className="mx-2">•</span>
                <span>Автор: AthleteDiary</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${tag}`}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Оглавление */}
            {tableOfContents.length > 0 && (
              <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Содержание статьи</h2>
                <nav aria-label="Оглавление статьи">
                  <ul className="space-y-2">
                    {tableOfContents.map(({ text, id }) => (
                      <li key={id}>
                        <a 
                          href={`#${id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
            
            {/* Изображение статьи */}
            <div className="relative h-64 md:h-96 w-full">
              <Image 
                src={article.imageUrl} 
                alt={article.title}
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Содержание статьи */}
            <article 
              className="prose prose-lg max-w-none p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
            
            {/* Блок "Поделиться" */}
            <div className="p-6 md:p-8 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Поделиться статьей</h2>
              <div className="flex space-x-4">
                <a 
                  href={`https://vk.com/share.php?url=https://athletdiary.ru/articles/${article.slug}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Поделиться в ВКонтакте"
                >
                  VK
                </a>
                <a 
                  href={`https://t.me/share/url?url=https://athletdiary.ru/articles/${article.slug}&text=${article.title}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                  aria-label="Поделиться в Telegram"
                >
                  Telegram
                </a>
                <a 
                  href={`https://wa.me/?text=${article.title} https://athletdiary.ru/articles/${article.slug}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  aria-label="Поделиться в WhatsApp"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            
            {/* Блок "Читайте также" */}
            <div className="p-6 md:p-8 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Читайте также</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map(relatedArticle => (
                  <Link 
                    key={relatedArticle.id}
                    href={`/articles/${relatedArticle.slug}`}
                    className="flex bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative w-1/3 min-h-full">
                      <Image 
                        src={relatedArticle.imageUrl} 
                        alt={relatedArticle.title}
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                        {relatedArticle.title}
                      </h3>
                      <time className="text-sm text-gray-500">{formatDate(relatedArticle.date)}</time>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/articles" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Все статьи
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 