import fs from 'fs';
import path from 'path';

import fastify from 'fastify';
import replace from 'replace-in-file';
import { Headers, fetch, Request, Response } from 'undici';

import { unknownToErrorMessage } from './utils/unknownToErrorMessage';

global.fetch = fetch as any;
global.Headers = Headers as any;
global.Request = Request as any;
global.Response = Response as any;

//@ts-ignore
process.env.NODE_ENV = import.meta.env.DEV ? 'development' : 'production';

export default async function start() {
  const { readConfig, getConfig } = await import('~/config/config.actions');
  await readConfig();

  const { ports, service } = getConfig().devopsConfig;

  const languages = getConfig().computed.languages;

  const { getLogger } = await import('~/logger');

  const logger = getLogger();

  if (process.env.NODE_ENV === 'production') {
    const _path = path.join(process.cwd(), 'next-i18next.config.js');

    fs.writeFileSync(
      _path,
      `
module.exports = {
    i18n: {
        defaultLocale: "${languages[0]}",
        locales: ${JSON.stringify(languages)},
        defaultNS: "translation",
    },
}`
    );

    replace.replaceInFileSync({
      files: './.next/**/*',
      from: /\/FOR_REPLACE/g,
      to: service.hostUrl,
      ignore: ['./node_modules/**/*'],
    });

    replace.replaceInFileSync({
      files: './**/*',
      from: /\/FOR_REPLACE/g,
      to: service.hostUrl,
      ignore: ['./node_modules/**/*'],
    });

    replace.replaceInFileSync({
      files: './.next/**/*',
      from: `{ "locales": ["en", "ru"] }`,
      to: `{ "locales": ${JSON.stringify(languages)} }`,
      ignore: ['./node_modules/**/*'],
    });
  }

  const server = fastify({ logger: false });

  server.addHook('onRequest', (req, res, done) => {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const log = `${method}:${url} ${status}`;

    if (
      url.startsWith(service.hostUrl + '/_next') ||
      url.startsWith(service.hostUrl + '/api/v1/docs')
    ) {
      done();
      return;
    }

    logger.trace(log, { status, method });
    done();
  });

  const managementServer = fastify({ logger: false });

  const { rootRouter, nextRouter } = await import('~/routers');

  server.register(rootRouter, { prefix: service.hostUrl });

  server.addHook('preParsing', async (request) => {
    //@ts-ignore
    request.raw.isManage = true;
  });

  if (import.meta.env.DEV) {
    const { getSocketServer } = await import('~/socketServer');
    await getSocketServer();
  }

  if (import.meta.env.DEV) {
    const { getNextRouter } = await import('~/routers/next');
    const nextRouter = await getNextRouter();
    server.register(nextRouter);
  } else {
    server.register(nextRouter);
  }

  console.log({ hot: import.meta.hot });

  managementServer.register((server, _, done) => {
    server.get('/health', async () => ({ health: 'ok' }));
    server.get('/version', async () => ({
      version: process.env.VERSION ?? 'local',
    }));

    done();
  });

  // Инициализируем поллинг конфига в проде
  if (import.meta.env.PROD) {
    // интервал между запросами за менеджерским конфигом
    const _period =
      getConfig().devopsConfig.managerConfig.pollingIntervalSeconds;

    const period = Number(_period) * 1000;

    const getErr = (err: unknown) => {
      const msg = unknownToErrorMessage(err);

      return `Err during getting manager config! ${msg}`;
    };

    // запрос за новыми конфигами
    const handler = (): Promise<void> =>
      readConfig()
        .then(() => logger.info('got ManagerConfig!'))
        .catch((err) => logger.error(getErr(err)))
        .finally(() => setTimeout(handler, period));

    // запускаем шарманку
    setTimeout(handler, period);
  }

  try {
    const { application, management } = ports;

    if (import.meta.env.DEV) {
      logger.info(`server started in dev`);
      return server;
    }

    await server
      .listen(ports.application, '0.0.0.0')
      .then((res) => logger.info(`server listening on ${application} ${res}`));

    await managementServer
      .listen(ports.management, '0.0.0.0')
      .then((res) =>
        logger.info(`management listening on ${management} ${res}`)
      );
  } catch (e) {
    const error = unknownToErrorMessage(e);
    logger.error(error);

    process.exit(1);
  }
}

export const viteNodeApp = start();
