"use server"

import { auth } from "@clerk/nextjs/server";
import { createRecordRequest, createHipaaAuthorization, updateRecordRequestNotes, createBulkRecordRequests, createBulkHipaaAuthorizations, type BulkRecordRequestInput } from "@/server/db/queries";
import { recordRequestFormSchema } from "@/types/record-requests";
import { hipaaAuthorizationFormSchema } from "@/types/hipaa";
import { revalidatePath } from "next/cache";
import { getUserProjectsWithRequests, getProjectsByUserId } from "@/server/db/queries";
import { parse } from 'csv-parse/sync';

interface CsvRecord {
  projectId: string;
  patientName: string;
  patientDob: string;
  providerName: string;
  providerAddress: string;
  visitDateStart: string;
  visitDateEnd: string;
}

interface CsvRow {
  projectName: string;
  patientName: string;
  patientDob: string;
  providerName: string;
  providerAddress: string;
  visitDateStart: string;
  visitDateEnd: string;
  hipaaAuthorizationLocation?: string;
  hipaaExpirationDate?: string;
}

export async function createNewRecordRequest(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const parsed = recordRequestFormSchema.safeParse({
      projectId: formData.get("project"),
      patientName: formData.get("patient-name"),
      patientDob: formData.get("patient-dob"),
      providerName: formData.get("facility"),
      providerDetails: {
        address: formData.get("facility-address"),
        phone: '',
        fax: '',
      },
      visitDateStart: formData.get("start-date"),
      visitDateEnd: formData.get("end-date"),
      requestType: "medical_records",
      priority: "normal",
    });

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const newRequest = await createRecordRequest(parsed.data);
    revalidatePath('/projects');
    
    return newRequest;  // Return the created request
    
  } catch (error) {
    console.error('Record request creation error:', error);
    throw error;
  }
}

export async function createNewHipaaAuthorization(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const parsed = hipaaAuthorizationFormSchema.safeParse({
      recordRequestId: formData.get("record-request-id"),
      projectId: formData.get("project-id"),
      hipaaAuthorizationLocation: formData.get("hipaa-auth-url"),
      expirationDate: formData.get("expiration-date"),
      status: "valid", // Default status for new authorizations
    });

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    await createHipaaAuthorization(parsed.data);
    revalidatePath('/projects');
    
  } catch (error) {
    console.error('HIPAA authorization creation error:', error);
    throw error;
  }
}

export async function getUserProjectsWithRecordRequests() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const projectsWithRequests = await getUserProjectsWithRequests(userId);
    return projectsWithRequests;
    
  } catch (error) {
    console.error('Error fetching projects with requests:', error);
    throw error;
  }
}

export async function updateNotes(requestId: string, notes: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  await updateRecordRequestNotes(requestId, notes);
  revalidatePath('/requests');
}

export async function createBulkRecordRequestsFromCsv(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const projectMap = await getProjectNameToIdMap(userId);
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const text = await file.text();
  const records = parse(text, { columns: true, skip_empty_lines: true }) as CsvRow[];

  const invalidProjects = records
    .filter(r => !projectMap.has(r.projectName))
    .map(r => r.projectName);
  
  if (invalidProjects.length > 0) {
    throw new Error(`Invalid project names: ${invalidProjects.join(', ')}`);
  }

  const requests = records.map(record => ({
    projectId: projectMap.get(record.projectName)!,
    patientName: record.patientName,
    patientDob: new Date(record.patientDob),
    providerName: record.providerName,
    providerDetails: { address: record.providerAddress },
    visitDateStart: new Date(record.visitDateStart),
    visitDateEnd: new Date(record.visitDateEnd),
  }));

  const newRequests = await createBulkRecordRequests(requests);

  // Create HIPAA authorizations for records that have them
  const hipaaAuths = records
    .map((r, i) => {
      const request = newRequests[i];
      if (!r.hipaaAuthorizationLocation || !request) return null;
      return {
        recordRequestId: request.id,
        projectId: request.projectId,
        hipaaAuthorizationLocation: r.hipaaAuthorizationLocation,
        expirationDate: r.hipaaExpirationDate ? new Date(r.hipaaExpirationDate) : undefined,
        status: 'valid' as const,
      };
    })
    .filter((auth): auth is NonNullable<typeof auth> => auth !== null);

  if (hipaaAuths.length > 0) {
    await createBulkHipaaAuthorizations(hipaaAuths);
  }
  
  console.info('[BULK_UPLOAD] Created count:', newRequests.length);
  revalidatePath('/requests');
  return newRequests.length;
}

export async function getRecordRequestTemplate() {
  return [
    'projectName,patientName,patientDob,providerName,providerAddress,visitDateStart,visitDateEnd,hipaaAuthorizationLocation,hipaaExpirationDate',
    'Project A,John Doe,1990-01-01,Medical Center,123 Health St,2024-01-01,2024-01-31,https://example.com/hipaa.pdf,2025-01-01'
  ].join('\n');
}

async function getProjectNameToIdMap(userId: string) {
  const projects = await getProjectsByUserId(userId);
  return new Map(projects.map(p => [p.name, p.id]));
} 