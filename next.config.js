/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Настройки для изображений
  images: {
    unoptimized: true,
  },
  // Включаем трейлинг слэш для совместимости с Netlify
  trailingSlash: true,
  // Удаляем настройку distDir, так как она может вызывать проблемы с Netlify
  // distDir: 'out',
  // Указываем базовый путь, если сайт размещен в подкаталоге
  // basePath: '',
  // Указываем домен для изображений
  // images: {
  //   domains: ['example.com'],
  // },
}

module.exports = nextConfig 