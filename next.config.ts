/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Включаем игнорирование ошибок при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки линтера
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
