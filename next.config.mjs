import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(process.cwd(), 'node_modules/slick-carousel')
    });
    return config;
  }
};

export default nextConfig;