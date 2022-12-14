import { EventEmitter } from 'events';

import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import { t, procedure } from '~/api/context';

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const subscriptionRouter = t.router({
  onAdd: procedure.subscription(() => {
    // `resolve()` is triggered for each client when they start subscribing `onAdd`

    // return an `observable` with a callback which is triggered immediately
    return observable<string>((emit) => {
      const onAdd = (data: string) => {
        // emit data to client
        emit.next(data);
      };

      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on('add', onAdd);

      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
  add: procedure
    .input(z.object({ input: z.string() }))
    .mutation(async ({ input }) => {
      ee.emit('add', input.input + '17');
      return input;
    }),
});
