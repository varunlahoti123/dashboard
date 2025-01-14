/**
 * API Route: /api/projects
 * 
 * Handles fetching all projects and their associated record requests for the authenticated user.
 * This endpoint requires authentication via Clerk and returns a combined response of projects
 * with their nested record requests.
 * 
 * GET: Returns an array of projects, each containing an array of associated record requests
 * Response format:
 * [
 *   {
 *     id: string,
 *     name: string,
 *     description: string,
 *     requests: [
 *       {
 *         id: string,
 *         patientName: string,
 *         ...other request fields
 *       }
 *     ]
 *   }
 * ]
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserProjectsWithRequests } from "@/server/db/queries";

export async function GET(request: Request) {
  try {
    // Log incoming request details
    // console.log('API Endpoint Request Details:', {
    //   url: request.url,
    //   method: request.method,
    //   headers: Object.fromEntries(request.headers.entries()),
    // });

    const { userId } = await auth();
    console.log('Auth Result:', { userId });
    
    if (!userId) {
      console.log('API Endpoint: Unauthorized - No userId');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectsWithRequests = await getUserProjectsWithRequests(userId);
    console.log('API Endpoint Response Data:', projectsWithRequests);
    
    return NextResponse.json(projectsWithRequests);
  } catch (error) {
    console.error("API Endpoint Error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 