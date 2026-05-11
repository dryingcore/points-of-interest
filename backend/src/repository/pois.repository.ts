import { db } from '@/config/database/db.config';
import { pois } from '@/config/database/schema/pois.schema';
import { eq, and, sql } from 'drizzle-orm';

export type CreatePoiInput = typeof pois.$inferInsert;

export async function getPoiByName(name: string) {
  const result = await db.select().from(pois).where(eq(pois.name, name));
  return result[0];
}

export async function getPoiByCoordinates(x: number, y: number) {
  const result = await db.select().from(pois).where(and(eq(pois.x, x), eq(pois.y, y)));
  return result[0];
}

export async function createPoi(data: CreatePoiInput) {
  const result = await db.insert(pois).values(data).onConflictDoNothing().returning();
  return result[0];
}

export async function getAllPois() {
  return await db.select().from(pois);
}

export async function searchPoisByProximity(x: number, y: number, dmax: number) {
  return await db.select()
    .from(pois)
    .where(
      sql`sqrt(power(${pois.x} - ${x}, 2) + power(${pois.y} - ${y}, 2)) <= ${dmax}`
    );
}
