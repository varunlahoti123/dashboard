import { getProjects } from "@/app/_actions/projects";
import { Suspense } from "react";
import LoadingRequests from "./loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck } from "lucide-react";
import { CreateProjectForm } from "./components/create-project-form";

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{project.name}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {project.letterRepresentationDocumentLocation && (
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Letter of Representation</h3>
                    </div>
                    <a
                      href={project.letterRepresentationDocumentLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-blue-500"
                    >
                      View Document →
                    </a>
                  </div>
                )}
                {project.requestLetterDocumentLocation && (
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Request Letter</h3>
                    </div>
                    <a
                      href={project.requestLetterDocumentLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-blue-500"
                    >
                      View Document →
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
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

