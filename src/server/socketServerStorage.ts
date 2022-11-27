import fastify from 'fastify';

export let socketServer: { test: ReturnType<typeof fastify> | undefined } = {
  test: undefined,
};

if (import.meta.hot) {
  console.log(`import.meta.hot in getSocketServer copy.ts`);
  import.meta.hot.accept();
}
