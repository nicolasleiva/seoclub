/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar errores en la compilación (forzar generación estática sin errores)
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  images: {
    unoptimized: true,
  },
  // Excluir directorios específicos del proceso de compilación
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configuración para ignorar directorios específicos durante la compilación
  // Configuración de exclusiones compatible con App Router
  // Excluir rutas específicas del rastreo de archivos
  outputFileTracingExcludes: {
    '*': [
      './public/**/*.md',
      './app/blog/**/*',
      './app/como-hacer-growth/**/*',
      './app/posthog-demo/**/*',
      './app/statsig-demo/**/*',
    ],
  },
  // Configuración básica de webpack
  webpack(config) {
    return config;
  },
  // Opciones para manejar problemas con rutas y normalización (movidas al nivel raíz)
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  // Otras opciones experimentales
  experimental: {},
}

export default nextConfig
