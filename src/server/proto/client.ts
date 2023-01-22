import {
  createChannel,
  createClientFactory,
  ClientMiddlewareCall,
  CallOptions,
  Metadata,
} from 'nice-grpc';

import {
  TestServiceDefinition,
  TestServiceClient,
} from 'proto/domain/example/test';
import { unknownToErrorMessage } from '~/utils/unknownToErrorMessage';

async function* authMiddleware<Request, Response>(
  call: ClientMiddlewareCall<Request, Response>,
  options: CallOptions
) {
  options.metadata?.set('Authorization', 'Bearer 123');

  if (!call.responseStream) {
    const response = yield* call.next(call.request, options);

    return response;
  } else {
    for await (const response of call.next(call.request, options)) {
      yield response;
    }

    return;
  }
}

async function* loggingMiddleware<Request, Response>(
  call: ClientMiddlewareCall<Request, Response>,
  options: CallOptions
) {
  const { path } = call.method;

  console.log('Client call', path, 'start');

  try {
    const result = yield* call.next(call.request, options);

    console.log('Client call', path, 'end: OK');

    return result;
  } catch (error) {
    const err = unknownToErrorMessage(error);
    console.log('Client call', path, `error: ${err}`);

    throw error;
  }
}

export const createGRPCClient = () => {
  const channel = createChannel('0.0.0.0:8080');

  const client: TestServiceClient = createClientFactory()
    .use(authMiddleware)
    .use(loggingMiddleware)
    .create(TestServiceDefinition, channel, {
      '*': {
        metadata: new Metadata(),
      },
    });

  // const readEvents = async () => {
  //   for await (const response of client.readEvents({})) {
  //     // ...
  //   }
  // };

  return client;
};
