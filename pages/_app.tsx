import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { initializeExercises } from '../models/Exercise';
import { initializePrograms, migratePrograms } from '../models/Program';
import { addHomeExercisesToUserExercises } from '../models/HomeExercises';
import { addExtendedHomeExercises } from '../models/HomeExercisesExtended';
import { addYogaBackExercises } from '../models/YogaExercises';
import { addYogaBackProgram } from '../models/YogaProgram';
import { addKettlebellProgramToUserPrograms } from '../models/KettlebellProgram';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider, useSession } from "next-auth/react";
import { syncWorkoutHistory } from '../utils/historyApi';

type AppContentProps = {
  Component: AppProps['Component'];
  pageProps: any;
};

function AppContent({ Component, pageProps }: AppContentProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Обработка 404 ошибок на Netlify
  useEffect(() => {
    // Проверяем, находимся ли мы на Netlify
    if (typeof window !== 'undefined' && window.location.hostname.includes('netlify')) {
      // Если страница не найдена, перенаправляем на главную
      if (document.title === '404: This page could not be found') {
        router.push('/');
      }
    }
    
    // Убираем инициализацию звука отсюда - звук должен инициализироваться только при необходимости
    // soundManager.initialize();

    // Мигрируем старые данные программ
    migratePrograms();

    // Инициализация базовых упражнений и программ
    initializeExercises();
    initializePrograms();
    
    // Добавление домашних упражнений
    addHomeExercisesToUserExercises();
    addExtendedHomeExercises();
    
    // Добавление упражнений и программы йоги
    addYogaBackExercises();
    addYogaBackProgram();
    
    // Добавление программы с гирей
    addKettlebellProgramToUserPrograms();
  }, [router]);

  // Синхронизация истории тренировок при загрузке
  useEffect(() => {
    if (session?.user) {
      syncWorkoutHistory()
        .then(() => console.log('История тренировок синхронизирована при загрузке приложения'))
        .catch(error => console.error('Ошибка синхронизации истории:', error));
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>AthleteDiary - Ваш персональный дневник тренировок</title>
        <meta name="description" content="AthleteDiary - современное приложение для отслеживания тренировок, планирования и анализа фитнес-результатов. Ведите дневник тренировок, следите за прогрессом и достигайте своих целей." />
        <meta name="keywords" content="дневник тренировок, фитнес, спорт, тренировки, отслеживание прогресса, фитнес-приложение, здоровый образ жизни" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph разметка для соц. сетей */}
        <meta property="og:title" content="AthleteDiary - Ваш персональный дневник тренировок" />
        <meta property="og:description" content="Современное приложение для отслеживания тренировок, планирования и анализа фитнес-результатов" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://athletdiary.com" />
        <meta property="og:site_name" content="AthleteDiary" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AthleteDiary - Ваш персональный дневник тренировок" />
        <meta name="twitter:description" content="Современное приложение для отслеживания тренировок, планирования и анализа фитнес-результатов" />
        
        {/* Структурированные данные для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AthleteDiary",
              "description": "Персональный дневник тренировок для отслеживания прогресса и достижения фитнес-целей",
              "url": "https://athletdiary.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "RUB"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AthleteDiary",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://athletdiary.com/logo.png"
                }
              }
            })
          }}
        />
      </Head>
      
      <div className="app-wrapper">
        <div className="navbar-container">
          <Navbar />
        </div>
        
        <div className="main-content-wrapper">
          <Component {...pageProps} />
        </div>
        
        <Footer />
      </div>
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...restPageProps } = pageProps as any;
  
  return (
    <SessionProvider session={session}>
      <AppContent Component={Component} pageProps={restPageProps} />
    </SessionProvider>
  );
} 