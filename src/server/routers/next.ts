import { FastifyPluginCallback } from 'fastify';
import Next from 'next';

import conf from '../../../next.config.copy';

const app = Next({ dev: true, conf, customServer: true, port: 9002 });
const handle = app.getRequestHandler();

let isInit = false;

type nextRouter = FastifyPluginCallback;

export const getNextRouter = async (): Promise<nextRouter> => {
  if (!isInit) {
    await app.prepare();
    isInit = true;
  }

  return (fastify, _, next) => {
    fastify.all('/*', async (req, reply) => {
      await handle(req.raw, reply.raw);
      reply.sent = true;
    });

    fastify.setNotFoundHandler(async (req, reply) => {
      await app.render404(req.raw, reply.raw);
      reply.sent = true;
    });

    next();
  };
};

if (import.meta.hot) {
  console.log(`import.meta.hot in next.ts`);
  import.meta.hot.accept();
}
