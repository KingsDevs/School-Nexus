import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE: Using SQLite tables as requested by the user. 
// We are replacing pgTable with sqliteTable equivalents.

export const admins = sqliteTable("admins", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  username: sqliteText("username").notNull().unique(),
  password: sqliteText("password").notNull(),
});

export const faculty = sqliteTable("faculty", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  fullName: sqliteText("full_name").notNull(),
  subject: sqliteText("subject").notNull(),
  position: sqliteText("position").notNull(),
  department: sqliteText("department").notNull(), // 'junior_high' or 'senior_high'
});

export const students = sqliteTable("students", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  fullName: sqliteText("full_name").notNull(),
  gradeLevel: sqliteText("grade_level").notNull(),
  section: sqliteText("section").notNull(),
});

export const events = sqliteTable("events", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  title: sqliteText("title").notNull(),
  date: sqliteText("date").notNull(), // ISO date string YYYY-MM-DD
  description: sqliteText("description").notNull(),
});

export const eventImages = sqliteTable("event_images", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  eventId: sqliteInteger("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  imageUrl: sqliteText("image_url").notNull(),
});

// Schemas
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true });
export const insertFacultySchema = createInsertSchema(faculty).omit({ id: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertEventImageSchema = createInsertSchema(eventImages).omit({ id: true });

// Types
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventImage = typeof eventImages.$inferSelect;
export type InsertEventImage = z.infer<typeof insertEventImageSchema>;

export type LoginRequest = z.infer<typeof insertAdminSchema>;
