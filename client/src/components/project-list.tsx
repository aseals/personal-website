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
          <div key={year} className="group">
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-border"></div>
              <span className="text-sm text-muted-foreground px-4">{year}</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <div className="space-y-6">
              {projectsByYear[year].map((project) => (
                <motion.button
                  key={project.id}
                  className="w-full text-left py-2 transition-colors hover:bg-accent rounded-lg px-4"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{project.title}</span>
                  </div>
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