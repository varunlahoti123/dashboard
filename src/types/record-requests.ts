import { z } from "zod";
import { hipaaAuthorizationFormSchema } from "./hipaa";

export const recordRequestFormSchema = z.object({
  projectId: z.string().uuid(),
  patientName: z.string().min(1),
  patientDob: z.coerce.date(), // Coerces string input to Date
  providerName: z.string().min(1),
  providerDetails: z.object({
    address: z.string(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  }).optional(),
  visitDateStart: z.coerce.date(), // Coerces string input to Date
  visitDateEnd: z.coerce.date(), // Coerces string input to Date
  requestType: z.enum(["medical_records", "billing", "images"]),
  priority: z.enum(["normal", "urgent"]).nullable(),
  status: z.enum(["pending", "in_progress", "completed", "failed", "cancelled"]).optional(),
  createdAt: z.coerce.date().optional(), // Added for display purposes
  notes: z.string().optional()
});

export type RecordRequestFormValues = z.infer<typeof recordRequestFormSchema>;
