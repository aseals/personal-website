import { useState, useEffect } from "react";
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
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMouseEnter = (project: Project) => {
    if (!isDesktop) return;

    const timer = setTimeout(() => {
      setSelectedProject(project);
    }, 200); // Slight delay to prevent accidental triggers

    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

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
                onMouseEnter={() => handleMouseEnter(project)}
                onMouseLeave={handleMouseLeave}
                className="w-full text-left py-2 flex justify-between items-center group"
              >
                <span className="text-base font-medium">{project.title}</span>
                <span className="text-sm text-muted-foreground">{year}</span>
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