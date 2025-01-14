"use server"
// Server actions for projects

import { auth } from "@clerk/nextjs/server";
import { getUserProjectsWithRequests, createProject } from "@/server/db/queries";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { ProjectWithRequests, projectFormSchema } from "@/types/projects";

// Authentication is handled by Clerk middleware and auth() function
export async function getProjectsWithRequests(): Promise<ProjectWithRequests[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Direct database query through server action
    return getUserProjectsWithRequests(userId);
  } catch (error) {
    console.error('Project fetch error:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch projects");
  }
}

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

