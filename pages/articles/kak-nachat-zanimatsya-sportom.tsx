import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

export default function KakNachatZanimatsyaSportomArticle() {
  // Форматирование даты для отображения
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Информация о статье
  const articleInfo = {
    title: 'Как начать заниматься спортом и не бросить через неделю',
    description: 'Практические советы для новичков, которые хотят начать регулярно тренироваться и сформировать полезную привычку.',
    date: '2023-10-15',
    readTime: '8 мин',
    tags: ['начинающим', 'мотивация', 'привычки'],
    slug: 'kak-nachat-zanimatsya-sportom'
  };

  return (
    <Layout title={`${articleInfo.title} | AthleteDiary`}>
      <Head>
        <meta name="description" content={articleInfo.description} />
        <meta name="keywords" content={articleInfo.tags.join(', ') + ', фитнес, тренировки, спорт, здоровье, начать заниматься спортом'} />
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content={articleInfo.title} />
        <meta property="og:description" content={articleInfo.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://athletdiary.ru/articles/${articleInfo.slug}`} />
        <meta property="og:image" content="/images/articles/fitness-beginner.jpg" />
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": articleInfo.title,
              "description": articleInfo.description,
              "image": "/images/articles/fitness-beginner.jpg",
              "datePublished": articleInfo.date,
              "author": {
                "@type": "Organization",
                "name": "AthleteDiary"
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
              <span className="text-gray-700">{articleInfo.title}</span>
            </nav>
          </div>
          
          {/* Контент статьи */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Заголовок и мета-информация */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {articleInfo.title}
              </h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <span>{formatDate(articleInfo.date)}</span>
                <span className="mx-2">•</span>
                <span>{articleInfo.readTime}</span>
                <span className="mx-2">•</span>
                <span>Автор: AthleteDiary</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {articleInfo.tags.map(tag => (
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
            
            {/* Изображение статьи */}
            <div className="relative h-64 md:h-96 w-full">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Изображение статьи</span>
              </div>
              {/* Заглушка для изображения */}
              {/* <Image 
                src="/images/articles/fitness-beginner.jpg" 
                alt={articleInfo.title} 
                fill 
                className="object-cover"
              /> */}
            </div>
            
            {/* Содержание статьи */}
            <div className="prose prose-lg max-w-none p-6 md:p-8">
              <h2>Почему так сложно начать заниматься спортом?</h2>
              <p>
                Начать заниматься спортом - это одно из самых распространенных намерений в современном мире. 
                Мы все знаем о пользе физической активности для здоровья, внешнего вида и самочувствия. 
                Однако статистика показывает, что большинство людей, начинающих тренироваться, бросают занятия 
                уже через 1-2 недели.
              </p>
              
              <p>Основные причины, почему люди бросают занятия спортом:</p>
              <ul>
                <li>Завышенные ожидания от результатов</li>
                <li>Слишком интенсивный старт, приводящий к физическому и психологическому истощению</li>
                <li>Отсутствие четкого плана тренировок</li>
                <li>Недостаток мотивации и поддержки</li>
                <li>Выбор неподходящего вида активности</li>
                <li>Неудобное расположение спортзала или высокая стоимость занятий</li>
              </ul>
              
              <p>
                Особенно сложно начать тренироваться тем, кто длительное время вел малоподвижный образ жизни. 
                Организм сопротивляется изменениям, и требуется время, чтобы адаптироваться к новым нагрузкам. 
                При этом результаты не приходят сразу, что дополнительно снижает мотивацию.
              </p>
              
              <h2>5 шагов, чтобы начать и не бросить</h2>
              
              <h3>1. Начинайте с малого</h3>
              <p>
                Вместо того чтобы сразу планировать 5 тренировок в неделю по часу, начните с 2-3 коротких занятий 
                по 20-30 минут. Это поможет вашему организму адаптироваться и значительно снизит психологический 
                барьер перед тренировками.
              </p>
              <p>
                Не стремитесь сразу к высоким нагрузкам. Начните с простых упражнений и постепенно увеличивайте 
                их сложность. Например, если вы хотите начать бегать, чередуйте ходьбу и бег короткими интервалами, 
                постепенно увеличивая продолжительность бега.
              </p>
              
              <h3>2. Выберите подходящую активность</h3>
              <p>
                Не существует "идеальной" тренировки, которая подходит всем. Экспериментируйте, чтобы найти то, 
                что приносит вам удовольствие - будь то силовые тренировки, кардио, йога, танцы или командные 
                виды спорта.
              </p>
              <p>
                Учитывайте свои предпочтения и особенности. Если вы любите общение, выбирайте групповые занятия. 
                Если предпочитаете заниматься в одиночестве - домашние тренировки или индивидуальные занятия в зале.
              </p>
              
              <h3>3. Поставьте конкретные, достижимые цели</h3>
              <p>
                Вместо расплывчатой цели "похудеть" или "стать сильнее", ставьте конкретные задачи: "выполнять 
                20 отжиманий за подход", "пробежать 5 км без остановки", "тренироваться 3 раза в неделю в течение месяца".
              </p>
              <p>
                Используйте принцип SMART для постановки целей:
              </p>
              <ul>
                <li><strong>S</strong>pecific (конкретная) - четко определите, чего хотите достичь</li>
                <li><strong>M</strong>easurable (измеримая) - должна быть возможность оценить прогресс</li>
                <li><strong>A</strong>chievable (достижимая) - цель должна быть реалистичной</li>
                <li><strong>R</strong>elevant (значимая) - цель должна быть важной для вас</li>
                <li><strong>T</strong>ime-bound (ограниченная по времени) - установите дедлайн</li>
              </ul>
              
              <h3>4. Ведите дневник тренировок</h3>
              <p>
                Записывайте свои достижения, отслеживайте прогресс и анализируйте результаты. Это поможет 
                поддерживать мотивацию и корректировать программу тренировок.
              </p>
              <p>
                В нашем приложении AthleteDiary есть все необходимые инструменты для отслеживания прогресса: 
                календарь тренировок, детальная статистика, возможность записывать вес, подходы и повторения. 
                Вы можете видеть свой прогресс и получать мотивацию от достигнутых результатов.
              </p>
              
              <h3>5. Сделайте спорт частью своего образа жизни</h3>
              <p>
                Встраивайте физическую активность в повседневную жизнь: ходите пешком, поднимайтесь по лестнице 
                вместо лифта, делайте перерывы на растяжку во время работы. Тренировки должны стать привычкой, 
                а не чем-то исключительным.
              </p>
              <p>
                По данным исследований, формирование новой привычки занимает в среднем 66 дней. Если вы будете 
                последовательны в течение двух месяцев, тренировки станут естественной частью вашей жизни.
              </p>
              
              <h2>Как поддерживать мотивацию</h2>
              <p>Мотивация не приходит сама собой - ее нужно культивировать:</p>
              
              <h3>Найдите партнера по тренировкам</h3>
              <p>
                Занятия с другом или партнером значительно повышают шансы на регулярные тренировки. Вы будете 
                чувствовать ответственность перед другим человеком, что снизит вероятность пропуска занятий.
              </p>
              
              <h3>Присоединитесь к сообществу</h3>
              <p>
                Группы единомышленников, спортивные клубы или онлайн-сообщества могут стать источником поддержки, 
                мотивации и полезных советов. Общение с людьми, имеющими схожие цели, помогает сохранять фокус и 
                интерес к тренировкам.
              </p>
              
              <h3>Вознаграждайте себя за достижения</h3>
              <p>
                Создайте систему поощрений за достигнутые цели. Это может быть что угодно: новая спортивная одежда, 
                массаж, выходной день или любая другая награда, которая важна для вас. Только не используйте в 
                качестве награды нездоровую пищу - это противоречит целям тренировок.
              </p>
              
              <h3>Отслеживайте прогресс</h3>
              <p>
                Делайте фотографии "до и после", ведите записи о весах и повторениях, измеряйте время забегов. 
                Визуальные и числовые доказательства прогресса — мощный мотиватор.
              </p>
              
              <h3>Разнообразьте тренировки</h3>
              <p>
                Монотонность — враг постоянства. Регулярно вносите изменения в тренировочную программу, пробуйте 
                новые упражнения, технологии, тренажеры. Это поддерживает интерес и предотвращает плато в результатах.
              </p>
              
              <h2>Преодоление трудностей и препятствий</h2>
              
              <h3>Нехватка времени</h3>
              <p>
                Самая распространенная причина отказа от тренировок — «нет времени». Решение — планирование. 
                Внесите тренировки в свой календарь как обязательные встречи. Рассмотрите возможность более 
                интенсивных, но коротких тренировок, например, HIIT (высокоинтенсивный интервальный тренинг).
              </p>
              
              <h3>Усталость и недостаток энергии</h3>
              <p>
                Парадоксально, но регулярные физические нагрузки повышают энергию, а не снижают ее. Если вы 
                чувствуете хроническую усталость, начните с очень легких тренировок, обратите внимание на 
                качество сна и питание. Иногда движение — лучшее лекарство от усталости.
              </p>
              
              <h3>Отсутствие видимых результатов</h3>
              <p>
                Помните, что изменения в организме происходят постепенно. Не ожидайте трансформации за неделю. 
                Помимо внешних изменений, обращайте внимание на улучшение самочувствия, уровня энергии, качества 
                сна, настроения — все это признаки положительных изменений.
              </p>
              
              <h2>Заключение</h2>
              <p>
                Начать заниматься спортом и сделать тренировки частью своей жизни возможно в любом возрасте и 
                при любом уровне физической подготовки. Главное — правильный подход, реалистичные ожидания и 
                постепенное формирование привычки.
              </p>
              <p>
                Помните, что даже небольшая регулярная активность гораздо лучше, чем интенсивные, но редкие 
                тренировки. Не стремитесь к совершенству, а стремитесь к последовательности.
              </p>
              <p>
                Наше приложение AthleteDiary создано, чтобы сделать ваш путь в спорте более простым, 
                структурированным и приятным. Начните сегодня — и через некоторое время вы будете удивляться, 
                как раньше могли жить без спорта!
              </p>
            </div>
            
            {/* Блок "Поделиться" */}
            <div className="p-6 md:p-8 border-t border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Поделиться статьей</h3>
              <div className="flex space-x-4">
                <a 
                  href={`https://vk.com/share.php?url=https://athletdiary.ru/articles/${articleInfo.slug}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  VK
                </a>
                <a 
                  href={`https://t.me/share/url?url=https://athletdiary.ru/articles/${articleInfo.slug}&text=${articleInfo.title}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  Telegram
                </a>
                <a 
                  href={`https://wa.me/?text=${articleInfo.title} https://athletdiary.ru/articles/${articleInfo.slug}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            
            {/* Блок с призывом к действию */}
            <div className="p-6 md:p-8 bg-blue-50 border-t border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Начните отслеживать свои тренировки уже сегодня!</h3>
              <p className="text-blue-700 mb-4">
                Ведение дневника тренировок - один из ключевых шагов к успеху. Наше приложение поможет вам отслеживать прогресс, 
                планировать занятия и достигать поставленных целей.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Начать использовать AthleteDiary
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 