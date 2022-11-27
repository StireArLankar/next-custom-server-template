import fs from 'node:fs/promises';
import path from 'node:path';

import yaml from 'js-yaml';

import { unknownToErrorMessage } from '~/utils/unknownToErrorMessage';

import { tryToValidate, tryToValidateGithub } from './config.validate';
import { DevopsConfig } from './devops.zod';
import { ManagerConfig } from './manager.zod';

type Config = {
  devopsConfig: DevopsConfig;
  githubConfig: ManagerConfig;
  computed: { languages: string[] };
};

let config: Config;

export const getConfig = (): Config => {
  if (config) {
    return config;
  }

  throw Error('Config undefined. Call readConfig() before');
};

export const readConfig = async (): Promise<void> => {
  const devopsConfig = await readDevopsConfig();
  const githubConfig = await readManagerConfig(devopsConfig);

  if (devopsConfig.service.hostUrl === '/') {
    devopsConfig.service.hostUrl = '';
  }

  if (import.meta.env.PROD) {
    for (const lang in githubConfig.translations) {
      const path1 = path.join(process.cwd(), 'public', 'locales', lang);
      await fs.mkdir(path1, { recursive: true });

      for (const nmsp in githubConfig.translations[lang]) {
        if (nmsp === 'language') {
          continue;
        }
        const path2 = path.join(path1, `${nmsp}.json`);
        const data = githubConfig.translations[lang][nmsp];
        await fs.writeFile(path2, JSON.stringify(data));
      }
    }
  }

  if (global.__root?.i18n) {
    global.__root.i18n.reloadResources();
  }

  config = {
    devopsConfig,
    githubConfig,
    computed: { languages: Object.keys(githubConfig.translations) },
  };
};

export const readDevopsConfig = async (): Promise<DevopsConfig> => {
  /**
   * Путь до конфига деквопса
   *
   * При локальной разработке будет брать `config.local.yaml` c одного уровня
   * с `package.json`.
   *
   * Этот файл в .gitignore, чтоб у каждого разработчика локально был свой конфиг
   *
   * Использовать `config.yaml` как пример для структуры в `config.local.yaml`
   */
  try {
    const p = path.join(process.cwd(), 'config', 'config.local.yml');
    const res = await readAndParseConfig(p);
    return res;
  } catch {
    const p = path.join(process.cwd(), 'config', 'config.yml');
    return readAndParseConfig(p);
  }
};

const readManagerConfig = async (devopsConfig: DevopsConfig) => {
  let managerConfig: any;

  if (import.meta.env.DEV) {
    try {
      const configUrl = path.join(
        process.cwd(),
        'config',
        'config.manager.json'
      );
      const buffer = await fs.readFile(configUrl);
      managerConfig = parseConfig(buffer.toString());
    } catch (e) {
      throw Error('Config not found.');
    }
  } else {
    try {
      const raw = await fetch(devopsConfig.managerConfig.url, {
        headers: { Accept: 'application/json' },
      });

      managerConfig = await raw.json();
    } catch (e) {
      const error = unknownToErrorMessage(e);
      throw Error(`managerConfigSrc not found. ${error}`);
    }
  }

  return tryToValidateGithub(managerConfig, devopsConfig);
};

const readAndParseConfig = async (path: string): Promise<DevopsConfig> => {
  const buffer = await fs.readFile(path);
  const parsed = yaml.load(buffer.toString());

  if (parsed !== null && typeof parsed === 'object') {
    return tryToValidate(parsed);
  }

  throw new Error('cant read yaml');
};

const parseConfig = <T extends {}>(data: string): T => {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (e instanceof Error) {
      console.error({
        app: '_',
        product: '_',
        environment: '_',
        version: '_',
        level: 0,
        logLevel: 'fatal',
        message: 'Config parsing error.',
        exception: JSON.stringify(e.stack),
        timestamp: Date.now() / 1000,
      });
    }

    throw Error('Config parsing error.');
  }
};
