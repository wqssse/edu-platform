import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  experimental: { serverComponentsExternalPackages: ['bcryptjs'] },
};
export default nextConfig;
