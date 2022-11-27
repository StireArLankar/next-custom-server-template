import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';

import { InfoBlock } from '@/InfoBlock';
import { ThemeChanger } from '@/ThemeChanger';
import favicon from 'public/vercel.svg';
import { trpc } from 'src/utils/trpc';

export default function Home() {
  const [state, set] = useState(false);

  const { data } = trpc.hello.useQuery({ text: 'client' });

  console.log(data);

  return (
    <>
      <Head>
        <link rel="icon" href={favicon.src} />
        <title>Title</title>
      </Head>

      <div>{JSON.stringify(state)}</div>

      <div onClick={() => set((prev) => !prev)}>
        <InfoBlock color="green" icon="info" text="Hello world" />
      </div>

      {state && <Component />}

      <ThemeChanger />
    </>
  );
}

const Component = () => {
  trpc.subscription.onAdd.useSubscription(undefined, {
    onData: (data) => {
      console.log(`data`, data);
    },
  });

  const { mutateAsync, data } = trpc.subscription.add.useMutation();

  return (
    <button onClick={() => mutateAsync({ input: 'zxc123' })}>
      mutate {data?.input}
    </button>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (process.env.NODE_ENV === 'production') {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale!, ['common'])),
      },
    };
  } catch (e) {
    if (e instanceof Error) {
      global.__root?.logger?.error(e.message);
    }

    return {
      notFound: true,
    };
  }
};
