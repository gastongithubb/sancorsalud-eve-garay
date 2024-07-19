/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, 'node_modules/slick-carousel')
    });
    return config;
  }
};
