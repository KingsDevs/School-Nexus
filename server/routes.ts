import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertAdminSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check auth
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = insertAdminSchema.parse(req.body);
      const admin = await storage.getAdminByUsername(username);

      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = admin.id;
      res.json({ message: "Logged in successfully" });
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.check.path, (req, res) => {
    res.json({ authenticated: !!req.session.userId });
  });

  // Faculty Routes
  app.get(api.faculty.list.path, async (req, res) => {
    const department = req.query.department as 'junior_high' | 'senior_high' | undefined;
    const faculty = await storage.getFaculty(department);
    res.json(faculty);
  });

  app.post(api.faculty.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.faculty.create.input.parse(req.body);
      const faculty = await storage.createFaculty(input);
      res.status(201).json(faculty);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.faculty.delete.path, requireAuth, async (req, res) => {
    await storage.deleteFaculty(Number(req.params.id));
    res.sendStatus(204);
  });

  // Student Routes
  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.post(api.students.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      const student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.students.delete.path, requireAuth, async (req, res) => {
    await storage.deleteStudent(Number(req.params.id));
    res.sendStatus(204);
  });

  // Event Routes
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.events.delete.path, requireAuth, async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.sendStatus(204);
  });

  // Event Images
  app.post(api.eventImages.create.path, requireAuth, async (req, res) => {
    try {
      const { imageUrl } = req.body; // In a real app, handle file upload here
      const image = await storage.createEventImage({
        eventId: Number(req.params.id),
        imageUrl
      });
      res.status(201).json(image);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingAdmin = await storage.getAdminByUsername("admin");
  if (!existingAdmin) {
    await storage.createAdmin({
      username: "admin",
      password: "adminpassword123" // Simple password for demo
    });
    console.log("Admin created: admin / adminpassword123");
  }

  const faculty = await storage.getFaculty();
  if (faculty.length === 0) {
    await storage.createFaculty({ fullName: "John Doe", subject: "Math", position: "Teacher", department: "junior_high" });
    await storage.createFaculty({ fullName: "Jane Smith", subject: "Science", position: "Teacher", department: "senior_high" });
    await storage.createFaculty({ fullName: "Bob Wilson", subject: "English", position: "Head", department: "senior_high" });
  }

  const students = await storage.getStudents();
  if (students.length === 0) {
    await storage.createStudent({ fullName: "Alice Brown", gradeLevel: "7", section: "A" });
    await storage.createStudent({ fullName: "Charlie Davis", gradeLevel: "10", section: "B" });
  }

  const events = await storage.getEvents();
  if (events.length === 0) {
    const event1 = await storage.createEvent({
      title: "Science Fair",
      date: new Date().toISOString().split('T')[0],
      description: "Annual science fair showcasing student projects."
    });
    await storage.createEventImage({ eventId: event1.id, imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d" });

    await storage.createEvent({
      title: "Sports Day",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      description: "Inter-house sports competition."
    });
  }
}
