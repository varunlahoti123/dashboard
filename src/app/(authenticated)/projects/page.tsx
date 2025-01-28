import { getProjects } from "@/app/_actions/projects";
import { Suspense } from "react";
import LoadingRequests from "./loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck } from "lucide-react";
import { CreateProjectForm } from "./components/create-project-form";
import { EditProject } from "./components/edit-project";

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingRequests />}>
      <ProjectsContent />
    </Suspense>
  );
}

async function ProjectsContent() {
  const projects = await getProjects();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
        <CreateProjectForm />
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <EditProject 
                projectId={project.id} 
                initialName={project.name}
                initialDescription={project.description ?? undefined}
                initialLOR={project.letterRepresentationDocumentLocation ?? undefined}
                initialRL={project.requestLetterDocumentLocation ?? undefined}
              />
            </CardHeader>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </>
  );
}

