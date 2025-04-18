import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Articles.module.css';

const NutritionForWeightLossArticle: NextPage = () => {
  const [showTOC, setShowTOC] = useState(false);
  
  return (
    <>
      <Head>
        <title>Питание для похудения: что говорит наука? | AthleDiary</title>
        <meta name="description" content="Научно обоснованный подход к питанию для похудения: калорийный дефицит, макроэлементы, гормоны и практические советы" />
      </Head>

      <main className={styles.articleContainer}>
        <div className={styles.articleHeader}>
          <div className={styles.articleHeaderGradient}>
            <div className={styles.articleHeaderContent}>
              <h1>Питание для похудения: что говорит наука?</h1>
              <div className={styles.articleMeta}>
                <span>12 июля 2023</span>
                <span>•</span>
                <span>10 минут чтения</span>
              </div>
            </div>
            <div className={styles.mainImageContainer}>
              <Image
                src="/images/articles/nutrition-science.jpg"
                alt="Здоровое питание для похудения"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className={styles.articleContent}>
          <div className={styles.tocContainer}>
            <button 
              className={styles.tocToggle}
              onClick={() => setShowTOC(!showTOC)}
            >
              Содержание {showTOC ? '▲' : '▼'}
            </button>
            
            {showTOC && (
              <ul className={styles.toc}>
                <li><a href="#intro">Введение</a></li>
                <li><a href="#calories">Калорийный дефицит</a></li>
                <li><a href="#macros">Баланс макроэлементов</a></li>
                <li><a href="#hormones">Гормональные влияния</a></li>
                <li><a href="#fasting">Интервальное голодание</a></li>
                <li><a href="#microbiome">Микробиом кишечника</a></li>
                <li><a href="#supplements">Пищевые добавки</a></li>
                <li><a href="#practical">Практические советы</a></li>
                <li><a href="#conclusion">Заключение</a></li>
              </ul>
            )}
          </div>

          <div className={styles.keyPoints}>
            <h2>Ключевые выводы</h2>
            <ul>
              <li>Калорийный дефицит — основной научный принцип похудения.</li>
              <li>Белки играют критическую роль в сохранении мышц и ускорении метаболизма.</li>
              <li>Гормональный баланс влияет на эффективность снижения веса.</li>
              <li>Интервальное голодание может быть эффективным для некоторых людей.</li>
              <li>Качество питания и постепенные изменения важнее строгих ограничений.</li>
            </ul>
          </div>

          <section id="intro">
            <p>В мире, где диетические тренды меняются быстрее, чем времена года, легко запутаться в том, что действительно работает для здорового и устойчивого снижения веса. В этой статье мы обратимся к научным данным, чтобы разобраться, какие принципы питания действительно эффективны для похудения, а какие представляют собой маркетинговые мифы.</p>
          </section>

          <section id="calories">
            <h2>1. Калорийный дефицит: фундаментальный принцип</h2>
            <p>Первый закон термодинамики неумолим: чтобы похудеть, необходимо потреблять меньше калорий, чем вы тратите. Исследования последовательно показывают, что независимо от типа диеты, снижение веса происходит только при наличии калорийного дефицита.</p>
            
            <div className={styles.articleQuote}>
              "Несмотря на популяризацию диет с различными соотношениями макронутриентов, энергетический баланс остается фундаментальным фактором регуляции веса тела" — исследование New England Journal of Medicine
            </div>
            
            <p>Однако важно понимать, что не все калории равнозначны с точки зрения их влияния на организм. 100 калорий из курицы и 100 калорий из печенья оказывают разное воздействие на сытость, метаболизм и гормональный фон.</p>
          </section>

          <section id="macros">
            <h2>2. Баланс макроэлементов: белки, жиры, углеводы</h2>
            
            <h3>Белки</h3>
            <p>Белки имеют наибольший термический эффект (20-30% их энергетической ценности расходуется на их переваривание). Высокобелковая диета помогает:</p>
            <ul>
              <li>Сохранять мышечную массу при похудении</li>
              <li>Повышать чувство сытости</li>
              <li>Стимулировать метаболизм</li>
            </ul>
            <p>Исследования показывают, что потребление 1.6-2.2 грамма белка на килограмм веса оптимально для сохранения мышечной массы при снижении веса, особенно при регулярных физических нагрузках.</p>
            
            <h3>Жиры</h3>
            <p>Диетические жиры необходимы для здоровья и не являются врагом похудения. Они:</p>
            <ul>
              <li>Участвуют в производстве гормонов</li>
              <li>Улучшают усвоение жирорастворимых витаминов</li>
              <li>Повышают чувство насыщения</li>
            </ul>
            <p>Оптимальное потребление составляет 20-35% от общей калорийности, с акцентом на ненасыщенные жиры из оливкового масла, авокадо, орехов и рыбы.</p>
            
            <h3>Углеводы</h3>
            <p>Качество углеводов важнее их количества. Цельные, необработанные источники (овощи, фрукты, бобовые, цельные злаки) предпочтительнее рафинированных углеводов, так как они:</p>
            <ul>
              <li>Содержат больше питательных веществ и клетчатки</li>
              <li>Медленнее влияют на уровень сахара в крови</li>
              <li>Обеспечивают более длительное насыщение</li>
            </ul>
          </section>

          <div className={styles.imageContainer}>
            <Image
              src="/images/articles/balanced-nutrition.jpg"
              alt="Сбалансированное питание с правильным соотношением макроэлементов"
              width={800}
              height={500}
              objectFit="cover"
            />
            <p className={styles.imageCaption}>Сбалансированный рацион с оптимальным соотношением белков, жиров и углеводов</p>
          </div>

          <section id="hormones">
            <h2>3. Гормональные влияния на вес</h2>
            <p>Гормоны играют значительную роль в регуляции веса. Ключевые гормональные факторы включают:</p>
            
            <h3>Инсулин</h3>
            <p>Высокий уровень инсулина способствует накоплению жира и препятствует его расщеплению. Стабилизация уровня инсулина через:</p>
            <ul>
              <li>Ограничение рафинированных углеводов и сахара</li>
              <li>Регулярное питание небольшими порциями</li>
              <li>Физическую активность</li>
            </ul>
            <p>может способствовать более эффективному снижению веса.</p>
            
            <h3>Лептин и грелин</h3>
            <p>Лептин (гормон сытости) и грелин (гормон голода) напрямую влияют на аппетит. Нарушение их баланса может затруднять похудение. Научные данные показывают, что:</p>
            <ul>
              <li>Достаточный сон (7-9 часов) критически важен для нормализации этих гормонов</li>
              <li>Высокое потребление белка помогает контролировать грелин</li>
              <li>Регулярное питание стабилизирует их уровни</li>
            </ul>
            
            <div className={styles.articleNote}>
              <strong>Важно:</strong> Хронический стресс повышает уровень кортизола, что может вызывать накопление жира в области живота и усиливать тягу к высококалорийной пище.
            </div>
          </section>

          <section id="fasting">
            <h2>4. Интервальное голодание: наука и практика</h2>
            <p>Интервальное голодание (ИГ) привлекло значительное внимание исследователей. Научные данные указывают на его потенциальные преимущества:</p>
            <ul>
              <li>Улучшение чувствительности к инсулину</li>
              <li>Стимуляция аутофагии (клеточное очищение)</li>
              <li>Снижение воспаления</li>
              <li>Возможное продление продолжительности жизни</li>
            </ul>
            
            <p>Популярные протоколы ИГ включают:</p>
            <ul>
              <li>16/8 (16 часов голодания, 8 часов приема пищи)</li>
              <li>5:2 (5 дней обычного питания, 2 дня с ограничением калорий)</li>
              <li>Один приём пищи в день (ОМАД)</li>
            </ul>
            
            <p>Важно отметить, что интервальное голодание может не подходить для всех, особенно для людей с определенными медицинскими состояниями, беременных женщин или тех, кто имеет историю расстройств пищевого поведения.</p>
          </section>

          <section id="microbiome">
            <h2>5. Микробиом кишечника и вес</h2>
            <p>Растущий объем исследований указывает на тесную связь между микробиомом кишечника и регуляцией веса. Здоровая кишечная микрофлора может:</p>
            <ul>
              <li>Улучшать обмен веществ</li>
              <li>Снижать воспаление</li>
              <li>Регулировать аппетит и накопление жира</li>
            </ul>
            
            <p>Для поддержки здорового микробиома рекомендуется:</p>
            <ul>
              <li>Разнообразное потребление растительной пищи (стремитесь к 30+ различным растительным продуктам в неделю)</li>
              <li>Регулярное употребление пребиотиков (лук, чеснок, бананы, овсянка)</li>
              <li>Включение ферментированных продуктов (йогурт, кефир, квашеная капуста)</li>
              <li>Ограничение искусственных подсластителей, которые могут нарушать баланс микробиома</li>
            </ul>
          </section>

          <section id="supplements">
            <h2>6. Пищевые добавки: что действительно работает?</h2>
            <p>Несмотря на обилие маркетинговых обещаний, лишь немногие добавки имеют научное подтверждение эффективности для снижения веса:</p>
            
            <h3>С доказанной эффективностью:</h3>
            <ul>
              <li><strong>Протеиновые добавки</strong> — помогают увеличить потребление белка и чувство сытости</li>
              <li><strong>Клетчатка</strong> — улучшает насыщение и регулирует аппетит</li>
              <li><strong>Кофеин</strong> — умеренно повышает расход энергии и мобилизацию жира</li>
              <li><strong>Зеленый чай</strong> — содержит катехины, которые могут ускорять метаболизм</li>
            </ul>
            
            <h3>С неубедительными доказательствами:</h3>
            <ul>
              <li><strong>CLA (конъюгированная линолевая кислота)</strong></li>
              <li><strong>Гарциния камбоджийская</strong></li>
              <li><strong>Расторопша</strong></li>
              <li><strong>L-карнитин</strong></li>
            </ul>
            
            <div className={styles.articleWarning}>
              <p><strong>Важно!</strong> Добавки не регулируются так же строго, как лекарства. Всегда консультируйтесь с врачом перед началом приема любых добавок, особенно если у вас есть сопутствующие заболевания.</p>
            </div>
          </section>

          <section id="practical">
            <h2>7. Практические советы для устойчивого снижения веса</h2>
            
            <h3>Планирование питания</h3>
            <ul>
              <li>Составляйте недельное меню заранее</li>
              <li>Готовьте еду дома, контролируя ингредиенты</li>
              <li>Держите здоровые перекусы под рукой</li>
            </ul>
            
            <h3>Размер порций</h3>
            <ul>
              <li>Используйте тарелки меньшего размера</li>
              <li>Практикуйте осознанное питание, ешьте медленно</li>
              <li>Следуйте правилу "пол-тарелки овощей"</li>
            </ul>
            
            <h3>Водный режим</h3>
            <ul>
              <li>Пейте воду перед приемами пищи</li>
              <li>Замените высококалорийные напитки водой или несладким чаем</li>
              <li>Стремитесь к 30 мл воды на кг веса тела ежедневно</li>
            </ul>
            
            <h3>Психологические стратегии</h3>
            <ul>
              <li>Практикуйте осознанное питание</li>
              <li>Ведите дневник питания</li>
              <li>Избегайте эмоционального переедания через практики релаксации</li>
              <li>Создавайте здоровые ритуалы вместо диетических ограничений</li>
            </ul>
            
            <div className={styles.articleTip}>
              <p>Исследования показывают, что люди, ведущие дневник питания, теряют в 2 раза больше веса, чем те, кто этого не делает.</p>
            </div>
          </section>

          <section id="conclusion">
            <h2>Заключение</h2>
            <p>Наука о питании для похудения постоянно развивается, но фундаментальные принципы остаются неизменными. Важно понимать, что не существует универсального подхода, и стратегия питания должна учитывать индивидуальные особенности, предпочтения и образ жизни.</p>
            
            <p>Самый эффективный план питания — тот, которого вы можете придерживаться долгосрочно. Постепенные, устойчивые изменения в привычках питания принесут больше пользы, чем радикальные краткосрочные диеты. Сосредоточьтесь на качестве пищи, регулярности питания и осознанном отношении к еде.</p>
            
            <p>Помните, что питание — лишь один из компонентов здорового снижения веса. Физическая активность, качественный сон и управление стрессом также играют важную роль в достижении и поддержании здорового веса.</p>
          </section>

          <div className={styles.articleTags}>
            <h3>Теги:</h3>
            <div>
              <span>#питание</span>
              <span>#похудение</span>
              <span>#здоровье</span>
              <span>#наука</span>
              <span>#калории</span>
            </div>
          </div>

          <div className={styles.recommendedArticles}>
            <h3>Рекомендуемые статьи</h3>
            <div className={styles.recommendedGrid}>
              <Link href="/articles/nutrition-for-weight-loss">
                <a className={styles.recommendedCard}>
                  <div className={styles.recommendedImageContainer}>
                    <Image 
                      src="/images/articles/gym-beginner.jpg"
                      alt="Начало тренировок в зале"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h4>Как начать заниматься в тренажерном зале: 7 шагов для новичков</h4>
                </a>
              </Link>
              <Link href="/articles/best-exercises-for-weight-loss">
                <a className={styles.recommendedCard}>
                  <div className={styles.recommendedImageContainer}>
                    <Image 
                      src="/images/articles/exercises-weight-loss.jpg"
                      alt="Упражнения для похудения"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h4>Лучшие упражнения для похудения: научный подход</h4>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NutritionForWeightLossArticle; 