"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormValues, projectFormSchema } from "@/types/projects";
import { createNewProject } from "@/app/_actions/projects";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectWithRequests } from "@/types/projects";

export function CreateProjectForm({ onSuccess, projects }: { onSuccess?: () => void, projects: ProjectWithRequests[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    register, 
    handleSubmit,
    setError, 
    reset,
    formState: { errors } 
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (projects.some(p => p.name === data.name)) {
      setError('name', { message: 'Project name already exists. Please choose a different name.' });
      return;
    }
    
    console.log('Form data received:', data);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description ?? '');
    if (data.letterOfRepresentation) formData.append("letterOfRepresentation", String(data.letterOfRepresentation));
    if (data.requestLetter) formData.append("requestLetter", String(data.requestLetter));
    
    console.log('FormData entries:', [...formData.entries()]);
    
    const result = await createNewProject(formData);
    console.log('Server response:', result);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      reset();
      setOpen(false);
      router.refresh();
      onSuccess?.();
    } else {
      console.error('Error details:', result.error);
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-red-500" : ""} 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="letterOfRepresentation">Letter of Representation URL</Label>
            <Input 
              id="letterOfRepresentation" 
              placeholder="https://example.com/letter.pdf"
              {...register("letterOfRepresentation")} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requestLetter">Request Letter URL</Label>
            <Input 
              id="requestLetter" 
              placeholder="https://example.com/request-letter.pdf"
              {...register("requestLetter")} 
            />
          </div>
          <Button type="submit" className="w-full">Create Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 