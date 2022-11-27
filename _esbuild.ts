import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { build } from 'esbuild';

build({
  entryPoints: ['./src/server/server1.ts'],
  tsconfig: './tsconfig.server.json',
  bundle: true,
  outfile: './dist/server1.js',
  plugins: [esbuildDecorators()],
  platform: 'node',
  format: 'cjs',
  external: [
    './node_modules/next/*',
    '@vanilla-extract/next-plugin',
    'swagger-ui-dist',
  ],
})
  .then((res) => {
    console.log(res);
  })
  .catch(() => process.exit(1));

build({
  entryPoints: ['./src/server/dev.ts'],
  tsconfig: './tsconfig.server.json',
  bundle: true,
  outfile: './dist/dev.js',
  plugins: [esbuildDecorators()],
  platform: 'node',
  external: ['@vanilla-extract/next-plugin', 'swagger-ui-dist', 'next'],
  define: {
    'import.meta.env.PROD': JSON.stringify(true),
    'import.meta.env.DEV': JSON.stringify(false),
    'import.meta.hot': JSON.stringify(false),
  },
})
  .then((res) => {
    console.log(res);
  })
  .catch(() => process.exit(1));
