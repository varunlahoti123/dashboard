import { z } from "zod";

export const recordRequestFormSchema = z.object({
  projectId: z.string().uuid(),
  patientName: z.string().min(1),
  patientDob: z.coerce.date(), // Coerces string input to Date
  providerName: z.string().min(1),
  providerDetails: z.object({
    address: z.string(),
    phone: z.string(),
    fax: z.string(),
  }).optional(),
  visitDateStart: z.coerce.date(), // Coerces string input to Date
  visitDateEnd: z.coerce.date(), // Coerces string input to Date
  requestType: z.enum(["medical_records", "billing", "images"]),
  priority: z.enum(["normal", "urgent"]),
  status: z.enum(["pending", "in_progress", "completed", "failed", "cancelled"]).optional()
});

export type RecordRequestFormValues = z.infer<typeof recordRequestFormSchema>;
