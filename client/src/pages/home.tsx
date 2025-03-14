import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-screen-lg mx-auto">
          <div className="mt-[240px] mb-16 text-center">
            <div className="h-6 bg-muted rounded w-48 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-96 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="mt-[240px] mb-16 text-center">
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

        <ProjectList projects={projects || []} />
      </div>
    </div>
  );
}