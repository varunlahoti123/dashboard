import { eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { getUserProjectsWithRequests, getProjectsByUserId, getRecordRequestsByProjectIds } from "../queries";
import { projects, recordRequests, users, RecordRequest } from "../schema";
import { v4 as uuidv4 } from 'uuid';

describe('Database Queries', () => {
  const testUserId = "test_user_" + uuidv4();
  
  // Setup test data
  beforeAll(async () => {
    // First create the test user
    await db.insert(users).values({
      clerkId: testUserId,
      email: `test-${testUserId}@example.com`,
      role: "user"
    });

    // Create test projects
    const projectData = [
      {
        userId: testUserId,
        name: "Test Project 1",
        description: "Test Description 1",
      },
      {
        userId: testUserId,
        name: "Test Project 2",
        description: "Test Description 2",
      }
    ];

    await db.insert(projects).values(projectData);
    
    // Get the created projects to use their IDs
    const createdProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, testUserId));

    // Create test record requests
    const requestData = createdProjects.flatMap(project => ([
      {
        projectId: project.id,
        patientName: "Test Patient 1",
        patientDob: new Date("1990-01-01").toISOString(),
        providerName: "Test Provider",
        providerDetails: {
          address: "123 Test St",
          phone: "123-456-7890",
          fax: "098-765-4321"
        },
        visitDateStart: new Date("2024-01-01").toISOString(),
        visitDateEnd: new Date("2024-01-31").toISOString(),
        status: "pending" as const,
        priority: "normal" as const,
        requestType: "medical_records" as const,
        vendorRouting: "MRO" as const,
        medicalRecordLocation: null
      },
      {
        projectId: project.id,
        patientName: "Test Patient 2",
        patientDob: new Date("1995-01-01").toISOString(),
        providerName: "Test Provider 2",
        providerDetails: {
          address: "456 Test Ave",
          phone: "123-456-7890",
          fax: "098-765-4321"
        },
        visitDateStart: new Date("2024-02-01").toISOString(),
        visitDateEnd: new Date("2024-02-28").toISOString(),
        status: "pending" as const,
        priority: "normal" as const,
        requestType: "medical_records" as const,
        vendorRouting: "MRO" as const,
        medicalRecordLocation: null
      }
    ]));

    await db.insert(recordRequests).values(requestData);
  });

  // Clean up test data
  afterAll(async () => {
    // Delete test record requests first
    await db.delete(recordRequests)
      .where(inArray(
        recordRequests.projectId,
        db.select({ id: projects.id })
          .from(projects)
          .where(eq(projects.userId, testUserId))
      ));
    
    // Delete test projects
    await db.delete(projects)
      .where(eq(projects.userId, testUserId));

    // Finally delete the test user
    await db.delete(users)
      .where(eq(users.clerkId, testUserId));
  });

  test('getProjectsByUserId returns correct projects', async () => {
    const results = await getProjectsByUserId(testUserId);
    expect(results).toHaveLength(2);
    expect(results[0]!.name).toBe("Test Project 1");
    expect(results[1]!.name).toBe("Test Project 2");
  });

  test('getRecordRequestsByProjectIds returns correct requests', async () => {
    const projects = await getProjectsByUserId(testUserId);
    const projectIds = projects.map(p => p.id);
    const results = await getRecordRequestsByProjectIds(projectIds);
    expect(results).toHaveLength(4); // 2 requests per project
  });

  test('getUserProjectsWithRequests returns projects with their requests', async () => {
    const results = await getUserProjectsWithRequests(testUserId);
    expect(results).toHaveLength(2);
    expect(results[0]!.requests).toHaveLength(2);
    expect(results[1]!.requests).toHaveLength(2);
  });
}); 