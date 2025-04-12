import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AthletDiary</h3>
            <p className="text-gray-300 text-sm mb-4">
              Приложение для отслеживания тренировок и прогресса
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/exercises" className="text-gray-300 hover:text-white text-sm">
                  Упражнения
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-300 hover:text-white text-sm">
                  Программы
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-300 hover:text-white text-sm">
                  История
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <p className="text-gray-300 text-sm">
              Если у вас есть вопросы или предложения, свяжитесь с нами
            </p>
            <a 
              href="mailto:contact@athletdiary.com" 
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 block"
            >
              contact@athletdiary.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          © {currentYear} AthletDiary. Все права защищены.
        </div>
      </div>
    </footer>
  );
} 