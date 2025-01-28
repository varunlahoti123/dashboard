"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { createNewRecordRequest, createNewHipaaAuthorization } from "@/app/_actions/record-requests";
import { ProjectWithRequests } from "@/types/projects";

export function AddPatientForm({ projects }: { projects: ProjectWithRequests[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Record Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Record Request</DialogTitle>
          <DialogDescription>Add a new record request to an existing project.</DialogDescription>
        </DialogHeader>
        <form action={async (formData) => {
          try {
            // First create the record request
            const recordRequest = await createNewRecordRequest(formData);
            
            // Then create the HIPAA authorization using the new record request ID
            const hipaaFormData = new FormData();
            hipaaFormData.append("record-request-id", recordRequest.id);
            hipaaFormData.append("project-id", formData.get("project") as string);
            hipaaFormData.append("hipaa-auth-url", formData.get("hipaa-auth-url") as string);
            hipaaFormData.append("expiration-date", formData.get("expiration-date") as string);
            
            await createNewHipaaAuthorization(hipaaFormData);
            
            setOpen(false);
            router.refresh();
          } catch (error) {
            console.error("Error creating record request with HIPAA authorization:", error);
            // You might want to add error handling UI here
            throw error;
          }
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input 
                name="patient-name" 
                id="patient-name" 
                placeholder="Enter patient name" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patient-dob">Date of Birth</Label>
              <Input 
                name="patient-dob" 
                id="patient-dob" 
                type="date" 
                placeholder="Patient's date of birth" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facility">Facility Name</Label>
              <Input 
                name="facility" 
                id="facility" 
                placeholder="Enter facility name" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facility-address">Facility Address</Label>
              <textarea 
                name="facility-address" 
                id="facility-address" 
                placeholder="Enter facility address"
                required
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visit-dates">Visit Date Range</Label>
              <div className="flex gap-2 items-center">
                <div className="grid gap-1 flex-1">
                  <Label htmlFor="start-date" className="text-sm">From</Label>
                  <Input 
                    name="start-date" 
                    id="start-date" 
                    type="date" 
                    placeholder="Start date" 
                    required
                  />
                </div>
                <div className="grid gap-1 flex-1">
                  <Label htmlFor="end-date" className="text-sm">To</Label>
                  <Input 
                    name="end-date" 
                    id="end-date" 
                    type="date" 
                    placeholder="End date" 
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select name="project" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="hipaa-auth-url">HIPAA Authorization Document URL</Label>
                <Input 
                  name="hipaa-auth-url" 
                  id="hipaa-auth-url" 
                  type="url"
                  placeholder="https://example.com/hipaa-auth.pdf"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiration-date">Authorization Expiration Date</Label>
                <Input 
                  name="expiration-date" 
                  id="expiration-date" 
                  type="date"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">Add Patient</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 