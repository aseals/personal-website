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
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [cursorProgress, setCursorProgress] = useState(0);
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
    setHoveredProject(project);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setHoveredProject(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDesktop) return;
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    setCursorProgress(progress);
  };

  const handleClick = (project: Project) => {
    if (isDesktop) return;
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
    setHoveredProject(null);
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

  const activeProject = hoveredProject || selectedProject;

  return (
    <div className="relative">
      <div className="space-y-4 relative z-20">
        {years.map((year) => (
          <div key={year}>
            {projectsByYear[year].map((project) => (
              <motion.button
                key={project.id}
                onClick={() => handleClick(project)}
                onMouseEnter={() => handleMouseEnter(project)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
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
        {activeProject && (
          <ProjectViewer
            project={activeProject}
            onMouseLeave={handleMouseLeave}
            cursorProgress={cursorProgress}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}