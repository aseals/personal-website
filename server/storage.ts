import { projects, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  currentId: number;

  constructor() {
    this.projects = new Map();
    this.currentId = 1;

    // Initialize with sample data
    const sampleProjects: InsertProject[] = [
      {
        title: "AI Insight Dashboard",
        year: 2023,
        type: "UX Research",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/168/original/Record.mp4",
        order: 1
      },
      {
        title: "Data Flow Visualization",
        year: 2023,
        type: "Analytics",
        imageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/128/original/Mobile.mp4",
        order: 2
      },
      {
        title: "Neural Network Explorer",
        year: 2022,
        type: "Research",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/160/original/Typing.mp4",
        order: 3
      },
      {
        title: "Predictive Analytics Platform",
        year: 2022,
        type: "Big Data",
        imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/158/original/Analytics.mp4",
        order: 4
      },
      {
        title: "Machine Learning Interface",
        year: 2022,
        type: "AI Design",
        imageUrl: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/166/original/AI.mp4",
        order: 5
      },
      {
        title: "Data Pattern Recognition",
        year: 2023,
        type: "Research",
        imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=800&q=80",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/164/original/UX.mp4",
        order: 6
      }
    ];

    sampleProjects.forEach(project => {
      const id = this.currentId++;
      this.projects.set(id, { ...project, id });
    });
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => b.year - a.year || a.order - b.order);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
}

export const storage = new MemStorage();