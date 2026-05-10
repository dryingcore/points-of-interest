import { z } from '@hono/zod-openapi';

import EnvConfig from '@/utils/env-config';

const config = new EnvConfig();

const basePoiResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Lanchonete' }),
  x: z.number().openapi({ example: 27 }),
  y: z.number().openapi({ example: 12 }),
  createdAt: z.string().openapi({ example: '2026-05-10T00:00:00.000Z' }),
});

export const poiResponseSchema = config.isDevelopment()
  ? basePoiResponseSchema.extend({
      updatedAt: z.string().openapi({ example: '2026-05-10T00:00:00.000Z' }),
    })
  : basePoiResponseSchema;

export const badRequestSchema = z.object({
  error: z.string().openapi({ example: 'Erro de validação' }),
});

export const internalServerErrorSchema = z.object({
  error: z.string().openapi({ example: 'Erro interno no servidor' }),
});
