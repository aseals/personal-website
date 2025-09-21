import { type Project, type InsertProject, type UpdateProject } from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, updates: UpdateProject): Promise<Project | undefined>;
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
        imageUrl: "https://source.unsplash.com/random/800x1000?ui=1",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/168/original/Record.mp4",
        order: 1
      },
      {
        title: "Media Viewer",
        year: 2022,
        type: "Feature",
        imageUrl: "https://source.unsplash.com/random/800x1000?app=2",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/128/original/Mobile.mp4",
        order: 2
      },
      {
        title: "Command System",
        year: 2022,
        type: "System",
        imageUrl: "https://source.unsplash.com/random/800x1000?design=3",
        videoUrl: "https://static.videezy.com/system/resources/previews/000/000/160/original/Typing.mp4",
        order: 3
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

  async updateProject(id: number, updates: UpdateProject): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return undefined;
    }

    const updatedProject: Project = {
      ...existingProject,
      ...updates,
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }
}

export const storage = new MemStorage();
