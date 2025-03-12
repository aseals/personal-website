import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  year: true,
  type: true,
  imageUrl: true,
  order: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
