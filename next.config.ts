import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️ Важно: Cloudflare не поддерживает стандартную оптимизацию картинок Next.js без доп. настроек
  images: {
    unoptimized: true,
  },
  // Убедись, что нет лишних редиректов или basePath, которые могут давать 404
};

export default nextConfig;
