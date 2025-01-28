import { db } from "./index";
import { InsertRecordRequest, projects, recordRequests, type Project, type RecordRequest } from "./schema";
import { eq, inArray } from "drizzle-orm";
import { ProjectFormValues } from "@/types/projects";
import { RecordRequestFormValues } from "@/types/record-requests";

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

export async function createProject(userId: string, data: ProjectFormValues): Promise<Project> {
  const [newProject] = await db
    .insert(projects)
    .values({
      userId,
      name: data.name,
      description: data.description ?? null,
      letterRepresentationDocumentLocation: typeof data.letterOfRepresentation === 'string' 
        ? data.letterOfRepresentation 
        : null,
      requestLetterDocumentLocation: typeof data.requestLetter === 'string' 
        ? data.requestLetter 
        : null,
    })
    .returning();

  return newProject as Project;
}

export async function createRecordRequest(data: RecordRequestFormValues): Promise<RecordRequest> {
  const [newRequest] = await db
    .insert(recordRequests)
    .values({
      projectId: data.projectId,
      patientName: data.patientName,
      patientDob: new Date(data.patientDob).toISOString(),
      providerName: data.providerName,
      providerDetails: {
        address: data.providerDetails?.address ?? '',
        phone: '',
        fax: '',
      },
      visitDateStart: new Date(data.visitDateStart).toISOString(),
      visitDateEnd: new Date(data.visitDateEnd).toISOString(),
      requestType: data.requestType,
      priority: data.priority,
      status: "pending",
    })
    .returning();

  if (!newRequest) throw new Error("Failed to create record request");

  return newRequest;
} 