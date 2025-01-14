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

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (typeof data.letterOfRepresentation === 'string') {
      formData.append("letterOfRepresentation", data.letterOfRepresentation);
    }

    const result = await createNewProject(formData);
    
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="letterOfRepresentation">Letter of Representation URL</Label>
            <Input 
              id="letterOfRepresentation" 
              placeholder="https://example.com/letter.pdf"
              {...register("letterOfRepresentation")} 
            />
          </div>
          <Button type="submit" className="w-full">Create Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 