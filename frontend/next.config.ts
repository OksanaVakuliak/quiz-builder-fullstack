import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/квіз/:id',
        destination: '/quizzes/:id',
      },
      {
        source: '/%D0%BA%D0%B2%D1%96%D0%B7/:id',
        destination: '/quizzes/:id',
      },
    ];
  },
};

export default nextConfig;
