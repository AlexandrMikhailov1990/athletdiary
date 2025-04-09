import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Автоматическое перенаправление на главную страницу через 5 секунд
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-6">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
              Вернуться на главную
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            Вы будете перенаправлены на главную страницу через 5 секунд.
          </p>
        </div>
      </div>
    </div>
  );
} 