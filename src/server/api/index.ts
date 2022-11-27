import type { I18n } from 'next-i18next';
import * as z from 'zod';

import { t, procedure } from '~/api/context';
import { getConfig } from '~/config/config.actions';
import { getLogger, Logger } from '~/logger';

import { subscriptionRouter } from './subscription';

export const appRouter = t.router({
  subscription: subscriptionRouter,
  hello: procedure.input(z.object({ text: z.string() })).query(() => 'world'),
  create: procedure
    .input(z.object({ input: z.string() }))
    .output(z.string())
    .meta({
      openapi: {
        enabled: true,
        method: 'POST',
        path: '/create',
        tags: ['test tag'],
      },
    })
    .mutation(async ({ input }) => {
      global.__root.logger.info(input);

      if (import.meta.env.DEV) {
        return 'HELLO WORLD';
      }

      return 'HELLO WORLD';
    }),
});

export type AppRouter = typeof appRouter;

declare global {
  var __root: {
    trpc: AppRouter;
    logger: Logger;
    i18n?: I18n;
    getConfig: typeof getConfig;
  };
}

global.__root = {
  trpc: appRouter,
  logger: getLogger(),
  getConfig,
};
