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
        description:
          "Amplify is an open-source operations platform that helps organizations spend less time on scaffolding like scheduling, coordination, and reporting, and more time on the work that matters, whether that's running a food co-op or delivering client services. The design challenge was making a tool powerful enough for professional services teams feel equally approachable to a volunteer coordinator with no technical background. The solution: a single, consistent interface built around processes people already recognize, cataloging workflows, assigning roles, and automating the repetitive parts, so the same patterns scale from a 50-person mutual aid group to a 17,000-member organization without adding complexity for the user.",
        order: 2
      },
      {
        title: "clinicianX",
        year: 2022,
        type: "System",
        imageUrl: "https://source.unsplash.com/random/800x1000?design=3",
        videoUrl: "/videos/gait-assessment.mp4",
        description:
          "Clinicians assessing chronic neurological conditions rely on brief in-clinic observations that miss how patients actually move in daily life. Wearable sensors can close that gap, but only if the interface makes the data usable at the pace of clinical work. I led the design of a data-rich visualization prototype and used it as a probe in interviews with 10 clinicians, surfacing a core tension between grasping critical information quickly and exploring it in depth. The findings produced design recommendations for remote rehabilitation interfaces, published at CHI 2022.",
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
