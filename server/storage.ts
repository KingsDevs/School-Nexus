import { 
  admins, faculty, students, events, eventImages,
  type Admin, type InsertAdmin,
  type Faculty, type InsertFaculty,
  type Student, type InsertStudent,
  type Event, type InsertEvent,
  type EventImage, type InsertEventImage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Admin
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdmin(id: number): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Faculty
  getFaculty(department?: 'junior_high' | 'senior_high'): Promise<Faculty[]>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  deleteFaculty(id: number): Promise<void>;

  // Students
  getStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  deleteStudent(id: number): Promise<void>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<(Event & { images: EventImage[] }) | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Event Images
  createEventImage(image: InsertEventImage): Promise<EventImage>;
}

export class SQLiteStorage implements IStorage {
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.username, username));
    return result[0];
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.id, id));
    return result[0];
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const result = await db.insert(admins).values(insertAdmin).returning();
    return result[0];
  }

  async getFaculty(department?: 'junior_high' | 'senior_high'): Promise<Faculty[]> {
    if (department) {
      return await db.select().from(faculty).where(eq(faculty.department, department));
    }
    return await db.select().from(faculty);
  }

  async createFaculty(insertFaculty: InsertFaculty): Promise<Faculty> {
    const result = await db.insert(faculty).values(insertFaculty).returning();
    return result[0];
  }

  async deleteFaculty(id: number): Promise<void> {
    await db.delete(faculty).where(eq(faculty.id, id));
  }

  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(insertStudent).returning();
    return result[0];
  }

  async deleteStudent(id: number): Promise<void> {
    await db.delete(students).where(eq(students.id, id));
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<(Event & { images: EventImage[] }) | undefined> {
    const eventResult = await db.select().from(events).where(eq(events.id, id));
    const event = eventResult[0];
    
    if (!event) return undefined;

    const images = await db.select().from(eventImages).where(eq(eventImages.eventId, id));
    return { ...event, images };
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async createEventImage(insertImage: InsertEventImage): Promise<EventImage> {
    const result = await db.insert(eventImages).values(insertImage).returning();
    return result[0];
  }
}

export const storage = new SQLiteStorage();
