/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Мы убрали output: 'export', так как для Supabase Auth нужен серверный рантайм */
  images: { 
    unoptimized: true 
  }
};

export default nextConfig;
