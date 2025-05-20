import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

export default function MotivationArticle() {
  return (
    <Layout 
      title="Как сохранить мотивацию к тренировкам: научные методы и лайфхаки | AthleteDiary"
      description="Узнайте научно обоснованные методы сохранения мотивации к тренировкам. Практические советы, психологические техники и реальные истории успеха для регулярных занятий спортом."
      keywords="мотивация к тренировкам, как не бросить спорт, психология тренировок, поддержание мотивации, фитнес-мотивация, регулярные тренировки, спортивная мотивация, как начать тренироваться"
    >
      <Head>
        {/* Канонический URL */}
        <link rel="canonical" href="https://athletdiary.ru/articles/kak-sohranit-motivaciyu" />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content="Как сохранить мотивацию к тренировкам: научные методы и лайфхаки" />
        <meta property="og:description" content="Узнайте научно обоснованные методы сохранения мотивации к тренировкам. Практические советы и психологические техники для регулярных занятий спортом." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://athletdiary.ru/articles/kak-sohranit-motivaciyu" />
        <meta property="og:image" content="https://athletdiary.ru/images/articles/motivation.jpg" />
        <meta property="article:published_time" content="2024-03-20" />
        <meta property="article:modified_time" content="2024-03-20" />
        <meta property="article:section" content="Мотивация" />
        <meta property="article:tag" content="мотивация, психология, тренировки, фитнес" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как сохранить мотивацию к тренировкам: научные методы и лайфхаки" />
        <meta name="twitter:description" content="Узнайте научно обоснованные методы сохранения мотивации к тренировкам. Практические советы и психологические техники для регулярных занятий спортом." />
        <meta name="twitter:image" content="https://athletdiary.ru/images/articles/motivation.jpg" />
        
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Как сохранить мотивацию к тренировкам: научные методы и лайфхаки",
              "description": "Узнайте научно обоснованные методы сохранения мотивации к тренировкам. Практические советы и психологические техники для регулярных занятий спортом.",
              "image": "https://athletdiary.ru/images/articles/motivation.jpg",
              "datePublished": "2024-03-20",
              "dateModified": "2024-03-20",
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
                "@id": "https://athletdiary.ru/articles/kak-sohranit-motivaciyu"
              },
              "keywords": "мотивация к тренировкам, как не бросить спорт, психология тренировок, поддержание мотивации, фитнес-мотивация, регулярные тренировки, спортивная мотивация, как начать тренироваться",
              "articleSection": "Мотивация",
              "inLanguage": "ru-RU"
            })
          }}
        />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Шапка */}
            <div className="relative h-80 md:h-96">
              <Image
                src="/images/articles/motivation.jpg"
                alt="Мотивация к тренировкам"
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Мотивация
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Как сохранить мотивацию к тренировкам: научные методы и лайфхаки
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">20 марта 2024</span>
                  <span>10 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Вступление */}
              <p className="lead text-xl text-gray-700 mb-8">
                Согласно исследованиям, 50% новичков бросают тренировки через 3–6 месяцев из-за потери интереса или усталости. В этой статье — научно обоснованные методы сохранения мотивации и практические советы, которые помогут сделать тренировки регулярной частью жизни.
              </p>

              {/* Что вы узнаете */}
              <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-blue-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                <ul className="space-y-1 text-sm">
                  <li>Как работает психология мотивации</li>
                  <li>Инструменты для поддержания интереса к тренировкам</li>
                  <li>Как бороться с выгоранием и усталостью</li>
                  <li>Реальные истории успеха и лайфхаки</li>
                  <li>Практические советы для регулярности</li>
                </ul>
              </div>

              {/* 1. Психология мотивации */}
              <h2 id="psychology" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                Психология мотивации
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Теория самодетерминации</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li><strong>Автономия</strong> — возможность самостоятельно выбирать тип тренировок и их интенсивность</li>
                  <li><strong>Компетентность</strong> — ощущение прогресса и роста в выбранном виде активности</li>
                  <li><strong>Связь с другими</strong> — поддержка и взаимодействие с единомышленниками</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Метод «маленьких шагов»</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Достижение микроцелей эффективнее глобальных планов</li>
                  <li>Начинайте с 10-минутной зарядки по утрам</li>
                  <li>Постепенно увеличивайте продолжительность и интенсивность</li>
                </ul>
              </div>

              {/* 2. Инструменты для поддержания интереса */}
              <h2 id="tools" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                Инструменты для поддержания интереса
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Трекеры прогресса</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Используйте приложения для отслеживания тренировок (MyFitnessPal, Strava)</li>
                  <li>Визуализация прогресса помогает поддерживать мотивацию</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Геймификация</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Участвуйте в челленджах (например, «30 дней приседаний»)</li>
                  <li>Создайте систему вознаграждений</li>
                  <li>Делитесь достижениями с друзьями</li>
                </ul>
              </div>

              {/* 3. Как бороться с выгоранием */}
              <h2 id="burnout" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                Как бороться с выгоранием
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Смена активности</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Замените бег на плавание</li>
                  <li>Попробуйте йогу вместо силовых тренировок</li>
                  <li>Экспериментируйте с новыми видами активности</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Ментальные практики</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>5-минутная медитация перед тренировкой</li>
                  <li>Дыхательные упражнения для снижения стресса</li>
                  <li>Визуализация успешной тренировки</li>
                </ul>
              </div>

              {/* 4. Истории успеха */}
              <h2 id="success-stories" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                Истории успеха
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Кейс: Возвращение к тренировкам</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Совместные онлайн-тренировки с другом</li>
                  <li>Ежедневная отчетность о прогрессе</li>
                  <li>Взаимная поддержка и мотивация</li>
                </ul>
              </div>

              {/* Итоговый цветной блок */}
              <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-4">Итог: мотивация — это навык!</h2>
                <p className="mb-4">
                  Мотивация — это не врожденное качество, а навык, который можно развивать. Используйте научные методы, пробуйте новые подходы и не бойтесь просить поддержки.
                </p>
                <p className="font-bold">
                  Помните: регулярность важнее идеальности. Даже маленькие шаги ведут к большим результатам!
                </p>
              </div>

              {/* Теги */}
              <div className="flex flex-wrap gap-2 my-6">
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#мотивация</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#психология</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#тренировки</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#лайфхаки</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#спорт</span>
              </div>

              {/* Блок "Поделиться" */}
              <div className="p-6 md:p-8 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Поделиться статьей</h2>
                <div className="flex space-x-4">
                  <a 
                    href={`https://vk.com/share.php?url=https://athletdiary.ru/articles/kak-sohranit-motivaciyu`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Поделиться в ВКонтакте"
                  >
                    VK
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=https://athletdiary.ru/articles/kak-sohranit-motivaciyu`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Поделиться в Telegram"
                  >
                    Telegram
                  </a>
                  <a 
                    href={`https://wa.me/?text=Как сохранить мотивацию к тренировкам https://athletdiary.ru/articles/kak-sohranit-motivaciyu`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    aria-label="Поделиться в WhatsApp"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 