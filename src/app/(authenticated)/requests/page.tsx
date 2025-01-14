import { getProjectsWithRequests } from "@/app/_actions/projects";
import { Suspense } from "react";
import LoadingRequests from "./loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function RequestsPage() {
  return (
    <Suspense fallback={<LoadingRequests />}>
      <RequestsContent />
    </Suspense>
  );
}

async function RequestsContent() {
  const projectsWithRequests = await getProjectsWithRequests();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Medical Record Requests</h2>
        <div className="flex items-center gap-2">
          {/* Create Project Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to organize your medical record requests.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Enter project name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="letter-of-representation">Letter of Representation</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="letter-of-representation" 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      className="h-auto py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full">Create Project</Button>
            </DialogContent>
          </Dialog>

          {/* Add Patient Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Add a new patient to an existing project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input id="patient-name" placeholder="Enter patient name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facility">Facility Name</Label>
                  <Input id="facility" placeholder="Enter facility names" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visit-dates">Visit Date Range</Label>
                  <div className="flex gap-2 items-center">
                    <div className="grid gap-1 flex-1">
                      <Label htmlFor="start-date" className="text-sm">From</Label>
                      <Input 
                        id="start-date" 
                        placeholder="Start date" 
                        type="date" 
                      />
                    </div>
                    <div className="grid gap-1 flex-1">
                      <Label htmlFor="end-date" className="text-sm">To</Label>
                      <Input 
                        id="end-date" 
                        placeholder="End date" 
                        type="date" 
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project1">Medical Records Review 2024</SelectItem>
                      <SelectItem value="project2">Insurance Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Add Patient</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projectsWithRequests.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-xl">Project: {project.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Patient Name</th>
                      <th className="p-2 text-left">Facility</th>
                      <th className="p-2 text-left">Visit Dates</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.requests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="p-2">{request.patientName}</td>
                        <td className="p-2">{request.providerName}</td>
                        <td className="p-2">
                          {new Date(request.visitDateStart).toLocaleDateString()} - {new Date(request.visitDateEnd).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {project.requests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">
                          No requests found for this project
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
        {projectsWithRequests.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </>
  );
}

