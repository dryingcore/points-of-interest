import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { checkDbConnection } from '@/config/database/db.config'
import EnvConfig from '@/utils/env-config'
import poisRouter from '@/routes/pois.routes'
import { validationHook } from '@/hooks/validation-hook'

await checkDbConnection()

const config = new EnvConfig()

const app = new OpenAPIHono({ defaultHook: validationHook })

app.get('/', (c) => {
  return c.text('Hello Hono! Server is running with DB connected.')
})

app.route('/pois', poisRouter)

if (config.isDevelopment()) {
  app.doc('/swagger', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'POIs API',
    },
  })

  app.get('/swagger-ui', swaggerUI({ url: '/swagger' }))
}

export default {
  port: config.SERVER_PORT,
  fetch: app.fetch,
}
