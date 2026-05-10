import { createPoiService, getAllPoisService } from '@/services/pois.service';
import type { createPoiRoute } from '@/routes/schemas/create-poi.openapi';
import type { listPoisRoute } from '@/routes/schemas/list-pois.openapi';
import { RouteHandler } from '@hono/zod-openapi';

import { poiResponseSchema } from '@/routes/schemas/poi-responses.schema';

export const createPoiController: RouteHandler<typeof createPoiRoute> = async (c) => {
  const data = c.req.valid('json');

  try {
    const poi = await createPoiService(data);
    
    const rawResponse = {
      ...poi,
      createdAt: poi.createdAt.toISOString(),
      updatedAt: poi.updatedAt.toISOString(),
    };

    const safeResponse = poiResponseSchema.parse(rawResponse);
    
    console.log('Antes do strip:', Object.keys(rawResponse));
    console.log('Depois do strip:', Object.keys(safeResponse));

    return c.json(safeResponse, 201);
  } catch (error) {
    console.error('Error creating POI:', error);
    return c.json({ error: 'Erro interno no servidor' }, 500);
  }
};

export const listPoisController: RouteHandler<typeof listPoisRoute> = async (c) => {
  try {
    const pois = await getAllPoisService();

    const safeResponse = pois.map(poi => 
      poiResponseSchema.parse({
        ...poi,
        createdAt: poi.createdAt.toISOString(),
        updatedAt: poi.updatedAt.toISOString(),
      })
    );

    return c.json(safeResponse, 200);
  } catch (error) {
    console.error('Error listing POIs:', error);
    return c.json({ error: 'Erro interno no servidor' }, 500);
  }
};
