import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./backend/**/*'],
    },
  },
};

export default nextConfig;
