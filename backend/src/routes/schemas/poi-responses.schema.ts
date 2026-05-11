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
  success: z.boolean().openapi({ example: false }),
  error: z.string().openapi({ example: 'Erro de Validação' }),
  details: z.array(
    z.object({
      field: z.string().openapi({ example: 'x' }),
      message: z.string().openapi({ example: 'A coordenada X deve ser um inteiro não negativo' }),
    })
  ).optional(),
});

export const conflictSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  error: z.string().openapi({ example: 'Conflito de Regra de Negócio' }),
  details: z.array(
    z.object({
      field: z.string().openapi({ example: 'database' }),
      message: z.string().openapi({ 
        example: 'Conflito: Nome de POI já cadastrado. (OU: Conflito: Coordenadas já ocupadas.)'
      }),
    })
  ).optional(),
});

export const internalServerErrorSchema = z.object({
  error: z.string().openapi({ example: 'Erro interno no servidor' }),
});
