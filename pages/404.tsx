import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Если мы находимся на Netlify (клиентская сторона), 
    // пробуем динамически загрузить страницу с тем же URL, но добавив слэш в конце
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.endsWith('/')) {
        // Пробуем перенаправить на тот же путь со слэшем в конце
        const newPath = `${path}/`;
        console.log(`Trying to redirect from ${path} to ${newPath}`);
        router.push(newPath);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Страница не найдена</h1>
        <p className="text-gray-600 mb-6">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/" legacyBehavior>
            <a className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Вернуться на главную
            </a>
          </Link>
          <Link href="/programs" legacyBehavior>
            <a className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Перейти к программам
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
} 