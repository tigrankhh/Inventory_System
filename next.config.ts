import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Это критично для Cloudflare Pages
  },
};

export default nextConfig;
