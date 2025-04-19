import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function CardioVsStrengthTraining() {
  return (
    <>
      <Head>
        <title>Кардио vs силовые тренировки: что выбрать для достижения ваших целей? | AthleteDiary</title>
        <meta name="description" content="Сравнение эффективности кардио и силовых тренировок для разных целей: похудение, набор мышечной массы, выносливость и общее здоровье" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-80 md:h-96">
              <Image 
                src="/images/articles/cardio-strength.jpg" 
                alt="Сравнение кардио и силовых тренировок" 
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Тренировки
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Кардио vs силовые тренировки: что выбрать для достижения ваших целей?
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">10 марта 2025</span>
                  <span>7 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-gray-700">
                  Выбор между кардио и силовыми тренировками — один из самых частых вопросов в фитнес-сообществе. Оба вида активности полезны, но их эффективность зависит от ваших целей: похудение, набор мышечной массы, улучшение выносливости или общее укрепление здоровья. Разберемся, как работают эти тренировки и кому подходит каждый вариант.
                </p>

                <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h2 className="text-blue-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                  <ul className="space-y-1 text-sm">
                    <li>Основные преимущества и недостатки кардио тренировок</li>
                    <li>Как силовые нагрузки влияют на метаболизм и формирование рельефа</li>
                    <li>Научные данные о сравнительной эффективности разных видов тренировок</li>
                    <li>Как составить оптимальную программу в зависимости от ваших целей</li>
                  </ul>
                </div>

                <h2 id="cardio" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                  Кардио: сжигание калорий и укрепление сердца
                </h2>
                
                <p>
                  Кардиотренировки (аэробные нагрузки) — это упражнения, повышающие частоту сердечных сокращений: бег, плавание, велосипед, прыжки на скакалке, танцы.
                </p>
                
                <h3 className="text-xl font-bold text-gray-800 mt-6">Преимущества</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Сжигание жира</h4>
                    <p className="text-gray-700 text-sm">
                      Во время кардио организм активно расходует калории, особенно при длительных сессиях (от 30 минут). Например, час бега сжигает около 600–800 ккал.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Здоровье сердца</h4>
                    <p className="text-gray-700 text-sm">
                      Улучшение работы сердца и легких. Регулярные аэробные нагрузки снижают риск сердечно-сосудистых заболеваний.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Выносливость</h4>
                    <p className="text-gray-700 text-sm">
                      Кардио адаптирует организм к длительным нагрузкам, повышая общую выносливость и работоспособность.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6">Недостатки</h3>
                
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                  <ul className="space-y-2">
                    <li><strong>Потеря мышечной массы</strong> при избыточных нагрузках.</li>
                    <li><strong>Плато эффекта.</strong> Тело привыкает к однотипным упражнениям, и прогресс замедляется.</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6">Кому подходит</h3>
                
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Тем, кто хочет быстро похудеть.</li>
                  <li>Новичкам, начинающим с низкой интенсивности.</li>
                  <li>Спортсменам для развития аэробной выносливости.</li>
                </ul>

                <h2 id="strength" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                  Силовые тренировки: рост мышц и ускорение метаболизма
                </h2>

                <p>
                  Силовые (анаэробные) тренировки направлены на развитие силы и мышечной массы: работа с весами, приседания, отжимания, упражнения на тренажерах.
                </p>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-80 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/strength-training.jpg" 
                      alt="Силовая тренировка" 
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm">
                        Силовые тренировки формируют рельеф и увеличивают расход калорий даже в состоянии покоя
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6">Преимущества</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Ускорение метаболизма</h4>
                    <p className="text-gray-700 text-sm">
                      Мышцы потребляют больше энергии даже в покое. Каждый килограмм мышц сжигает около 13 ккал в сутки.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Формирование рельефа</h4>
                    <p className="text-gray-700 text-sm">
                      Силовые упражнения подчеркивают мышечный корсет и улучшают пропорции тела.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Укрепление костей</h4>
                    <p className="text-gray-700 text-sm">
                      Тренировки с отягощениями повышают плотность костной ткани и укрепляют суставы.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6">Недостатки</h3>
                
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                  <ul className="space-y-2">
                    <li><strong>Риск травм</strong> при неправильной технике.</li>
                    <li><strong>Медленное жиросжигание.</strong> Для похудения требуется сочетание с кардио и диетой.</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6">Кому подходит</h3>
                
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Тем, кто хочет набрать мышечную массу.</li>
                  <li>Людям, стремящимся улучшить пропорции тела.</li>
                  <li>Спортсменам для повышения силовых показателей.</li>
                </ul>

                <h2 id="science" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                  Научные данные: что эффективнее?
                </h2>

                <div className="bg-gray-50 p-5 rounded-lg my-6">
                  <p className="mb-4">Исследования показывают, что:</p>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-400 text-white mr-2 mt-1">
                        1
                      </div>
                      <p>Для <strong>похудения</strong> комбинация кардио и силовых тренировок дает лучший результат. Кардио сжигает жир, а силовые сохраняют мышцы.</p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-400 text-white mr-2 mt-1">
                        2
                      </div>
                      <p>Для <strong>долгосрочного метаболизма</strong> силовые тренировки эффективнее. Мышцы увеличивают базовый расход калорий.</p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-400 text-white mr-2 mt-1">
                        3
                      </div>
                      <p>Кардио полезнее для <strong>сердца</strong>, но избыток аэробных нагрузок может снижать уровень тестостерона у мужчин.</p>
                    </li>
                  </ul>
                </div>

                <h2 id="recommendations" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                  Рекомендации по выбору
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Цель — похудение</h3>
                    <p className="text-gray-700">
                      3–4 кардиосессии в неделю (бег, велосипед) + 2 силовые тренировки для сохранения мышц.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Цель — набор массы</h3>
                    <p className="text-gray-700">
                      Акцент на силовые упражнения (4–5 раз в неделю) + 1–2 коротких кардиосессии для поддержания выносливости.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Общее здоровье</h3>
                    <p className="text-gray-700">
                      Чередуйте оба вида. Например: понедельник — силовая, среда — кардио, пятница — функциональный тренинг.
                    </p>
                  </div>
                </div>

                <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                  <h2 className="text-2xl font-bold mb-4">Итог: комбинируйте!</h2>
                  <p className="mb-4">
                    Кардио и силовые тренировки не конкуренты, а союзники. Для максимального эффекта объедините их:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li>Начинайте тренировку с силовых упражнений (чтобы истощить запасы гликогена), затем переходите к кардио для жиросжигания.</li>
                    <li>Используйте интервальные тренировки (HIIT), сочетающие оба типа нагрузок.</li>
                  </ul>
                  <p className="font-bold">
                    Помните: результат зависит не только от типа тренировок, но и от питания, восстановления и регулярности. Перед началом программы проконсультируйтесь с тренером!
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #кардио
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #силовыетренировки
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #фитнес
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #тренировки
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #эффективность
                  </span>
                </div>

                <hr className="my-8" />

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Рекомендуемые статьи</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/articles/best-exercises-for-weight-loss" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">Лучшие упражнения для похудения: научный подход</h4>
                      <p className="text-sm text-gray-600">Научно обоснованные упражнения для эффективного сжигания жира</p>
                    </Link>
                    <Link href="/articles/gym-beginners-guide" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">Как начать заниматься в тренажерном зале: 7 шагов для новичков</h4>
                      <p className="text-sm text-gray-600">Подробное руководство по началу тренировок в тренажерном зале</p>
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