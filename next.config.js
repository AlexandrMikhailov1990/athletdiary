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
  // Настройки для изображений при статическом экспорте
  images: {
    unoptimized: true,
  },
  // Добавляем слэш в конце для всех URL (важно для статического экспорта)
  trailingSlash: true,
  // Используем стандартную директорию .next для development и out для build
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
  // Отключаем использование API маршрутов при экспорте
  experimental: {
    // Явно указываем режим рендеринга для статических сайтов
    runtime: 'nodejs',
    // Отключаем middleware для статического экспорта
    skipMiddlewareUrlNormalize: true,
    // Отключаем оптимизацию изображений
    images: { unoptimized: true }
  },
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
  // Указываем домен для изображений
  // images: {
  //   domains: ['example.com'],
  // },
}

module.exports = nextConfig 