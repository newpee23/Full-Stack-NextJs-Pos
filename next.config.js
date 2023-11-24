/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "NEXTAUTH_SECRET_DEV",
    SECRET_KEY: "SECRET_KEY_JWT ",
  },
  images: {
    domains: ['nextpos-s3.s3.ap-southeast-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
