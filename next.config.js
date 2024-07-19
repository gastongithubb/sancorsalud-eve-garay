const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [
          path.resolve(__dirname, 'node_modules/slick-carousel'),
          path.resolve(__dirname, 'node_modules/react-modal-video')
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'node_modules/react-modal-video')
      }
    );
    return config;
  }
};

module.exports = nextConfig;