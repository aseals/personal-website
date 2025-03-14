import { useState } from "react";
import type { Project } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import ProjectViewer from "./project-viewer";

type ProjectsByYear = {
  [key: number]: Project[];
};

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as ProjectsByYear);

  const years = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <div className="space-y-4">
        {years.map((year) => (
          <div key={year}>
            {projectsByYear[year].map((project) => (
              <motion.button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="w-full text-left py-2 flex items-center whitespace-nowrap"
              >
                <span className="text-base font-medium truncate">{project.title}</span>
                <span className="text-sm text-muted-foreground ml-4 flex-shrink-0">{year}</span>
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectViewer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}