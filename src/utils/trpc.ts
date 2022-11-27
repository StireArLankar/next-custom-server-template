import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { createTRPCNext } from '@trpc/next';
import getConfig from 'next/config';

import type { AppRouter } from '~/api';

export const trpc = createTRPCNext<AppRouter>({
  config: (_) => {
    const config = getConfig();
    const { basePath } = config.publicRuntimeConfig;

    const _httpLink = httpLink({ url: basePath + '/api/trpc' });

    const wsLinkClient = (() => {
      if (typeof window === 'undefined') {
        return _httpLink;
      }

      const host =
        process.env.NODE_ENV === 'production'
          ? window.location.host
          : 'localhost:9004';

      const protocol = window.location.protocol.replace('http', 'ws');

      const url = protocol + '//' + host + basePath + '/api/ws/socket';
      const client = createWSClient({ url });

      if (process.env.NODE_ENV !== 'production') {
        console.log(url);
      }

      return wsLink({ client });
    })();

    return {
      url: basePath + '/api/trpc',
      links: [
        // call subscriptions through websockets and the rest over http
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLinkClient,
          false: _httpLink,
        }),
      ],
      queryClientConfig: {
        logger: {
          error: () => {},
          log: () => {},
          warn: () => {},
        },
        defaultOptions: {
          queries: { enabled: typeof window !== 'undefined' },
        },
      },
    };
  },

  ssr: false,
});
