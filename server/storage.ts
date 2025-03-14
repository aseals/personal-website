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
        title: "DM Resharing",
        year: 2022,
        type: "Feature",
        imageUrl: "https://source.unsplash.com/random/800x800?ui=1",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/168/original/Record.mp4",
        order: 1
      },
      {
        title: "Media Viewer",
        year: 2022,
        type: "Feature",
        imageUrl: "https://source.unsplash.com/random/800x800?interface=2",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/128/original/Mobile.mp4",
        order: 2
      },
      {
        title: "Command System",
        year: 2022,
        type: "System",
        imageUrl: "https://source.unsplash.com/random/800x800?tech=3",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/160/original/Typing.mp4",
        order: 3
      },
      {
        title: "Data Visualization",
        year: 2023,
        type: "Analytics",
        imageUrl: "https://source.unsplash.com/random/800x800?data=4",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/158/original/Analytics.mp4",
        order: 4
      },
      {
        title: "AI Insights",
        year: 2023,
        type: "Research",
        imageUrl: "https://source.unsplash.com/random/800x800?ai=5",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/166/original/AI.mp4",
        order: 5
      },
      {
        title: "UX Strategy",
        year: 2023,
        type: "Design",
        imageUrl: "https://source.unsplash.com/random/800x800?ux=6",
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