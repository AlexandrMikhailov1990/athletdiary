/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Отключаем статический экспорт во время разработки
  // Раскомментируйте строку 'output: "export"' при сборке для production
  // output: 'export',
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