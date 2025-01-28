/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.caliverse.io'], // 외부 이미지 도메인 추가
  },
};

module.exports = nextConfig;
