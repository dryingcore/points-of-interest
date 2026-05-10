import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from '@/config/database/schema/index';
import postgres from 'postgres';
import EnvConfig from '@/utils/env-config';

const config = new EnvConfig();

const queryClient = postgres(config.DATABASE_URL, { max: 20 });

export const db = drizzle(queryClient, { schema });

export async function checkDbConnection() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('info: Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('erro: Erro ao conectar com o banco de dados:', error);
    process.exit(1); 
  }
}