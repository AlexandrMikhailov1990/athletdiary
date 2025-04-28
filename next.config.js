/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Включаем статический экспорт для деплоя на Netlify
  output: 'export',
  // Отключаем проверку ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  // Добавляем слэш в конце для всех URL (важно для статического экспорта)
  trailingSlash: true,
  // Не указываем distDir, чтобы использовать значения по умолчанию
  // Пустая секция experimental для будущих опций
  experimental: {},
  onDemandEntries: {
    // период (в мс), в течение которого страница будет храниться в памяти
    maxInactiveAge: 60 * 1000,
    // количество страниц, которые должны храниться одновременно
    pagesBufferLength: 5,
  },
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
}

module.exports = nextConfig 