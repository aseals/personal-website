import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import ProjectList from "@/components/project-list";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="w-full animate-pulse">
              <CardContent className="h-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-2xl font-medium">Seyit Yilmaz</h1>
          <p className="text-muted-foreground">human interface designer at Apple</p>
          <div className="mt-4 space-x-4">
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