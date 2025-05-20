import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';

const NutritionForWeightLossArticle: NextPage = () => {
  const [showTOC, setShowTOC] = useState(false);
  
  return (
    <Layout 
      title="Питание для похудения: что говорит наука? | AthleteDiary"
      description="Научно обоснованный подход к питанию для похудения: калорийный дефицит, макроэлементы, гормоны и практические советы"
      keywords="питание для похудения, научный подход к похудению, калорийный дефицит, макроэлементы, гормоны, интервальное голодание, микробиом, пищевые добавки"
    >
      <Head>
        {/* Канонический URL */}
        <link rel="canonical" href="https://athletdiary.ru/articles/nutrition-for-weight-loss" />
        
        {/* Open Graph разметка */}
        <meta property="og:title" content="Питание для похудения: что говорит наука?" />
        <meta property="og:description" content="Научно обоснованный подход к питанию для похудения: калорийный дефицит, макроэлементы, гормоны и практические советы" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://athletdiary.ru/articles/nutrition-for-weight-loss" />
        <meta property="og:image" content="https://athletdiary.ru/images/articles/nutrition-science.jpg" />
        <meta property="article:published_time" content="2024-03-20" />
        <meta property="article:modified_time" content="2024-03-20" />
        <meta property="article:section" content="Питание" />
        <meta property="article:tag" content="питание, похудение, диета, здоровье" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Питание для похудения: что говорит наука?" />
        <meta name="twitter:description" content="Научно обоснованный подход к питанию для похудения: калорийный дефицит, макроэлементы, гормоны и практические советы" />
        <meta name="twitter:image" content="https://athletdiary.ru/images/articles/nutrition-science.jpg" />
        
        {/* Структурированные данные */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Питание для похудения: что говорит наука?",
              "description": "Научно обоснованный подход к питанию для похудения: калорийный дефицит, макроэлементы, гормоны и практические советы",
              "image": "https://athletdiary.ru/images/articles/nutrition-science.jpg",
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
                "@id": "https://athletdiary.ru/articles/nutrition-for-weight-loss"
              },
              "keywords": "питание для похудения, научный подход к похудению, калорийный дефицит, макроэлементы, гормоны, интервальное голодание, микробиом, пищевые добавки",
              "articleSection": "Питание",
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
                src="/images/articles/nutrition-science.jpg"
                alt="Здоровое питание для похудения"
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Питание
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Питание для похудения: что говорит наука?
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">20 марта 2024</span>
                  <span>8 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Вступление */}
              <p className="lead text-xl text-gray-700 mb-8">
                В мире, где диетические тренды меняются быстрее, чем времена года, легко запутаться в том, что действительно работает для здорового и устойчивого снижения веса. В этой статье мы обратимся к научным данным, чтобы разобраться, какие принципы питания действительно эффективны для похудения, а какие представляют собой маркетинговые мифы.
              </p>

              {/* Что вы узнаете */}
              <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-blue-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                <ul className="space-y-1 text-sm">
                  <li>Почему калорийный дефицит — главный принцип похудения</li>
                  <li>Как сбалансировать белки, жиры и углеводы для максимального результата</li>
                  <li>Влияние гормонов и микробиома на вес</li>
                  <li>Реальные плюсы и минусы интервального голодания</li>
                  <li>Какие добавки действительно работают</li>
                  <li>Практические советы для устойчивого снижения веса</li>
                </ul>
              </div>

              {/* 1. Калорийный дефицит */}
              <h2 id="calories" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                Калорийный дефицит: фундаментальный принцип
              </h2>
              <p className="mt-4">
                Первый закон термодинамики неумолим: чтобы похудеть, необходимо потреблять меньше калорий, чем вы тратите. Исследования последовательно показывают, что независимо от типа диеты, снижение веса происходит только при наличии калорийного дефицита.
              </p>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="italic text-gray-700">
                  "Несмотря на популяризацию диет с различными соотношениями макронутриентов, энергетический баланс остается фундаментальным фактором регуляции веса тела" — исследование New England Journal of Medicine
                </p>
              </div>
              <p>
                Однако важно понимать, что не все калории равнозначны с точки зрения их влияния на организм. 100 калорий из курицы и 100 калорий из печенья оказывают разное воздействие на сытость, метаболизм и гормональный фон.
              </p>

              {/* 2. Баланс макроэлементов */}
              <h2 id="macros" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                Баланс макроэлементов: белки, жиры, углеводы
              </h2>
              <div className="relative w-full h-[300px] md:h-[400px] mb-8 mt-4">
                <Image
                  src="/images/articles/balanced-nutrition.jpg"
                  alt="Сбалансированное питание с правильным соотношением макроэлементов"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <p className="absolute bottom-4 left-4 text-sm text-white bg-black/50 px-3 py-1 rounded">
                  Сбалансированный рацион с оптимальным соотношением белков, жиров и углеводов
                </p>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Белки</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Сохраняют мышечную массу при похудении</li>
                  <li>Повышают чувство сытости</li>
                  <li>Стимулируют метаболизм</li>
                </ul>
              </div>
              <p>Исследования показывают, что потребление 1.6-2.2 г белка на кг веса оптимально для сохранения мышц при снижении веса.</p>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Жиры</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Участвуют в производстве гормонов</li>
                  <li>Улучшают усвоение жирорастворимых витаминов</li>
                  <li>Повышают чувство насыщения</li>
                </ul>
              </div>
              <p>Оптимальное потребление — 20-35% от общей калорийности, с акцентом на ненасыщенные жиры.</p>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Углеводы</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Содержат больше питательных веществ и клетчатки</li>
                  <li>Медленнее влияют на уровень сахара в крови</li>
                  <li>Обеспечивают более длительное насыщение</li>
                </ul>
              </div>
              <p>Цельные, необработанные источники предпочтительнее рафинированных углеводов.</p>

              {/* 3. Гормональные влияния */}
              <h2 id="hormones" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                Гормональные влияния на вес
              </h2>
              <p className="mt-4">Гормоны играют значительную роль в регуляции веса. Ключевые гормональные факторы включают:</p>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Инсулин</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Ограничение рафинированных углеводов и сахара</li>
                  <li>Регулярное питание небольшими порциями</li>
                  <li>Физическая активность</li>
                </ul>
              </div>
              <p>Стабилизация уровня инсулина способствует более эффективному снижению веса.</p>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Лептин и грелин</h3>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Достаточный сон (7-9 часов) критически важен для нормализации этих гормонов</li>
                  <li>Высокое потребление белка помогает контролировать грелин</li>
                  <li>Регулярное питание стабилизирует их уровни</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-yellow-800">
                  <strong>Важно:</strong> Хронический стресс повышает уровень кортизола, что может вызывать накопление жира в области живота и усиливать тягу к высококалорийной пище.
                </p>
              </div>

              {/* 4. Интервальное голодание */}
              <h2 id="fasting" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                Интервальное голодание: наука и практика
              </h2>
              <p className="mt-4">Интервальное голодание (ИГ) привлекло значительное внимание исследователей. Научные данные указывают на его потенциальные преимущества:</p>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Улучшение чувствительности к инсулину</li>
                  <li>Стимуляция аутофагии (клеточное очищение)</li>
                  <li>Снижение воспаления</li>
                  <li>Возможное продление продолжительности жизни</li>
                </ul>
              </div>
              <p>Популярные протоколы ИГ: 16/8, 5:2, ОМАД. Важно: ИГ подходит не всем, особенно при определённых медицинских состояниях.</p>

              {/* 5. Микробиом кишечника */}
              <h2 id="microbiome" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">5</span>
                Микробиом кишечника и вес
              </h2>
              <p className="mt-4">Здоровая кишечная микрофлора может улучшать обмен веществ, снижать воспаление и регулировать аппетит.</p>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Разнообразное потребление растительной пищи (30+ видов в неделю)</li>
                  <li>Регулярное употребление пребиотиков и ферментированных продуктов</li>
                  <li>Ограничение искусственных подсластителей</li>
                </ul>
              </div>

              {/* 6. Пищевые добавки */}
              <h2 id="supplements" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">6</span>
                Пищевые добавки: что действительно работает?
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <h3 className="font-bold mb-2">С доказанной эффективностью:</h3>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Протеиновые добавки — увеличивают потребление белка и чувство сытости</li>
                  <li>Клетчатка — улучшает насыщение и регулирует аппетит</li>
                  <li>Кофеин — умеренно повышает расход энергии</li>
                  <li>Зеленый чай — катехины ускоряют метаболизм</li>
                </ul>
                <h3 className="font-bold mt-4 mb-2">С неубедительными доказательствами:</h3>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>CLA, гарциния, расторопша, L-карнитин</li>
                </ul>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
                <p className="text-red-800">
                  <strong>Важно!</strong> Добавки не регулируются так же строго, как лекарства. Всегда консультируйтесь с врачом перед началом приема любых добавок.
                </p>
              </div>

              {/* 7. Практические советы */}
              <h2 id="practical" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">7</span>
                Практические советы для устойчивого снижения веса
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>Составляйте недельное меню заранее</li>
                  <li>Готовьте еду дома, контролируя ингредиенты</li>
                  <li>Держите здоровые перекусы под рукой</li>
                  <li>Используйте тарелки меньшего размера</li>
                  <li>Пейте воду перед приемами пищи</li>
                  <li>Практикуйте осознанное питание</li>
                  <li>Ведите дневник питания</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-green-800">
                  Исследования показывают, что люди, ведущие дневник питания, теряют в 2 раза больше веса, чем те, кто этого не делает.
                </p>
              </div>

              {/* Итоговый цветной блок */}
              <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-4">Итог: наука и практика</h2>
                <p className="mb-4">
                  Наука о питании для похудения постоянно развивается, но фундаментальные принципы остаются неизменными. Самый эффективный план питания — тот, которого вы можете придерживаться долгосрочно. Постепенные, устойчивые изменения в привычках питания принесут больше пользы, чем радикальные краткосрочные диеты.
                </p>
                <p className="font-bold">
                  Помните: питание — лишь один из компонентов здорового снижения веса. Физическая активность, качественный сон и управление стрессом также важны для результата.
                </p>
              </div>

              {/* Теги */}
              <div className="flex flex-wrap gap-2 my-6">
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#питание</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#похудение</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#здоровье</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#наука</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">#калории</span>
              </div>

              {/* Рекомендуемые статьи и поделиться — оставить как есть */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Рекомендуемые статьи</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/articles/nutrition-for-weight-loss" className="group block">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image 
                        src="/images/articles/gym-beginner.jpg"
                        alt="Начало тренировок в зале"
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Как начать заниматься в тренажерном зале: 7 шагов для новичков
                    </h4>
                  </Link>
                  <Link href="/articles/best-exercises-for-weight-loss" className="group block">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image 
                        src="/images/articles/exercises-weight-loss.jpg"
                        alt="Упражнения для похудения"
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Лучшие упражнения для похудения: научный подход
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Блок "Поделиться" */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Поделиться статьей</h3>
                <div className="flex space-x-4">
                  <a 
                    href={`https://vk.com/share.php?url=https://athletdiary.ru/articles/nutrition-for-weight-loss`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Поделиться в ВКонтакте"
                  >
                    VK
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=https://athletdiary.ru/articles/nutrition-for-weight-loss`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Поделиться в Telegram"
                  >
                    Telegram
                  </a>
                  <a 
                    href={`https://wa.me/?text=Питание для похудения: что говорит наука? https://athletdiary.ru/articles/nutrition-for-weight-loss`} 
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
};

export default NutritionForWeightLossArticle; 