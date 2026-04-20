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
        title: "onward",
        year: 2026,
        type: "Feature",
        imageUrl: "https://source.unsplash.com/random/800x1000?ui=1",
        videoUrl: "/videos/onward.mp4",
        description:
          "People worldwide are being locked out of the future of work because few pathways exists from zero tech literacy to real participation. Onward is a three-stage system that bridges that gap by training the one skill that doesn't go obsolete: the ability to figure it out. Users enter through a persistence-based gate, build self-teaching habits through a repeatable method, then advance into training for emerging AI reviewer roles. The design had to work on low-end phones with spotty data while still feeling credible enough to earn trust from both learners in constrained environments and the institutional partners needed to scale it.",
        order: 1
      },
      {
        title: "amplify",
        year: 2026,
        type: "Feature",
        imageUrl: "https://source.unsplash.com/random/800x1000?app=2",
        videoUrl: "/videos/amplify.mp4",
        description: null,
        order: 2
      },
      {
        title: "clinicianX",
        year: 2022,
        type: "System",
        imageUrl: "https://source.unsplash.com/random/800x1000?design=3",
        videoUrl: "/videos/gait-assessment.mp4",
        description: null,
        order: 3
      }
    ];

    sampleProjects.forEach(project => {
      const id = this.currentId++;
      this.projects.set(id, { description: null, ...project, id });
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
