import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 md:p-12">
        <div className="max-w-xl mx-auto animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 md:p-12">
      <div className="max-w-xl mx-auto">
        <header className="mb-16">
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
        </header>

        <ProjectList projects={projects || []} />
      </div>
    </div>
  );
}