/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "NEXTAUTH_SECRET_DEV",
    SECRET_KEY: "SECRET_KEY_JWT ",
  },
};

module.exports = nextConfig;
