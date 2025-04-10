import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { migratePrograms } from '../models/Program';

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
    
    // Мигрируем старые данные программ
    migratePrograms();
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp; 