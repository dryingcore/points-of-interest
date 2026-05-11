import { OpenAPIHono } from '@hono/zod-openapi';
import { createPoiController, listPoisController, searchPoisController } from '@/controllers/pois.controller';
import { createPoiRoute } from './schemas/create-poi.openapi';
import { listPoisRoute } from './schemas/list-pois.openapi';
import { searchPoisRoute } from './schemas/search-pois.openapi';
import { validationHook } from '@/hooks/validation-hook';

const poisRouter = new OpenAPIHono({ defaultHook: validationHook });

poisRouter.openapi(createPoiRoute, createPoiController);
poisRouter.openapi(listPoisRoute, listPoisController);
poisRouter.openapi(searchPoisRoute, searchPoisController);

export default poisRouter;
