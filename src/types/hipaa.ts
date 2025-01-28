import { z } from "zod";

export const hipaaAuthorizationFormSchema = z.object({
  recordRequestId: z.string().uuid(),
  projectId: z.string().uuid(),
  hipaaAuthorizationLocation: z.string().url("Invalid URL format"),
  expirationDate: z.coerce.date().optional(),
  status: z.enum(["valid", "expired", "revoked"]).default("valid"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type HipaaAuthorizationFormValues = z.infer<typeof hipaaAuthorizationFormSchema>;