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
  // Не указываем distDir, чтобы использовать значения по умолчанию
  // Пустая секция experimental для будущих опций
  experimental: {},
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
  // Указываем домен для изображений
  // images: {
  //   domains: ['example.com'],
  // },
}

module.exports = nextConfig 