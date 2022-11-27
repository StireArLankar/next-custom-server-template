declare module 'next/config' {
  type Config = {
    publicRuntimeConfig: {
      basePath: string;
    };
  };
  function getConfig(): Config;
  //@ts-ignore
  export = getConfig;
}
