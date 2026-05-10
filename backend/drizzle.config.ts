import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import EnvConfig from './src/utils/env-config';

const config = new EnvConfig();

export default defineConfig({
  schema: './src/config/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
