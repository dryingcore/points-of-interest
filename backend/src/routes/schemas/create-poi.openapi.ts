import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { poiResponseSchema, badRequestSchema, internalServerErrorSchema } from './poi-responses.schema';

export const createPoiSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(255).openapi({
    example: 'Lanchonete',
    description: 'Nome do Ponto de Interesse',
  }),
  x: z.number().int().nonnegative('A coordenada X deve ser um inteiro não negativo').openapi({
    example: 27,
    description: 'Coordenada X',
  }),
  y: z.number().int().nonnegative('A coordenada Y deve ser um inteiro não negativo').openapi({
    example: 12,
    description: 'Coordenada Y',
  }),
});

export const createPoiRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['POIs'],
  summary: 'Cadastrar um novo Ponto de Interesse',
  description: 'Cadastra um novo POI passando nome e coordenadas X e Y.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createPoiSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: poiResponseSchema,
        },
      },
      description: 'POI cadastrado com sucesso',
    },
    400: {
      content: {
        'application/json': {
          schema: badRequestSchema,
        },
      },
      description: 'Erro de validação (ex: X negativo)',
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
