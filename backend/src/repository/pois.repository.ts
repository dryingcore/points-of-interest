import { db } from '@/config/database/db.config';
import { pois } from '@/config/database/schema/pois.schema';

export type CreatePoiInput = typeof pois.$inferInsert;

export async function createPoi(data: CreatePoiInput) {
  const result = await db.insert(pois).values(data).returning();
  return result[0];
}

export async function getAllPois() {
  return await db.select().from(pois);
}
