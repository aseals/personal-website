import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 grid grid-cols-[240px_1fr] gap-x-32">
        <div className="mt-[240px] ml-[120px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 grid grid-cols-[240px_1fr] gap-x-32">
      <div className="mt-[240px] ml-[120px]">
        <ProjectList projects={projects || []} />
      </div>

      <div className="mt-[240px]">
        <h1 className="text-xl font-medium mb-1">Ayanna Seals, PhD</h1>
        <p className="text-muted-foreground text-base">
          Big Data & AI UX Strategist | Turning Complex Data into Clear, Actionable Insights
        </p>
        <div className="mt-4 space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Email</a>
          <a href="https://www.linkedin.com/in/ayannaseals/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</a>
          <a href="https://scholar.google.com/citations?user=-XXuiGkAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">Scholar</a>
        </div>
      </div>
    </div>
  );
}