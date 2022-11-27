import { DevopsConfig, devopsConfigSchema } from './devops.zod';
import { managerConfigSchema } from './manager.zod';

export const tryToValidate = (config: any) => {
  const result = devopsConfigSchema.safeParse(config);

  if (result.success === false) {
    console.error(
      JSON.stringify({
        app: config.service.name ?? '_',
        product: config.product ?? '_',
        environment: config.service.environment ?? '_',
        version: process.env.VERSION,
        level: 0,
        logLevel: 'fatal',
        message: 'config doesnt match schema!',
        exception: JSON.stringify(result.error.issues),
        timestamp: Date.now() / 1000,
      })
    );

    throw new Error('config doesnt match schema!');
  }

  return result.data;
};

export const tryToValidateGithub = (data: any, config: DevopsConfig) => {
  const result = managerConfigSchema.safeParse(data);

  if (result.success === false) {
    console.error(
      JSON.stringify({
        app: config.service.name,
        product: config.product,
        environment: config.service.environment,
        version: process.env.VERSION,
        level: 0,
        logLevel: 'fatal',
        message: 'github config doesnt match schema!',
        exception: JSON.stringify(result.error.issues),
        timestamp: Date.now() / 1000,
      })
    );

    throw new Error('github config doesnt match schema!');
  }

  return result.data;
};
