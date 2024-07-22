const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Configuración para CSS
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
    });

    // Configuración específica para SCSS de react-modal-video
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader',
      ],
      include: path.resolve(__dirname, 'node_modules/react-modal-video'),
    });

    // Optimizaciones adicionales solo para producción y cliente
    if (!dev && !isServer) {
      // Divide el código en chunks más pequeños
      config.optimization.splitChunks.chunks = 'all';

      // Añadir soporte para WebSockets en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // Configuración para el servidor de desarrollo de Next.js
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: '/api/socket',
      },
    ];
  },
};

// Envuelve nextConfig con withBundleAnalyzer solo si el paquete está instalado
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')();
    module.exports = withBundleAnalyzer(nextConfig);
  } catch (e) {
    console.warn('Advertencia: @next/bundle-analyzer no está instalado. Saltando análisis de bundle.');
    module.exports = nextConfig;
  }
} else {
  module.exports = nextConfig;
}