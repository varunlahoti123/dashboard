"use server"

import { auth } from "@clerk/nextjs/server";
import { createRecordRequest, createHipaaAuthorization, updateRecordRequestNotes } from "@/server/db/queries";
import { recordRequestFormSchema } from "@/types/record-requests";
import { hipaaAuthorizationFormSchema } from "@/types/hipaa";
import { revalidatePath } from "next/cache";
import { getUserProjectsWithRequests } from "@/server/db/queries";

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