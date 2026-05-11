import { sql } from "drizzle-orm";
import { pgTable, serial, integer, varchar, check, timestamp, unique } from "drizzle-orm/pg-core";

export const pois = pgTable('pois', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (table) => [
  check('check_x', sql`${table.x} >= 0`),
  check('check_y', sql`${table.y} >= 0`),
  unique('unique_coordinates').on(table.x, table.y)
])