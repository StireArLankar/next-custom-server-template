import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { themeA, themeB } from '@/global.css';
import { VHProvider } from '@/VHProvider';
import { trpc } from 'src/utils/trpc';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider
        attribute="class"
        themes={[themeA, themeB]}
        defaultTheme={themeA}
        enableSystem={false}
      >
        <VHProvider />

        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

const MyAppWithTranslation = appWithTranslation(MyApp);

export default trpc.withTRPC(MyAppWithTranslation);
