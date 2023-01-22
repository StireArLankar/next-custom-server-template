import { createServer } from 'nice-grpc';

import { TestServiceDefinition } from 'proto/domain/example/test';

import { createGRPCClient } from './client';
import {
  exampleServiceImpl,
  authMiddleware,
  loggingMiddleware,
} from './server';

export { createGRPCClient } from './client';

export const createGrpcServer = async () => {
  const server = createServer().use(loggingMiddleware).use(authMiddleware);

  server.add(TestServiceDefinition, exampleServiceImpl as any);

  await server.listen('0.0.0.0:8080');

  return server;
};

export const testGRPC = async () => {
  await createGrpcServer();

  const client = createGRPCClient();

  const state = await client.getStateById({ id: '123' });

  console.log(state.result);

  const readEvents = async () => {
    console.log(`readEvents`);

    for await (const response of client.readEvents({})) {
      console.log(response);
    }
  };

  readEvents();
};
