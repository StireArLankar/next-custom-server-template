import { z } from 'zod';

export const managerConfigSchema = z
  .object({
    $schema: z.string().optional().describe('схема'),
    translations: z
      .record(z.record(z.any()))
      .describe('словарь [ключ языка] - [текст языка + словарь с переводами]'),
    // global: globalStateSchema
    // 	.omit({ version: true })
    // 	.extend({ $schema: z.string() })
    // 	.partial({ $schema: true }),
  })
  .passthrough();

export type ManagerConfig = z.infer<typeof managerConfigSchema>;
