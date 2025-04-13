/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Включаем статический экспорт
  output: 'export',
  // Настройки для изображений при статическом экспорте
  images: {
    unoptimized: true,
  },
  // Важно для правильного обслуживания файлов при статическом экспорте
  trailingSlash: true,
  // Настроим distDir для Netlify
  distDir: 'out',
  // Отключаем использование API маршрутов в статическом режиме
  // (они не поддерживаются в режиме export)
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
  // Указываем домен для изображений
  // images: {
  //   domains: ['example.com'],
  // },
}

module.exports = nextConfig 