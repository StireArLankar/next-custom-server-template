import fastifyExpress from '@fastify/express';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import express from 'express';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import type NextServer from 'next/dist/server/next-server';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';

import { createContext, createExpressContext } from '~/api/context';
import { getConfig } from '~/config/config.actions';

import { appRouter } from '../api';

type rootRouter = FastifyPluginCallback;
export const rootRouter: rootRouter = (server, _, done) => {
  server.register(apiRouter, { prefix: '/api' });

  interface IQuerystring {
    language: string;
    namespace: string;
  }

  // раздача переводов
  server.get<{ Params: IQuerystring }>(
    '/translations/:language/:namespace',
    (req, _) => {
      const { language, namespace } = req.params;
      const config = getConfig().githubConfig;

      // вытаскиваем перевод
      const json = config.translations?.[language]?.[namespace];

      // если его нет, то логируем ошибочку
      if (!json) {
        const msg = `no translation for lng=${language} and nmspc=${namespace}`;
        global.__root?.logger?.error(msg);
      }

      return json ?? {};
    }
  );

  done();
};

type apiRouter = FastifyPluginCallback<{ prefix: string }>;
const apiRouter: apiRouter = (fas, _, done) => {
  type Register = Parameters<typeof fas.register>['0'];

  const baseRoute: Register = async (fas, _, done) => {
    await fas.register(fp(fastifyExpress));

    const app = express();

    fas.use(app);

    //@ts-ignore
    fas.all('*', () => ({}));

    const { openApiDocument } = await import('~/api/openApi');

    const { hostUrl } = getConfig().devopsConfig.service;

    const base = hostUrl + '/api/v1';

    app.get(base + '/docs/json', async (_, res) => res.json(openApiDocument));

    app.use(base + '/docs', swaggerUi.serve);
    app.get(base + '/docs', swaggerUi.setup(openApiDocument));

    const openApiMW = createOpenApiExpressMiddleware({
      router: appRouter,
      createContext: createExpressContext,
    });

    app.use(base, openApiMW);

    done();
  };

  fas.register(baseRoute, { prefix: '/v1' });

  const socketRoute: Register = (server, _, done) => {
    server.register(ws);

    fas.register(fastifyTRPCPlugin, {
      prefix: '/socket',
      useWSS: true,
      trpcOptions: { router: appRouter, createContext },
    });

    done();
  };

  fas.register(socketRoute, { prefix: '/ws' });

  fas.register(fp(fastifyTRPCPlugin), {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  fas.ready((err) => {
    if (err) throw err;
  });

  done();
};

type nextRouter = FastifyPluginCallback;
export const nextRouter: nextRouter = (fastify, _, next) => {
  const path = './server1/index.js';
  const app = require(path).default as NextServer;

  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      fastify.all('/*', async (req, reply) => {
        await handle(req.raw, reply.raw);
        reply.sent = true;
      });

      fastify.setNotFoundHandler(async (req, reply) => {
        await app.render404(req.raw, reply.raw);
        reply.sent = true;
      });

      next();
    })
    .catch((err) => next(err));
};

if (import.meta.hot) {
  console.log(`import.meta.hot in routes/index.ts`);
  import.meta.hot.accept();
}
