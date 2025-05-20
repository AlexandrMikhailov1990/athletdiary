import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

export default function HomeWorkoutArticle() {
  return (
    <Layout 
      title="Домашние тренировки без оборудования: программа на 4 недели | AthleteDiary"
      description="Эффективная программа домашних тренировок без специального оборудования. Подробные планы для начинающих и продвинутых, техника выполнения упражнений и советы по прогрессии."
      keywords="домашние тренировки, тренировки без оборудования, программа тренировок, упражнения дома, фитнес дома, тренировки для начинающих, домашний фитнес, упражнения с собственным весом"
    >
      <Head>
        {/* Канонический URL */}
        <link rel="canonical" href="https://athletdiary.ru/articles/domashnie-trenirovki" />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content="Домашние тренировки без оборудования: программа на 4 недели" />
        <meta property="og:description" content="Эффективная программа домашних тренировок без специального оборудования. Подробные планы для начинающих и продвинутых, техника выполнения упражнений и советы по прогрессии." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://athletdiary.ru/articles/domashnie-trenirovki" />
        <meta property="og:image" content="https://athletdiary.ru/images/articles/home-workout.jpg" />
        <meta property="article:published_time" content="2024-03-20" />
        <meta property="article:modified_time" content="2024-03-20" />
        <meta property="article:section" content="Тренировки" />
        <meta property="article:tag" content="домашние тренировки, фитнес, упражнения, тренировки для начинающих" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Домашние тренировки без оборудования: программа на 4 недели" />
        <meta name="twitter:description" content="Эффективная программа домашних тренировок без специального оборудования. Подробные планы для начинающих и продвинутых, техника выполнения упражнений и советы по прогрессии." />
        <meta name="twitter:image" content="https://athletdiary.ru/images/articles/home-workout.jpg" />
        
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Домашние тренировки без оборудования: программа на 4 недели",
              "description": "Эффективная программа домашних тренировок без специального оборудования. Подробные планы для начинающих и продвинутых, техника выполнения упражнений и советы по прогрессии.",
              "image": "https://athletdiary.ru/images/articles/home-workout.jpg",
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
                "@id": "https://athletdiary.ru/articles/domashnie-trenirovki"
              },
              "keywords": "домашние тренировки, тренировки без оборудования, программа тренировок, упражнения дома, фитнес дома, тренировки для начинающих, домашний фитнес, упражнения с собственным весом",
              "articleSection": "Тренировки",
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
                src="/images/articles/home-workout.jpg"
                alt="Домашние тренировки без оборудования"
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Тренировки
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Домашние тренировки без оборудования: программа на 4 недели
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">20 марта 2024</span>
                  <span>12 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Вступление */}
              <p className="lead text-xl text-gray-700 mb-8">
                68% людей предпочитают заниматься дома из-за экономии времени, но сталкиваются с нехваткой знаний о технике и структуре занятий. В этой статье — эффективная программа домашних тренировок без специального оборудования для любого уровня.
              </p>

              {/* Что вы узнаете */}
              <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-blue-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                <ul className="space-y-1 text-sm">
                  <li>Базовые принципы домашних тренировок</li>
                  <li>Программы для начинающих и продвинутых</li>
                  <li>Как избежать типичных ошибок</li>
                  <li>Использование подручных средств для прогрессии</li>
                  <li>Практические советы для мотивации и регулярности</li>
                </ul>
              </div>

              {/* 1. Базовые принципы */}
              <h2 id="basics" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                Базовые принципы
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Правило прогрессии</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Увеличивайте количество повторений</li>
                  <li>Усложняйте технику упражнений</li>
                  <li>Сокращайте отдых между подходами</li>
                  <li>Добавляйте изометрические удержания</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Баланс нагрузки</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li><strong>Кардио</strong> — бурпи, прыжки, бег на месте</li>
                  <li><strong>Силовые упражнения</strong> — приседания, отжимания, планка</li>
                  <li><strong>Растяжка</strong> — для гибкости и восстановления</li>
                </ul>
              </div>

              {/* 2. Программа тренировок */}
              <h2 id="program" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                Программа тренировок
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Для новичков</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">День 1: Силовая тренировка</h4>
                <ul>
                  <li>3 подхода по 15 приседаний</li>
                  <li>3 подхода по 10 отжиманий от стола</li>
                  <li>3 подхода по 30 секунд планки</li>
                  <li>3 подхода по 10 выпадов на каждую ногу</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">День 2: Кардио</h4>
                <ul>
                  <li>20 минут интервального кардио:
                    <ul>
                      <li>30 секунд прыжков</li>
                      <li>30 секунд отдыха</li>
                    </ul>
                  </li>
                  <li>3 подхода по 1 минуте бега на месте</li>
                  <li>3 подхода по 30 секунд альпиниста</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Для продвинутых</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Комплекс «100 повторений»</h4>
                <ul>
                  <li>100 воздушных приседаний</li>
                  <li>100 альпинистов</li>
                  <li>100 скручиваний</li>
                  <li>Выполнять на время с минимальным отдыхом</li>
                </ul>
              </div>

              {/* 3. Ошибки и решения */}
              <h2 id="mistakes" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                Ошибки и решения
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Отсутствие разминки</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Вращения плечами</li>
                  <li>Наклоны корпуса</li>
                  <li>Выпады на месте</li>
                  <li>Прыжки на месте</li>
                </ul>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Неправильное дыхание</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Вдох на расслаблении</li>
                  <li>Выдох на усилии</li>
                  <li>Дыхание животом</li>
                  <li>Ритмичное дыхание</li>
                </ul>
              </div>

              {/* 4. Использование подручных средств */}
              <h2 id="equipment" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                Использование подручных средств
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Импровизированное оборудование</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Рюкзак с книгами вместо утяжелителя</li>
                  <li>Полотенце для упражнений на скольжение</li>
                  <li>Стул для отжиманий и приседаний</li>
                  <li>Бутылки с водой вместо гантелей</li>
                </ul>
              </div>

              {/* Итоговый цветной блок */}
              <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-4">Итог: тренируйтесь с умом!</h2>
                <p className="mb-4">
                  Домашние тренировки могут быть не менее эффективными, чем занятия в зале. Главное — регулярность, прогрессия и внимание к технике.
                </p>
                <p className="font-bold">
                  Помните: даже 20 минут в день — это вклад в ваше здоровье и энергию!
                </p>
              </div>

              {/* Теги */}
              <div className="flex flex-wrap gap-2 my-6">
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#домашниетренировки</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#фитнес</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#упражнения</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#мотивация</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#здоровье</span>
              </div>

              {/* Блок "Поделиться" */}
              <div className="p-6 md:p-8 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Поделиться статьей</h2>
                <div className="flex space-x-4">
                  <a 
                    href={`https://vk.com/share.php?url=https://athletdiary.ru/articles/domashnie-trenirovki`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Поделиться в ВКонтакте"
                  >
                    VK
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=https://athletdiary.ru/articles/domashnie-trenirovki`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Поделиться в Telegram"
                  >
                    Telegram
                  </a>
                  <a 
                    href={`https://wa.me/?text=Домашние тренировки без оборудования https://athletdiary.ru/articles/domashnie-trenirovki`} 
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