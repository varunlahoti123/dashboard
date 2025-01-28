"use server"

import { auth } from "@clerk/nextjs/server";
import { createRecordRequest } from "@/server/db/queries";
import { recordRequestFormSchema } from "@/types/record-requests";
import { revalidatePath } from "next/cache";

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

    await createRecordRequest(parsed.data);
    revalidatePath('/projects');
    
  } catch (error) {
    console.error('Record request creation error:', error);
    throw error;
  }
} 