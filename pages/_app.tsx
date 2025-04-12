import '../styles/globals.css';
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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
  }, [router]);

  return (
    <>
      <Head>
        <title>AthletDiary</title>
        <meta name="description" content="Трекер тренировок и фитнеса" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 