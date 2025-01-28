"use server"
// Server actions for projects

import { auth } from "@clerk/nextjs/server";
import { createProject, getProjectsByUserId, updateProject } from "@/server/db/queries";
import { db } from "@/server/db";
import { projects, type Project } from "@/server/db/schema";
import { ProjectWithRequests, projectFormSchema } from "@/types/projects";
import { revalidatePath } from "next/cache";


export async function createNewProject(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const parsed = projectFormSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      letterOfRepresentation: formData.get("letterOfRepresentation"),
      requestLetter: formData.get("requestLetter"),
    });

    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.message 
      };
    }

    const project = await createProject(userId, parsed.data);
    
    return { 
      success: true, 
      data: project 
    };
    
  } catch (error) {
    console.error('Project creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create project" 
    };
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return getProjectsByUserId(userId);
  } catch (error) {
    console.error('Project fetch error:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch projects");
  }
}

export async function updateProjectDetails(projectId: string, data: { 
  name?: string; 
  description?: string;
  letterRepresentationDocumentLocation?: string | null;
  requestLetterDocumentLocation?: string | null;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  await updateProject(projectId, data);
  revalidatePath('/projects');
}

