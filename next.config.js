/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "NEXTAUTH_SECRET_DEV",
    SECRET_KEY: "SECRET_KEY_JWT ",
    SECRET_KEY_TRANSACTION: "SECRET_KEY_TRANSACTION",
    S3_BUCKET: "nextpos-s3",
    S3_ACCESS_keyID: "AKIAZM252WP3S2ZOTH3V",
    S3_SECRET_ACCESSKEY: "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",
    S3_AWS_REGION: "ap-southeast-1",
  },
  images: {
    domains: ['nextpos-s3.s3.ap-southeast-1.amazonaws.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
