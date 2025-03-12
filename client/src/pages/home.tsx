import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-start">
        <div className="w-[240px] animate-pulse space-y-4 ml-[120px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex items-start">
      <div className="w-[240px] ml-[120px]">
        <ProjectList projects={projects || []} />
      </div>

      <div className="fixed left-1/2 top-[120px] -translate-x-1/2">
        <h1 className="text-xl font-medium mb-1">Seyit Yilmaz</h1>
        <p className="text-muted-foreground text-base">
          human interface designer at Apple
        </p>
        <div className="mt-4 space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Email</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
        </div>
      </div>
    </div>
  );
}