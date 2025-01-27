import { getUserProjectsWithRequests } from "@/server/db/queries"
import { auth } from "@clerk/nextjs/server"
import { RequestsTable } from "./components/requests-table"
import { ProjectWithRequests } from "@/types/projects"

export default async function RequestsPage() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  
  const projectsWithRequests = await getUserProjectsWithRequests(userId)

  return <RequestsTable projectsWithRequests={projectsWithRequests as unknown as ProjectWithRequests[]} />
}
