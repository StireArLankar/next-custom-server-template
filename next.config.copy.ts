//@ts-ignore
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';

const basePath = '/FOR_REPLACE';

const nextConfig: NextConfig = {
  i18n: {
    //@ts-ignore
    reloadOnPrerender: process.env.NODE_ENV !== 'production',
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    fallbackLng: false,
  },
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
  output: 'standalone',
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
};

const res = createVanillaExtractPlugin()(nextConfig);

export default res;
