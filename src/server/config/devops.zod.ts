import { z } from 'zod';

export const devopsConfigSchema = z.object({
  service: z
    .object({
      name: z.string().describe('Имя приложения'),
      environment: z.string().describe('Окружение'),
      hostUrl: z.string().describe('Ури, по которому доступен сервер'),
    })
    .describe('Базовые настройки сервиса'),

  ports: z
    .object({
      application: z.union([z.string(), z.number()]).describe('Основной порт'),
      management: z
        .union([z.string(), z.number()])
        .describe(
          'Менеджемент порт для дебаг целей, доступ только через внутреннюю сеть'
        ),
    })
    .describe('Порты на которых будет работать сервис'),

  product: z
    .string()
    .describe('Название продукта, в состав которого входит приложение.'),

  managerConfig: z
    .object({
      url: z
        .string()
        .describe(
          'урл, по которому будут делаться запросы за менеджерским конфигом (создается девопсом в конфиге разносчика конфигов)'
        ),
      pollingIntervalSeconds: z
        .number()
        .describe('время в секундах между запросами за менеджерским конфигом'),
    })
    .describe('настройки для получения менеджерского конфига'),

  host: z
    .string()
    .describe('хост приложения, к примеру `localhost:3000` (без протокола)'),
});

export type DevopsConfig = z.infer<typeof devopsConfigSchema>;
