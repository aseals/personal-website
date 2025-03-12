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
      <div className="space-y-8">
        {years.map((year) => (
          <div key={year}>
            <h2 className="text-sm text-muted-foreground mb-4">{year}</h2>
            <div className="space-y-2">
              {projectsByYear[year].map((project) => (
                <motion.button
                  key={project.id}
                  className="w-full text-left p-4 hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-lg font-medium">{project.title}</span>
                </motion.button>
              ))}
            </div>
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
