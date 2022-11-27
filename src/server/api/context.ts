import * as trpc from '@trpc/server';
import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { OpenApiMeta } from 'trpc-openapi';
import { ZodError } from 'zod';

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export function createContext(_: CreateFastifyContextOptions) {
  return {};
}

export function createExpressContext(_: CreateExpressContextOptions) {
  return {};
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

const logger = t.middleware(async ({ path, type, next }) => {
  const start = process.hrtime();

  const result = await next();

  const [seconds, nanoseconds] = process.hrtime(start);
  const duration = `${seconds + nanoseconds / 1_000_000_000}`;

  if (seconds > 1) {
    const str = `${duration} -- ${path} ${type}`;
    __root.logger?.warn(`LONG request timing: ${str}`);
  }

  if (!result.ok) {
    const msg =
      result.error.cause instanceof ZodError
        ? JSON.stringify(result.error.cause.flatten())
        : result.error.message;

    __root.logger?.warn(`${path} ${type}: ${msg}`);
  }

  return result;
});

export const procedure = t.procedure.use(logger);
