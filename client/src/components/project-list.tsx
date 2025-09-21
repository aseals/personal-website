import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, UpdateProject } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import ProjectViewer from "./project-viewer";

type ProjectsByYear = {
  [key: number]: Project[];
};

interface ProjectListProps {
  projects: Project[];
  allowEditing?: boolean;
}

export default function ProjectList({
  projects,
  allowEditing = false,
}: ProjectListProps) {
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

  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation<
    Project,
    Error,
    { id: number; updates: UpdateProject },
    {
      previousProjects?: Project[];
      previousEditableProjects?: Project[];
    }
  >({
    mutationFn: async ({ id, updates }) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, updates);
      return (await response.json()) as Project;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/projects"] });

      const previousProjects = queryClient.getQueryData<Project[]>(["/api/projects"]);
      const previousProjectsClone = previousProjects?.map((project) => ({ ...project }));

      let previousEditableProjects: Project[] | undefined;
      setEditableProjects((prev) => {
        previousEditableProjects = prev.map((project) => ({ ...project }));
        return prev.map((project) =>
          project.id === id ? { ...project, ...updates } : project,
        );
      });

      queryClient.setQueryData<Project[]>(["/api/projects"], (existing) =>
        existing
          ? existing.map((project) =>
              project.id === id ? { ...project, ...updates } : project,
            )
          : existing,
      );

      return {
        previousProjects: previousProjectsClone,
        previousEditableProjects,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousEditableProjects) {
        setEditableProjects(context.previousEditableProjects);
      }
      if (context?.previousProjects) {
        queryClient.setQueryData(["/api/projects"], context.previousProjects);
      }
    },
    onSuccess: (updatedProject) => {
      setEditableProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project,
        ),
      );
      queryClient.setQueryData<Project[]>(["/api/projects"], (projects) =>
        projects
          ? projects.map((project) =>
              project.id === updatedProject.id ? updatedProject : project,
            )
          : projects,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  useEffect(() => {
    setEditableProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (!allowEditing) {
      setEditingField(null);
    }
  }, [allowEditing]);

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
    if (!allowEditing) return;
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
    if (!allowEditing) return;
    if (!editingField) return;

    const field = editingField;
    const trimmedValue = field.value.trim();
    const project = editableProjects.find((item) => item.id === field.projectId);

    if (!project) {
      setEditingField(null);
      return;
    }

    let updates: UpdateProject | null = null;

    if (field.field === "title") {
      if (trimmedValue && trimmedValue !== project.title) {
        updates = { title: trimmedValue };
      }
    } else {
      const parsedYear = Number.parseInt(trimmedValue, 10);
      if (!Number.isNaN(parsedYear) && parsedYear !== project.year) {
        updates = { year: parsedYear };
      }
    }

    setEditingField(null);

    if (!updates) {
      return;
    }

    updateProjectMutation.mutate({ id: project.id, updates });
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
                  className={`text-base font-medium ${
                    allowEditing ? "cursor-text" : "cursor-default"
                  }`}
                  onClick={
                    allowEditing
                      ? (event) => {
                          event.stopPropagation();
                          startEditing(project, "title");
                        }
                      : undefined
                  }
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
                  className={`text-sm text-muted-foreground ${
                    allowEditing ? "cursor-text" : "cursor-default"
                  }`}
                  onClick={
                    allowEditing
                      ? (event) => {
                          event.stopPropagation();
                          startEditing(project, "year");
                        }
                      : undefined
                  }
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