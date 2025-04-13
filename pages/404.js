import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <Head>
        <title>Страница не найдена | АтлетДиари</title>
        <meta name="description" content="Страница не найдена" />
      </Head>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Страница не найдена</h1>
        <p className="text-gray-600 mb-6">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex space-x-4">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            На главную
          </Link>
          <Link href="/programs" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            К программам
          </Link>
        </div>
      </div>
    </div>
  );
} 