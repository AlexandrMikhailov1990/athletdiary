/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Включаем статический экспорт
  output: 'export',
  // Отключаем проверку ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Настройки для изображений при статическом экспорте
  images: {
    unoptimized: true,
  },
  // Важно для правильного обслуживания файлов при статическом экспорте
  trailingSlash: true,
  // Настроим distDir для Netlify
  distDir: 'out'
}

module.exports = nextConfig 