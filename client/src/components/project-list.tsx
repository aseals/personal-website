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
  const [editableProjects, setEditableProjects] = useState<Project[]>(projects);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const [cursorProgress, setCursorProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [editingField, setEditingField] = useState<
    | {
        projectId: number;
        field: "title" | "year";
        value: string;
      }
    | null
  >(null);

  useEffect(() => {
    setEditableProjects(projects);
  }, [projects]);

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
    setHoveredProjectId(project.id);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setHoveredProjectId(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    setCursorProgress(progress);
  };

  const handleClick = (project: Project) => {
    if (isDesktop) return;
    if (editingField) return;
    setSelectedProjectId(project.id);
  };

  const handleClose = () => {
    setSelectedProjectId(null);
    setHoveredProjectId(null);
  };

  const startEditing = (project: Project, field: "title" | "year") => {
    setEditingField({
      projectId: project.id,
      field,
      value: field === "year" ? String(project.year) : project.title,
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const commitEditing = () => {
    if (!editingField) return;

    const trimmedValue = editingField.value.trim();

    setEditableProjects((prev) =>
      prev.map((project) => {
        if (project.id !== editingField.projectId) return project;

        if (editingField.field === "title") {
          if (!trimmedValue) {
            return project;
          }
          return { ...project, title: trimmedValue };
        }

        const parsedYear = parseInt(trimmedValue, 10);
        if (Number.isNaN(parsedYear)) {
          return project;
        }
        return { ...project, year: parsedYear };
      }),
    );

    setEditingField(null);
  };

  const handleInputChange = (value: string) => {
    setEditingField((current) =>
      current ? { ...current, value } : current,
    );
  };

  const activeProjectId = hoveredProjectId ?? selectedProjectId;

  const activeProject =
    activeProjectId != null
      ? editableProjects.find((project) => project.id === activeProjectId) ?? null
      : null;

  const projectsByYear = editableProjects.reduce((acc, project) => {
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
    <div className="relative">
      <div className="space-y-4 relative z-20">
        {years.map((year) => (
          <div key={year}>
            {projectsByYear[year].map((project) => (
              <motion.div
                key={project.id}
                onClick={() => handleClick(project)}
                onMouseEnter={() => handleMouseEnter(project)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className="w-full text-left py-2 flex justify-between items-center group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleClick(project);
                  }
                }}
              >
                <span
                  className="text-base font-medium cursor-text"
                  onClick={(event) => {
                    event.stopPropagation();
                    startEditing(project, "title");
                  }}
                >
                  {editingField?.projectId === project.id && editingField.field === "title" ? (
                    <input
                      className="bg-transparent border-b border-muted-foreground focus:border-foreground focus:outline-none"
                      value={editingField.value}
                      onChange={(event) => handleInputChange(event.target.value)}
                      onBlur={commitEditing}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitEditing();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    project.title
                  )}
                </span>
                <span
                  className="text-sm text-muted-foreground cursor-text"
                  onClick={(event) => {
                    event.stopPropagation();
                    startEditing(project, "year");
                  }}
                >
                  {editingField?.projectId === project.id && editingField.field === "year" ? (
                    <input
                      className="w-16 bg-transparent border-b border-muted-foreground focus:border-foreground focus:outline-none"
                      value={editingField.value}
                      onChange={(event) => handleInputChange(event.target.value)}
                      onBlur={commitEditing}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitEditing();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          cancelEditing();
                        }
                      }}
                      autoFocus
                      inputMode="numeric"
                    />
                  ) : (
                    project.year
                  )}
                </span>
              </motion.div>
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