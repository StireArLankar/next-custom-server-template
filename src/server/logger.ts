import chalk from 'chalk';

import { getConfig } from '~/config/config.actions';

type levelsTemp = Exclude<levels, 'err'>;

const colors: Record<levelsTemp, typeof chalk['bold']> = {
  error: chalk.bold.red,
  fatal: chalk.bold.red,
  debug: chalk.whiteBright,
  info: chalk.green,
  trace: chalk.gray,
  warn: chalk.hex('#FFA500'),
};

type Item = { level: number; logLevel: string };

const realMapper: Record<levelsTemp, Item> = {
  error: { level: 3, logLevel: 'error' },
  fatal: { level: 0, logLevel: 'fatal' },
  debug: { level: 7, logLevel: 'debug' },
  info: { level: 6, logLevel: 'info' },
  trace: { level: 7, logLevel: 'trace' },
  warn: { level: 4, logLevel: 'warn' },
};

const fieldsToLogString = (fields: Object) =>
  Object.entries(fields)
    .map(([key, value]) => `${key} : ${JSON.stringify(value)}`)
    .join(' --- ');

export const getLogger = (base: object = {}): Logger => {
  const { product, service } = getConfig().devopsConfig;

  const { name: app, environment } = service;

  const version = process.env.VERSION;

  if (import.meta.env.DEV) {
    const createLogLevel =
      (level: levelsTemp): Log =>
      (message, fields = {}) => {
        const color = colors[level];

        const asd = { ...base, ...fields };

        const msg = `${new Date().toISOString()}   ~~~~ ${level} ~~~~`;
        console.log(color(msg));
        console.log(color(fieldsToLogString(asd) ?? '[] --- []'));
        console.log(color(msgToString(message)));
      };

    return {
      debug: createLogLevel('debug'),
      warn: createLogLevel('warn'),
      info: createLogLevel('info'),
      error: createLogLevel('error'),
      fatal: createLogLevel('fatal'),
      trace: createLogLevel('trace'),

      duplicate: (fields) => getLogger({ ...base, ...fields }),
    };
  }

  const createLogLevel =
    (level: levelsTemp): Log =>
    (message, fields = {}) => {
      const msg = {
        ...base,
        ...fields,
        ...realMapper[level],
        app,
        product,
        environment,
        version,
        message: msgToString(message),
        timestamp: Date.now() / 1000,
      };

      console.log(JSON.stringify(msg));
    };

  return {
    fatal: createLogLevel('fatal'),
    error: createLogLevel('error'),
    warn: createLogLevel('warn'),
    info: createLogLevel('info'),
    debug: createLogLevel('debug'),
    trace: createLogLevel('trace'),

    duplicate: (fields) => getLogger({ ...base, ...fields }),
  };
};

const msgToString = (message: string | object) =>
  typeof message === 'string' ? message : JSON.stringify(message);

type Log = (message: string | object, fields?: {}) => void;

type levels = 'trace' | 'info' | 'warn' | 'error' | 'fatal' | 'debug';

type BaseLogger = { [K in levels]: Log };

export interface Logger extends BaseLogger {
  duplicate: (fields: object) => Logger;
}

// export type Logger = ReturnType<typeof getLogger>;
