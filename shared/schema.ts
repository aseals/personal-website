import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url").notNull(),
  order: integer("order").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  year: true,
  type: true,
  imageUrl: true,
  videoUrl: true,
  order: true,
});

export const updateProjectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .optional(),
    year: z.coerce.number().int({ message: "Year must be an integer" }).optional(),
  })
  .refine((data) => data.title !== undefined || data.year !== undefined, {
    message: "At least one field must be provided",
  });

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
