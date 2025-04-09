/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Добавляем настройки для экспорта статических файлов
  output: 'export',
  // Отключаем изображения Next.js, так как они не работают с экспортом
  images: {
    unoptimized: true,
  },
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
  // Указываем домен для изображений
  // images: {
  //   domains: ['example.com'],
  // },
}

module.exports = nextConfig 