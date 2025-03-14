import { useState } from "react";
import type { Project } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import ProjectViewer from "./project-viewer";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group text-left"
          >
            <div className="aspect-square relative overflow-hidden rounded-sm mb-2">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-sm font-normal">{project.title}</h3>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>{project.type}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
          </motion.button>
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