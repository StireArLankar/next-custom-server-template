import { resolve } from 'path';

import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 9002,
  },
  plugins: [
    ...VitePluginNode({
      tsCompiler: 'swc',
      adapter: 'fastify',
      appPath: './src/server/dev.ts',
    }),
  ],
  ssr: {
    external: ['reflect-metadata'],
  },
  optimizeDeps: {
    // Vite does not work well with optionnal dependencies,
    // you can mark them as ignored for now
    // eg: for nestjs, exlude these optional dependencies:
    exclude: [
      'webpack',
      'reflect-metadata',
      'webpack5',
      'critters',
      'pnpapi',
      'next',
    ],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src', 'server'),
      src: resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src', 'components'),
    },
  },
});
