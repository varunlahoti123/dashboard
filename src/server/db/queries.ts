import { db } from "./index";
import { projects, recordRequests, type Project, type RecordRequest } from "./schema";
import { eq, inArray } from "drizzle-orm";

export async function getProjectsByUserId(userId: string) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.createdAt);
}

export async function getRecordRequestsByProjectIds(projectIds: string[]) {
  if (projectIds.length === 0) return [];
  
  return await db
    .select()
    .from(recordRequests)
    .where(
      // Using in operator for multiple project IDs
      inArray(recordRequests.projectId, projectIds)
    )
    .orderBy(recordRequests.createdAt);
}

// Combined function to get all data in one query
export async function getUserProjectsWithRequests(userId: string) {
  const userProjects = await getProjectsByUserId(userId);
  const projectIds = userProjects.map(project => project.id);
  const requests = await getRecordRequestsByProjectIds(projectIds);

  // Organize requests by project
  const requestsByProject = userProjects.map(project => ({
    ...project,
    requests: requests.filter(request => request.projectId === project.id)
  }));

  return requestsByProject;
} 