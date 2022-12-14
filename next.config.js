const { i18n } = require('./next-i18next.config');

const basePath = '/FOR_REPLACE';

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  pageExtensions: ['page.tsx', 'page.ts'],
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.ws = false;
      config.resolve.fallback.bufferutil = false;
      config.resolve.fallback['utf-8-validate'] = false;
    }

    return config;
  },
  assetPrefix: basePath,
  images: {
    path: basePath + '/_next/image',
  },
  amp: { canonicalBase: basePath },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  basePath,
  publicRuntimeConfig: {
    // Will be available on both server and client
    basePath,
  },
  output: 'standalone',
};

const res =
  process.env.IS_BUILDING === 'true'
    ? require('@vanilla-extract/next-plugin').createVanillaExtractPlugin()(
        nextConfig
      )
    : nextConfig;

module.exports = res;
