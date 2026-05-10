import { OpenAPIHono } from '@hono/zod-openapi';
import { createPoiController } from '@/controllers/pois.controller';
import { createPoiRoute } from './schemas/create-poi.openapi';

const poisRouter = new OpenAPIHono();

poisRouter.openapi(createPoiRoute, createPoiController);

export default poisRouter;
