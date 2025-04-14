/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  experimental: {
    css: true,
  },
};

module.exports = nextConfig;
