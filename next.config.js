/** @type {import('next').NextConfig} */
const nextConfig = {
  // … varsa diğer config’leriniz
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
