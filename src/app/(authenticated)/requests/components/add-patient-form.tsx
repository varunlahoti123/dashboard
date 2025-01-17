"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { createNewRecordRequest } from "@/app/_actions/record-requests";
import { ProjectWithRequests } from "@/types/projects";

export function AddPatientForm({ projects }: { projects: ProjectWithRequests[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Add a new patient to an existing project.</DialogDescription>
        </DialogHeader>
        <form action={async (formData) => {
          await createNewRecordRequest(formData);
          setOpen(false);
          router.refresh();
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input name="patient-name" id="patient-name" placeholder="Enter patient name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patient-dob">Date of Birth</Label>
              <Input name="patient-dob" id="patient-dob" type="date" placeholder="Patient's date of birth" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facility">Facility Name</Label>
              <Input name="facility" id="facility" placeholder="Enter facility names" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visit-dates">Visit Date Range</Label>
              <div className="flex gap-2 items-center">
                <div className="grid gap-1 flex-1">
                  <Label htmlFor="start-date" className="text-sm">From</Label>
                  <Input name="start-date" id="start-date" type="date" placeholder="Start date" />
                </div>
                <div className="grid gap-1 flex-1">
                  <Label htmlFor="end-date" className="text-sm">To</Label>
                  <Input name="end-date" id="end-date" type="date" placeholder="End date" />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select name="project">
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
          </div>
          <Button type="submit" className="w-full">Add Patient</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 