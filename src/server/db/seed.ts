import { db } from "./index";
import { projects, recordRequests } from "./schema";
import { v4 as uuidv4 } from 'uuid';

const CLERK_USERS = {
  VARUN: "user_2rNOZR1E13T9wBHw3vFF92DnVtD",
  ALEJANDRO: "user_2raM6WRaoEI2OvxCXYv7SjgFLMk"
};

const PROJECT_DATA = [
  {
    userId: CLERK_USERS.VARUN,
    name: "Workers Comp Review 2024",
    description: "Medical record collection for ongoing workers compensation cases",
  },
  {
    userId: CLERK_USERS.VARUN,
    name: "Insurance Audit Q1",
    description: "Quarterly audit of insurance claims documentation",
  },
  {
    userId: CLERK_USERS.ALEJANDRO,
    name: "Personal Injury Cases",
    description: "Medical record requests for active PI cases",
  },
  {
    userId: CLERK_USERS.ALEJANDRO,
    name: "Medicare Appeals",
    description: "Documentation collection for Medicare appeal cases",
  },
];

const PROVIDERS = [
  { name: "Memorial Hospital", details: { address: "123 Health Ave, Boston, MA", phone: "617-555-0123", fax: "617-555-0124" }},
  { name: "City Medical Center", details: { address: "456 Care Lane, Boston, MA", phone: "617-555-0125", fax: "617-555-0126" }},
  { name: "Wellness Family Practice", details: { address: "789 Healing Rd, Cambridge, MA", phone: "617-555-0127", fax: "617-555-0128" }},
  { name: "Orthopedic Specialists", details: { address: "321 Bone St, Brookline, MA", phone: "617-555-0129", fax: "617-555-0130" }},
];

async function seed() {
  // Create projects and store their IDs
  const projectIds = await Promise.all(
    PROJECT_DATA.map(async (project) => {
      const [newProject] = await db.insert(projects).values({
        id: uuidv4(),
        userId: project.userId,
        name: project.name,
        description: project.description,
        createdAt: new Date(),
      }).returning({ id: projects.id });
      
      return newProject!.id;
    })
  );

  // Create record requests for each project
//   for (const projectId of projectIds) {
//     await Promise.all([
//       // Request 1: Urgent pending request
//       db.insert(recordRequests).values({
//         // projectId: projectId,
//         patientName: "John Smith",
//         patientDob: new Date(1965, 3, 15),
//         providerName: PROVIDERS[0]!.name,
//         providerDetails: PROVIDERS[0]!.details,
//         visitDateStart: new Date(2023, 1, 15),
//         visitDateEnd: new Date(2023, 8, 30),
//         status: "pending",
//         requestType: "medical_records",
//         priority: "urgent",
//         vendorRouting: "MRO",
//         createdAt: new Date(),
//         notes: "Follow up needed with provider",
//       }),

//       // Request 2: Normal in_progress request
//       db.insert(recordRequests).values({
//         projectId: projectId,
//         patientName: "Maria Garcia",
//         patientDob: new Date(1978, 7, 22),
//         providerName: PROVIDERS[1]!.name,
//         providerDetails: PROVIDERS[1]!.details,
//         visitDateStart: new Date(2023, 2, 10),
//         visitDateEnd: new Date(2023, 9, 15),
//         status: "in_progress",
//         requestType: "medical_records",
//         priority: "normal",
//         vendorRouting: "Datavant",
//         createdAt: new Date(),
//       }),

//       // Request 3: Completed request
//       db.insert(recordRequests).values({
//         projectId: projectId,
//         patientName: "Robert Johnson",
//         patientDob: new Date(1982, 11, 3),
//         providerName: PROVIDERS[2]!.name,
//         providerDetails: PROVIDERS[2]!.details,
//         visitDateStart: new Date(2023, 3, 1),
//         visitDateEnd: new Date(2023, 10, 31),
//         status: "completed",
//         requestType: "medical_records",
//         priority: "normal",
//         vendorRouting: "HealthMark",
//         createdAt: new Date(),
//       })
//     ]);
//   }

  console.log('Seed completed successfully');
}

seed().catch(console.error); 