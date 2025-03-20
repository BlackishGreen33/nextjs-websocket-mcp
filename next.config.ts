import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  after: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  experimental: {
    reactCompiler: true,
    cssChunking: true,
  },
};

export default nextConfig;
