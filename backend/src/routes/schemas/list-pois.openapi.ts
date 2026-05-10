import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { poiResponseSchema, internalServerErrorSchema } from './poi-responses.schema';

export const listPoisRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['POIs'],
  summary: 'Listar todos os Pontos de Interesse',
  description: 'Retorna uma lista com todos os POIs cadastrados no banco de dados.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(poiResponseSchema),
        },
      },
      description: 'Lista de POIs retornada com sucesso',
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
