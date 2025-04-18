import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function GymBeginnersGuide() {
  return (
    <>
      <Head>
        <title>Как начать заниматься в тренажерном зале: 7 шагов для новичков | AthleteDiary</title>
        <meta name="description" content="Подробное руководство по началу тренировок в тренажерном зале для начинающих: выбор зала, первые тренировки, питание и мотивация" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-80 md:h-96">
              <Image 
                src="/images/articles/gym-beginner.jpg" 
                alt="Человек перед тренажерным залом" 
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4 w-auto max-w-[200px]">
                  Для начинающих
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Как начать заниматься в тренажерном зале: 7 шагов для новичков
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">20 июня 2023</span>
                  <span>8 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-gray-700">
                  Первый визит в тренажерный зал может вызывать стресс и неуверенность. Не волнуйтесь — каждый тренирующийся когда-то был новичком. Следуя этим 7 шагам, вы сможете уверенно начать путь к здоровому и сильному телу.
                </p>

                <div className="my-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h2 className="text-blue-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                  <ul className="space-y-1 text-sm">
                    <li>Как правильно определить свои фитнес-цели</li>
                    <li>На что обращать внимание при выборе тренажерного зала</li>
                    <li>С каких упражнений начать и как составить первый план тренировок</li>
                    <li>Как преодолеть страх перед первым посещением зала</li>
                    <li>Основы питания и восстановления для максимальных результатов</li>
                  </ul>
                </div>

                <h2 id="set-goals" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">1</span>
                  Поставьте четкую цель
                </h2>
                
                <p>
                  Без конкретной цели мотивация быстро угаснет. Цель должна быть конкретной, измеримой и ограниченной по времени. Например:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Похудеть на 5 кг за 2 месяца.</li>
                  <li>Укрепить мышцы спины для улучшения осанки.</li>
                  <li>Подготовиться к марафону.</li>
                </ul>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 my-6">
                  <h3 className="font-bold text-green-800 mb-2">Совет:</h3>
                  <p className="text-gray-700">
                    Запишите цель в блокнот или приложение (MyFitnessPal, Google Fit). Видимый прогресс — лучший стимул!
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-72 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/training-plan.jpg" 
                      alt="Блокнот с планом тренировок" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <h2 id="choose-gym" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">2</span>
                  Выберите «свой» зал
                </h2>

                <p>
                  Правильно выбранный тренажерный зал значительно повысит вашу мотивацию. Обратите внимание на следующие критерии:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Локация</h3>
                    <p className="text-gray-700 text-sm">
                      Ищите зал рядом с домом или работой. Для Москвы актуальны запросы вроде «тренажерный зал на Чистых прудах» или «фитнес-клуб в районе Хамовники».
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Оснащение</h3>
                    <p className="text-gray-700 text-sm">
                      Проверьте наличие тренажеров для ваших целей (кардио, силовые, зоны функционального тренинга).
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Атмосфера</h3>
                    <p className="text-gray-700 text-sm">
                      Посетите пробное занятие. Если чувствуете дискомфорт, ищите другой вариант.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg my-6">
                  <h3 className="font-bold text-yellow-800 mb-2">Важно:</h3>
                  <p className="text-gray-700">
                    89% топовых клубов используют в описаниях названия районов — это повышает релевантность в поиске.
                  </p>
                </div>

                <h2 id="start-small" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">3</span>
                  Начните с малого
                </h2>

                <p>
                  Не пытайтесь сразу повторить программу опытных спортсменов. Начните с базовых упражнений и постепенно увеличивайте нагрузку. Вот пример плана для первых недель:
                </p>

                <div className="overflow-x-auto my-6">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 border-b text-left">День</th>
                        <th className="py-3 px-4 border-b text-left">Упражнения</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 border-b font-medium">Понедельник</td>
                        <td className="py-3 px-4 border-b">Приседания (3 подхода × 12 раз), жим гантелей (3×10), планка (1 минута)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-medium">Среда</td>
                        <td className="py-3 px-4 border-b">Тяга верхнего блока (3×12), выпады (3×10), скручивания на пресс (3×15)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-medium">Пятница</td>
                        <td className="py-3 px-4 border-b">Кардио (беговая дорожка — 20 минут)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-72 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/squat-exercise.jpg" 
                      alt="Девушка выполняет приседания с гантелями" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <h2 id="find-support" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">4</span>
                  Найдите поддержку
                </h2>

                <p>
                  Поддержка значительно увеличивает шансы на успех в тренировках. Рассмотрите следующие варианты:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Тренер</h3>
                    <p className="text-gray-700 text-sm">
                      Поможет избежать травм и составит программу. Проверьте его сертификаты и отзывы.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Групповые занятия</h3>
                    <p className="text-gray-700 text-sm">
                      Йога, TRX или функциональный тренинг добавят разнообразия.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Друзья</h3>
                    <p className="text-gray-700 text-sm">
                      Совместные тренировки повышают ответственность.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg my-6">
                  <h3 className="font-bold text-blue-800 mb-2">Статистика:</h3>
                  <p className="text-gray-700">
                    Люди, занимающиеся в паре, на 34% реже бросают тренировки.
                  </p>
                </div>

                <h2 id="overcome-fear" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">5</span>
                  Преодолейте страх
                </h2>

                <p>
                  Многие новички испытывают неуверенность перед первым посещением зала. Вот как справиться с типичными страхами:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Страх №1: «Я выгляжу смешно»</h3>
                    <p className="text-gray-700">
                      <strong>Решение:</strong> 95% посетителей сосредоточены на себе, а не на окружающих. Никто не оценивает ваш внешний вид или технику так критично, как вы сами.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Страх №2: «Не разберусь в тренажерах»</h3>
                    <p className="text-gray-700">
                      <strong>Решение:</strong> Попросите дежурного тренера провести вводный инструктаж. Большинство современных тренажеров имеют схемы выполнения упражнений.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-72 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/trainer-instruction.jpg" 
                      alt="Тренер объясняет технику упражнения" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <h2 id="nutrition-recovery" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">6</span>
                  Следите за питанием и восстановлением
                </h2>

                <p>
                  Результаты тренировок на 70% зависят от того, что происходит за пределами зала. Уделите внимание:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Питание</h3>
                    <p className="text-gray-700 text-sm">
                      Белок (курица, творог), сложные углеводы (гречка, овсянка), вода (1.5–2 л/день).
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Сон</h3>
                    <p className="text-gray-700 text-sm">
                      7–8 часов — без этого мышцы не растут и энергия не восстанавливается.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Растяжка</h3>
                    <p className="text-gray-700 text-sm">
                      10 минут после тренировки снизят крепатуру и улучшат восстановление.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg my-6">
                  <h3 className="font-bold text-green-800 mb-2">Лайфхак:</h3>
                  <p className="text-gray-700">
                    Используйте гео-ключи в рационе. Например, «доставка правильного питания в Москве».
                  </p>
                </div>

                <h2 id="track-progress" className="text-2xl font-bold text-gray-800 mt-10 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 text-sm">7</span>
                  Отслеживайте прогресс
                </h2>

                <p>
                  Измеряйте и фиксируйте свой прогресс. Это помогает увидеть изменения, которые могут быть неочевидны на первый взгляд:
                </p>

                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong>Фото «до/после»</strong> — делайте снимки раз в месяц.</li>
                  <li><strong>Замеры объемов</strong> — талия, бедра, грудь.</li>
                  <li><strong>Дневник тренировок</strong> — отмечайте веса, подходы и самочувствие.</li>
                </ul>

                <div className="relative overflow-hidden rounded-lg my-8">
                  <div className="h-64 md:h-72 bg-gray-200 relative">
                    <Image 
                      src="/images/articles/progress-tracking.jpg" 
                      alt="График прогресса в приложении" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <h2 id="faq" className="text-2xl font-bold text-gray-800 mt-10">
                  FAQ — Часто задаваемые вопросы
                </h2>

                <div className="space-y-6 my-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Что делать, если нет результата?</h3>
                    <p className="text-gray-700">
                      Пересмотрите свою программу тренировок, проверьте питание и качество сна. Часто отсутствие результатов связано с неправильной техникой или недостаточной интенсивностью. Проконсультируйтесь с тренером для корректировки программы.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Как часто нужно тренироваться начинающим?</h3>
                    <p className="text-gray-700">
                      Для начинающих оптимально 2-3 тренировки в неделю с днями отдыха между ними. Это позволяет мышцам восстановиться и адаптироваться к нагрузкам.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Когда лучше тренироваться — утром или вечером?</h3>
                    <p className="text-gray-700">
                      Лучшее время для тренировок — то, которое вы можете соблюдать регулярно. С физиологической точки зрения, вечерние тренировки (16-20 часов) могут быть немного эффективнее из-за естественных пиков гормонов, но разница незначительна.
                    </p>
                  </div>
                </div>

                <div className="my-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                  <h2 className="text-2xl font-bold mb-4">Заключение</h2>
                  <p className="mb-4">
                    Начало тренировок в тренажерном зале — это путешествие, а не спринт. Не стремитесь к идеальному результату сразу. Будьте последовательны, придерживайтесь плана и наслаждайтесь процессом.
                  </p>
                  <p className="font-bold">
                    Помните: каждая тренировка приближает вас к цели, даже если вы не видите результатов сразу.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #тренажерныйзал
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #дляначинающих
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #фитнес
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #тренировки
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #мотивация
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
                    <Link href="/articles/nutrition-for-gym-beginners" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">Питание для начинающих: основы спортивной диеты</h4>
                      <p className="text-sm text-gray-600">Как правильно питаться, чтобы получить максимум от тренировок</p>
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