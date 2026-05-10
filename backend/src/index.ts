import { Hono } from 'hono'
import { checkDbConnection } from '@/config/database/db.config'
import EnvConfig from '@/utils/EnvConfig'

await checkDbConnection()

const config = new EnvConfig()
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono! Server is running with DB connected.')
})

export default {
  port: config.SERVER_PORT,
  fetch: app.fetch,
}
