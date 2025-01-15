/**
 * This file defines the TypeScript types and Zod validation schemas for projects and their forms.
 * It serves as a central location for project-related type definitions used throughout the application.
 */

import { z } from "zod";

// Schema for validating project creation/edit form data
export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  letterOfRepresentation: z.any().optional(),
});

// Type extracted from the form schema for use in components
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Type representing a project with its associated record requests
// Used when displaying project details and their requests in the UI
export type ProjectWithRequests = {
  id: string;
  name: string;
  description: string | null;
  letterRepresentationDocumentLocation: string | null;
  requests: Array<{
    id: string;
    patientName: string;
    providerName: string;
    visitDateStart: string;
    visitDateEnd: string;
    status: "pending" | "in_progress" | "completed" | "failed" | "cancelled" | null;
  }>;
};