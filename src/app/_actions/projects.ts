"use server"
// Server actions for projects

import { auth } from "@clerk/nextjs/server";
import { getUserProjectsWithRequests } from "@/server/db/queries";
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

