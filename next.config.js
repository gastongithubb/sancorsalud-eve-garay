const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Configuraciones existentes...
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      include: path.resolve(__dirname, 'node_modules/react-modal-video'),
    });

    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader',
      include: /node_modules/,
    });

    // Manejar módulos problemáticos
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        'nock': false,
      };
    }

    // Ignorar módulos específicos que no son necesarios en el lado del cliente
    config.externals = [
      ...(config.externals || []),
      {
        'mock-aws-s3': 'mock-aws-s3',
        'aws-sdk': 'aws-sdk',
        'nock': 'nock',
        '@mapbox/node-pre-gyp': '@mapbox/node-pre-gyp'
      }
    ];

    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: '/api/socket',
      },
    ];
  },
};

// Código existente para withBundleAnalyzer...
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