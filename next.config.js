/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "NEXTAUTH_SECRET_DEV",
    SECRET_KEY: "SECRET_KEY_JWT ",
  },
  styles: [
    {
      // ใช้ Ant Design CSS จาก CDN
      href: "https://cdn.jsdelivr.net/npm/antd/dist/antd.min.css",
      rel: "stylesheet",
    },
  ],
};

module.exports = nextConfig;
