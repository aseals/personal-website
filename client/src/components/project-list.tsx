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
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] gap-4">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`group text-left ${
              index === 0 || index === 3 ? "row-span-2" : ""
            }`}
          >
            <div className="relative h-full overflow-hidden rounded-sm">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <h3 className="text-sm font-normal mt-2">{project.title}</h3>
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