import fastify from 'fastify';

import { socketServer } from './socketServerStorage';

export const getSocketServer = async (): Promise<void> => {
  if (socketServer.test) {
    await socketServer.test.close();
  }

  const { rootRouter } = await import('~/routers');

  const { getConfig } = await import('~/config/config.actions');
  const { service } = getConfig().devopsConfig;

  socketServer.test = fastify({ logger: false });
  socketServer.test.register(rootRouter, { prefix: service.hostUrl });

  const port = '9004';

  await socketServer.test
    .listen(port, '0.0.0.0')
    .then((res) =>
      global.__root?.logger?.info(`socket server listening on ${port} ${res}`)
    );
};

if (import.meta.hot) {
  console.log(`import.meta.hot in getSocketServer.ts`);
  import.meta.hot.accept();
}
