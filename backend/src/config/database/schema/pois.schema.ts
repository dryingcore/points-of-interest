import { sql } from "drizzle-orm";
import { pgTable, serial, integer, varchar, check } from "drizzle-orm/pg-core";

export const pois = pgTable('pois', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull()
}, (table) => [
  check('check_x', sql`${table.x} >= 0`),
  check('check_y', sql`${table.y} >= 0`)
])