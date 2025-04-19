import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HealthyEatingProgram() {
  return (
    <>
      <Head>
        <title>Программа правильного питания на каждый день: принципы и готовое меню | AthleteDiary</title>
        <meta name="description" content="Узнайте основные принципы правильного питания и получите готовое сбалансированное меню на неделю, которое поможет сохранить здоровье и идеальный вес" />
      </Head>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-80 md:h-96 bg-gradient-to-r from-green-500 to-teal-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4 w-auto max-w-[200px]">
                  Питание
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Программа правильного питания на каждый день: принципы и готовое меню
                </h1>
                <div className="flex items-center mt-4 text-white/90 text-sm">
                  <span className="mr-4">3 февраля 2025</span>
                  <span>10 минут чтения</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-gray-700">
                  Правильное питание (ПП) — не временная диета, а система, которая помогает сохранить здоровье, энергию и идеальный вес. Рассказываем, как составить сбалансированный рацион на неделю, даже если вы новичок.
                </p>

                <div className="my-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h2 className="text-green-800 text-lg font-medium mb-2">Что вы узнаете из этой статьи</h2>
                  <ul className="space-y-1 text-sm">
                    <li>Основные принципы сбалансированного питания</li>
                    <li>Как рассчитать калорийность и норму БЖУ</li>
                    <li>Готовое меню на неделю с простыми рецептами</li>
                    <li>Доступные суперфуды для укрепления здоровья</li>
                    <li>Распространенные ошибки и советы от диетологов</li>
                  </ul>
                </div>

                <h2 id="principles" className="text-2xl font-bold text-gray-800 mt-10">
                  5 принципов правильного питания
                </h2>
                
                <h3 id="balancebpu" className="text-xl font-bold text-gray-800 mt-6">
                  1. Баланс БЖУ
                </h3>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Белки:</strong> 1.2–2 г на кг веса (мясо, рыба, яйца, творог).</li>
                  <li><strong>Жиры:</strong> 20–30% от калорий (оливковое масло, авокадо, орехи).</li>
                  <li><strong>Углеводы:</strong> 45–55% (гречка, бурый рис, овощи).</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg my-6">
                  <p className="text-gray-700">
                    <strong>Пример:</strong> При весе 60 кг норма белка — 72–120 г/сутки.
                  </p>
                </div>

                <h3 id="mealschedule" className="text-xl font-bold text-gray-800 mt-6">
                  2. Режим питания
                </h3>
                
                <p>
                  5 приемов пищи: завтрак, перекус, обед, полдник, ужин. Интервалы — 2.5–3 часа.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <p className="text-gray-700 text-sm">
                    Регулярное питание небольшими порциями поддерживает стабильный уровень сахара в крови и предотвращает переедание.
                  </p>
                </div>

                <h3 id="calories" className="text-xl font-bold text-gray-800 mt-6">
                  3. Калорийность
                </h3>
                
                <p>
                  Рассчитайте норму по формуле:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Для женщин:</strong> (10 × вес в кг) + (6.25 × рост в см) – (5 × возраст) – 161.</li>
                  <li><strong>Для мужчин:</strong> (10 × вес) + (6.25 × рост) – (5 × возраст) + 5.</li>
                </ul>

                <p>
                  Умножьте результат на коэффициент активности (1.2–1.9).
                </p>

                <h3 id="naturalfood" className="text-xl font-bold text-gray-800 mt-6">
                  4. Натуральные продукты
                </h3>
                
                <p>
                  Исключите рафинированный сахар, трансжиры (маргарин, фастфуд), колбасы и газировку.
                </p>

                <div className="bg-red-50 p-4 rounded-lg my-4">
                  <h4 className="font-bold text-red-800 mb-2">Важно:</h4>
                  <p className="text-gray-700">
                    Читайте состав продуктов. Избегайте длинных списков с е-добавками и непонятными ингредиентами.
                  </p>
                </div>

                <h3 id="water" className="text-xl font-bold text-gray-800 mt-6">
                  5. Водный баланс
                </h3>
                
                <p>
                  30 мл воды на 1 кг веса. Добавьте лимон или мяту для вкуса.
                </p>

                <h2 id="weekprogram" className="text-2xl font-bold text-gray-800 mt-10">
                  Готовая программа на неделю
                </h2>

                <div className="bg-gray-50 p-5 rounded-lg my-6">
                  <h3 className="font-bold text-gray-800 mb-3">Понедельник</h3>
                  <ul className="space-y-2">
                    <li><strong>Завтрак:</strong> Овсянка на молоке + ягоды + 1 ч.л. меда.</li>
                    <li><strong>Перекус:</strong> Яблоко + 10 миндальных орехов.</li>
                    <li><strong>Обед:</strong> Гречка с запеченной курицей + салат (огурец, помидор, зелень).</li>
                    <li><strong>Полдник:</strong> Творог 5% с корицей.</li>
                    <li><strong>Ужин:</strong> Тушеная рыба + брокколи на пару.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg my-6">
                  <h3 className="font-bold text-gray-800 mb-3">Вторник</h3>
                  <ul className="space-y-2">
                    <li><strong>Завтрак:</strong> Омлет из 2 яиц + цельнозерновой хлеб + авокадо.</li>
                    <li><strong>Перекус:</strong> Грейпфрут + йогурт без сахара.</li>
                    <li><strong>Обед:</strong> Булгур с индейкой + салат из капусты и моркови.</li>
                    <li><strong>Полдник:</strong> Смузи (шпинат, банан, кефир).</li>
                    <li><strong>Ужин:</strong> Запеченные овощи (кабачок, перец, баклажан) + сыр фета.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg my-6">
                  <h3 className="font-bold text-gray-800 mb-3">Среда</h3>
                  <ul className="space-y-2">
                    <li><strong>Завтрак:</strong> Тост с арахисовой пастой + банан.</li>
                    <li><strong>Перекус:</strong> Морковные палочки + хумус.</li>
                    <li><strong>Обед:</strong> Киноа с лососем + руккола.</li>
                    <li><strong>Полдник:</strong> Кефир + 1 ч.л. клетчатки.</li>
                    <li><strong>Ужин:</strong> Фаршированные перцы (фарш из индейки, рис).</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg my-6">
                  <h3 className="font-bold text-blue-800 mb-3">На оставшиеся дни недели</h3>
                  <p className="mb-3">Четверг–воскресенье чередуйте меню, заменяя продукты-аналоги:</p>
                  <ul className="space-y-2">
                    <li><strong>Крупы:</strong> киноа → булгур → перловка.</li>
                    <li><strong>Белок:</strong> курица → говядина → тофу.</li>
                    <li><strong>Овощи:</strong> брокколи → стручковая фасоль → цукини.</li>
                  </ul>
                </div>

                <h2 id="superfoods" className="text-2xl font-bold text-gray-800 mt-10">
                  Топ-10 бюджетных суперфудов
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">1. Гречка</div>
                    <p className="text-sm text-gray-700">Источник железа и магния.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">2. Семена льна</div>
                    <p className="text-sm text-gray-700">Омега-3 для мозга.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">3. Печень трески</div>
                    <p className="text-sm text-gray-700">Витамин D.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">4. Квашеная капуста</div>
                    <p className="text-sm text-gray-700">Пробиотики.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">5. Чечевица</div>
                    <p className="text-sm text-gray-700">Растительный белок (24 г/100 г).</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">6. Тыквенные семечки</div>
                    <p className="text-sm text-gray-700">Цинк для иммунитета.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">7. Киви</div>
                    <p className="text-sm text-gray-700">Витамин С (154% дневной нормы).</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">8. Сельдь</div>
                    <p className="text-sm text-gray-700">Омега-3 дешевле лосося.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">9. Нут</div>
                    <p className="text-sm text-gray-700">Клетчатка для пищеварения.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">10. Куркума</div>
                    <p className="text-sm text-gray-700">Противовоспалительный куркумин.</p>
                  </div>
                </div>

                <h2 id="mistakes" className="text-2xl font-bold text-gray-800 mt-10">
                  3 ошибки новичков
                </h2>

                <div className="space-y-4 my-6">
                  <div className="bg-yellow-50 p-5 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-2">1. Жесткие ограничения</h3>
                    <p className="text-gray-700">
                      Приводят к срывам. Разрешите себе 1–2 «читмила» в неделю.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-5 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-2">2. Отказ от жиров</h3>
                    <p className="text-gray-700">
                      Без них не усваиваются витамины A, D, E.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-5 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-2">3. Поздние ужины</h3>
                    <p className="text-gray-700">
                      Последний прием пищи за 3 часа до сна.
                    </p>
                  </div>
                </div>

                <h2 id="tips" className="text-2xl font-bold text-gray-800 mt-10">
                  Советы от диетологов
                </h2>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Планируйте меню на неделю</strong> — так проще избежать вредных перекусов.</li>
                  <li><strong>Используйте специи</strong> — куркума, имбирь и корица ускоряют метаболизм.</li>
                  <li><strong>Готовьте впрок</strong> — заморозьте порции супов или котлет.</li>
                </ul>

                <div className="bg-green-50 p-5 rounded-lg my-8">
                  <h3 className="font-bold text-green-800 mb-3">Итог:</h3>
                  <p className="text-gray-700">
                    Правильное питание — это просто. Начните с малого: замените белый хлеб на цельнозерновой, а сладкий йогурт — на натуральный с ягодами. Уже через 2 недели вы заметите прилив сил и улучшение сна!
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">#питание</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">#правильное_питание</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">#здоровье</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">#меню_на_неделю</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">#суперфуды</span>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Похожие статьи</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/articles/nutrition-for-weight-loss" className="block group">
                      <div className="bg-gray-50 p-4 rounded-lg transition-all group-hover:bg-gray-100">
                        <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600">Питание для похудения: что говорит наука?</h4>
                        <p className="text-sm text-gray-600">Научно обоснованные принципы питания для устойчивого снижения веса</p>
                      </div>
                    </Link>
                    <Link href="/articles/best-exercises-for-weight-loss" className="block group">
                      <div className="bg-gray-50 p-4 rounded-lg transition-all group-hover:bg-gray-100">
                        <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600">Лучшие упражнения для похудения: научный подход</h4>
                        <p className="text-sm text-gray-600">Научно обоснованные упражнения для эффективного сжигания жира и похудения</p>
                      </div>
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