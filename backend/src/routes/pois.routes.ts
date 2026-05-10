import { OpenAPIHono } from '@hono/zod-openapi';
import { createPoiController, listPoisController } from '@/controllers/pois.controller';
import { createPoiRoute } from './schemas/create-poi.openapi';
import { listPoisRoute } from './schemas/list-pois.openapi';

const poisRouter = new OpenAPIHono();

poisRouter.openapi(createPoiRoute, createPoiController);
poisRouter.openapi(listPoisRoute, listPoisController);

export default poisRouter;
