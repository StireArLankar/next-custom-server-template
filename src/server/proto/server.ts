import { delay } from 'abort-controller-x';
import { JWTPayload } from 'jose';
import {
  CallContext,
  ServerError,
  ServerMiddlewareCall,
  Status,
} from 'nice-grpc';

import {
  GetStateByIdResponse,
  State,
  TestServiceImplementation,
} from 'proto/domain/example/test';
import { unknownToErrorMessage } from '~/utils/unknownToErrorMessage';

// const { JOSEError } = errors;

type AuthCallContextExt = {
  auth: JWTPayload;
};

// const secret = new TextEncoder().encode(
//   'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
// );

export async function* authMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response, AuthCallContextExt>,
  context: CallContext
) {
  const authorization = context.metadata.get('Authorization');

  if (authorization == null) {
    throw new ServerError(
      Status.UNAUTHENTICATED,
      'Missing Authorization metadata'
    );
  }

  const parts = authorization.toString().split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new ServerError(
      Status.UNAUTHENTICATED,
      'Invalid Authorization metadata format. Expected "Bearer <token>"'
    );
  }

  const token = parts[1];

  // const { payload } = await jwtVerify(token, secret).catch((error) => {
  //   if (error instanceof JOSEError) {
  //     throw new ServerError(Status.UNAUTHENTICATED, error.message);
  //   } else {
  //     throw error;
  //   }
  // });

  if (token !== '123') {
    throw new ServerError(Status.UNAUTHENTICATED, `hello there`);
  }

  const payload: JWTPayload = {
    sub: 'hello',
  };

  return yield* call.next(call.request, {
    ...context,
    auth: payload,
  });
}

export async function* loggingMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response>,
  context: CallContext
) {
  const { path } = call.method;

  console.log('Server call', path, 'start');

  try {
    const result = yield* call.next(call.request, context);

    console.log('Server call', path, 'end: OK');

    return result;
  } catch (error) {
    const err = unknownToErrorMessage(error);
    console.log('Server call', path, `error: ${err}`);

    throw error;
  }
}

type A = TestServiceImplementation<AuthCallContextExt>;
export const exampleServiceImpl: A = {
  getStateById: async (request, ctx) => {
    console.log({ sub: ctx.auth.sub });

    if (request.id !== '123') {
      throw new ServerError(Status.INTERNAL, 'Requested data does not exist');
    }

    const resp: GetStateByIdResponse = {
      result: {
        $case: 'succeed',
        succeed: {
          state: {
            id: '123',
            amount: { nanos: 1, units: 2 },
            createdAt: new Date(),
            updatedAt: new Date(),
            description: '213',
            status: { $case: 'success', success: {} },
            version: 1,
          },
        },
      },
    };

    return resp;
  },

  async *readEvents(request, context) {
    console.log(`readEvents request`);
    console.log(request);

    while (true) {
      await delay(context.signal, 2000);

      const state: State = {
        id: '123',
        amount: { nanos: 1, units: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: '213',
        status: { $case: 'success', success: {} },
        version: 1,
      };

      yield state;
    }
  },
};
