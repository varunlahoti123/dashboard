/**
 * Projects API client module
 * 
 * This module provides the client-side API interface for interacting with projects and record requests.
 * It handles authentication via Clerk and makes HTTP requests to the projects API endpoints.
 * 
 * The module exports:
 * - ProjectWithRequests type: Represents a project and its associated record requests
 * - getProjectsWithRequests(): Fetches authenticated user's projects with their requests
 */

import { auth } from "@clerk/nextjs/server";

export type ProjectWithRequests = {
  id: string;
  name: string;
  description: string | null;
  requests: Array<{
    id: string;
    patientName: string;
    providerName: string;
    visitDateStart: Date;
    visitDateEnd: Date;
    status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  }>;
};

// This function makes an authenticated HTTP request to fetch projects and their requests
// Returns a Promise that resolves to an array of ProjectWithRequests
export async function getProjectsWithRequests(): Promise<ProjectWithRequests[]> {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const fullUrl = new URL('/api/projects', baseUrl).toString();
    
    // console.log('Request Details:', {
    //   isServer: typeof window === 'undefined',
    //   baseUrl,
    //   relativePath: '/api/projects',
    //   fullUrl,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   }
    // });

    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'same-origin'
    });

    console.log('Response Details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      // Try to get the error message from the response body
      let errorDetail: string;
      try {
        const errorJson = await response.json();
        errorDetail = JSON.stringify(errorJson);
      } catch (_) {
        errorDetail = await response.text();
      }

      throw new Error(
        `Failed to fetch projects: ${response.status}\n` +
        `Status Text: ${response.statusText}\n` +
        `Error Details: ${errorDetail}`
      );
    }

    const data = await response.json();
    return data as ProjectWithRequests[];
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
} 