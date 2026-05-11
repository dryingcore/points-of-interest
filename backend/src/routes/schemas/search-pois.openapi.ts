import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { poiResponseSchema, internalServerErrorSchema, badRequestSchema } from './poi-responses.schema';

export const searchPoisQuerySchema = z.object({
  x: z.coerce.number().int().nonnegative('A coordenada X deve ser um número inteiro não negativo').openapi({
    example: 20,
    description: 'Coordenada X de referência',
  }),
  y: z.coerce.number().int().nonnegative('A coordenada Y deve ser um número inteiro não negativo').openapi({
    example: 10,
    description: 'Coordenada Y de referência',
  }),
  dmax: z.coerce.number().nonnegative('A distância máxima deve ser não negativa').openapi({
    example: 10,
    description: 'Distância máxima de busca',
  }),
});

export const searchPoisRoute = createRoute({
  method: 'get',
  path: '/search',
  tags: ['POIs'],
  summary: 'Buscar POIs por proximidade',
  description: 'Retorna uma lista de POIs que estão dentro de uma distância máxima a partir de uma coordenada de referência.',
  request: {
    query: searchPoisQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(poiResponseSchema),
        },
      },
      description: 'Lista de POIs próximos retornada com sucesso',
    },
    400: {
      content: {
        'application/json': {
          schema: badRequestSchema,
        },
      },
      description: 'Erro de validação nos parâmetros de busca',
    },
    500: {
      content: {
        'application/json': {
          schema: internalServerErrorSchema,
        },
      },
      description: 'Erro interno no servidor',
    },
  },
});
