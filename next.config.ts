import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./backend/**/*'],
    },
  },
};

export default nextConfig;
