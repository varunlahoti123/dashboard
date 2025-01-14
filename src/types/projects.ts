import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  letterOfRepresentation: z.any().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export type ProjectWithRequests = {
  id: string;
  name: string;
  description: string | null;
  requests: Array<{
    id: string;
    patientName: string;
    providerName: string;
    visitDateStart: string;
    visitDateEnd: string;
    status: "pending" | "in_progress" | "completed" | "failed" | "cancelled" | null;
  }>;
}; 