import type { Express } from "express";
import { createServer, type Server } from "http";
import { updateProjectSchema } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(parseInt(req.params.id));
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const projectId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(projectId)) {
      res.status(400).json({ message: "Invalid project ID" });
      return;
    }

    const parsedBody = updateProjectSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const [issue] = parsedBody.error.issues;
      res.status(400).json({ message: issue?.message ?? "Invalid request" });
      return;
    }

    const updatedProject = await storage.updateProject(projectId, parsedBody.data);
    if (!updatedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json(updatedProject);
  });

  const httpServer = createServer(app);
  return httpServer;
}
