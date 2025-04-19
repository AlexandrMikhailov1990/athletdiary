import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function BestExercisesForWeightLoss() {
  return (
    <>
      <Head>
        <title>Лучшие упражнения для похудения: научный подход | AthleteDiary</title>
        <meta name="description" content="Научно обоснованные упражнения для эффективного сжигания жира и похудения" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-80 md:h-96">
              <Image 
                src="/images/articles/weight-loss-exercises.jpg" 
                alt="Упражнения для похудения" 
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Фитнес
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Лучшие упражнения для похудения: научный подход
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">24 февраля 2025</span>
                  <span>10 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-gray-700">
                  <strong>Похудение — это не только вопрос эстетики, но и здоровья.</strong> Современные исследования показывают, что эффективность тренировок зависит от их способности активировать метаболические процессы и создавать устойчивый энергодефицит. Разберем, какие упражнения подтверждены наукой для сжигания жира.
                </p>

                <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h2 className="text-blue-800 text-lg font-medium mb-2">Ключевые выводы</h2>
                  <ul className="space-y-1 text-sm">
                    <li>HIIT-тренировки могут снизить жировую массу на 1,5-2,5% за 12 недель</li>
                    <li>Силовые тренировки повышают расход энергии в состоянии покоя на 5-7%</li>
                    <li>Плавание сжигает на 20% больше калорий, чем велотренажер</li>
                    <li>Комбинированные тренировки увеличивают расход калорий на 12-18%</li>
                    <li>Повседневная активность составляет до 30% суточного расхода энергии</li>
                  </ul>
                </div>

                <h2 id="hiit" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                  Высокоинтенсивные интервальные тренировки (HIIT)
                </h2>
                
                <p>
                  HIIT сочетает короткие периоды максимальной нагрузки с восстановительными интервалами. Метаанализ 2018 года доказал, что такие тренировки снижают общую жировую массу на 1,5-2,5% за 12 недель, а висцеральный жир — на 6-17%.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <h3 className="font-bold text-gray-800 mb-2">Механизм действия:</h3>
                  <p className="text-gray-700">
                    HIIT повышает уровень EPOC (кислородный долг), увеличивая расход калорий на 15-25% в течение 24 часов после тренировки.
                  </p>
                  <h3 className="font-bold text-gray-800 mt-3 mb-2">Пример:</h3>
                  <p className="text-gray-700">
                    30 секунд спринта + 1 минута ходьбы (8-10 циклов).
                  </p>
                </div>

                <h2 id="strength" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                  Силовые тренировки с метаболическим стрессом
                </h2>

                <p>
                  Упражнения с отягощениями в режиме 8-12 повторений до мышечного отказа стимулируют выработку гормона роста, который ускоряет липолиз. Исследования подтверждают, что метаболический стресс от многоповторных подходов повышает расход энергии на 5-7% в состоянии покоя.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Оптимальные упражнения:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Приседания с весом</li>
                      <li>Становая тяга</li>
                      <li>Жим лежа</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Рекомендация:</h3>
                    <p className="text-gray-700">
                      3 подхода по 12 повторений с 60-секундным отдыхом.
                    </p>
                  </div>
                </div>

                <h2 id="liss" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                  Низкоинтенсивное кардио (LISS)
                </h2>

                <p>
                  Ходьба, плавание или езда на велосипеде в умеренном темпе (50-70% от максимального пульса) задействуют жир как основной источник энергии. Сравнение плавания и велотренажера показало: за 60 минут плавание сжигает на 20% больше калорий благодаря сопротивлению воды.
                </p>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 my-6">
                  <h3 className="font-bold text-green-800 mb-2">Совет эксперта:</h3>
                  <p className="text-gray-700">
                    45-60 минут LISS 4-5 раз в неделю. Выбирайте активность, которая вам нравится — это повысит вероятность регулярных тренировок.
                  </p>
                </div>

                <h2 id="combined" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                  Комбинированные тренировки
                </h2>

                <p>
                  Сочетание силовых и кардионагрузок увеличивает суточный расход калорий на 12-18% по сравнению с изолированными тренировками. Исследование 2020 года выявило, что круговые тренировки снижают абдоминальный жир на 3,8% за 8 недель.
                </p>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-80 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/combined-training.jpg" 
                      alt="Комбинированные тренировки" 
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm">
                        Комбинированная тренировка сочетает силовые упражнения и кардио для максимального эффекта
                      </p>
                    </div>
                  </div>
                </div>

                <h2 id="neat" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">5</span>
                  NEAT: неспортивная активность
                </h2>

                <p>
                  Повседневные движения (ходьба, уборка, подъем по лестнице) составляют до 30% суточного расхода энергии. Увеличение NEAT на 2000 шагов в день помогает сжечь дополнительно 100-150 ккал.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg my-6">
                  <h3 className="font-bold text-yellow-800 mb-3">Простые способы увеличить NEAT:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-yellow-400 text-white mr-2">
                        1
                      </div>
                      <p className="text-sm">Используйте лестницу вместо лифта</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-yellow-400 text-white mr-2">
                        2
                      </div>
                      <p className="text-sm">Паркуйтесь дальше от входа</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-yellow-400 text-white mr-2">
                        3
                      </div>
                      <p className="text-sm">Совершайте короткие прогулки после еды</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-yellow-400 text-white mr-2">
                        4
                      </div>
                      <p className="text-sm">Проводите телефонные разговоры стоя</p>
                    </div>
                  </div>
                </div>

                <h2 id="cortisol" className="text-2xl font-bold text-gray-800 mt-10">
                  Почему важен баланс кортизола?
                </h2>

                <p>
                  Страх перед «катаболическим эффектом» длительных тренировок преувеличен. Умеренное повышение кортизола во время нагрузок стимулирует мобилизацию жировых запасов. Исследования Muscle & Strength доказывают: тренировки до 90 минут не вызывают значительной потери мышечной массы при адекватном питании.
                </p>

                <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                  <h2 className="text-2xl font-bold mb-4">Заключение</h2>
                  <p className="mb-4">
                    Для максимального жиросжигания комбинируйте HIIT, силовые тренировки и LISS. Не забывайте о NEAT: даже 10-минутная прогулка после еды снижает уровень глюкозы в крови на 12-15%.
                  </p>
                  <p className="font-bold">
                    Помните — устойчивое похудение требует не только физической активности, но и контроля питания.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #похудение
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #фитнес
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #HIIT
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #жиросжигание
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #метаболизм
                  </span>
                </div>

                <hr className="my-8" />

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Рекомендуемые статьи</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/articles/nutrition-for-weight-loss" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">Питание для похудения: что говорит наука?</h4>
                      <p className="text-sm text-gray-600">Научно обоснованные принципы питания для устойчивого снижения веса</p>
                    </Link>
                    <Link href="/articles/cardio-vs-strength-training" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">Кардио vs силовые тренировки: что выбрать?</h4>
                      <p className="text-sm text-gray-600">Сравнение эффективности разных видов тренировок для разных целей</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 