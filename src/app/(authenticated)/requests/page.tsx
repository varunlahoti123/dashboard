import { getUserProjectsWithRecordRequests } from "@/app/_actions/record-requests"
import { RequestsTable } from "./components/requests-table"
import { ProjectWithRequests } from "@/types/projects"

export default async function RequestsPage() {
  const projectsWithRequests = await getUserProjectsWithRecordRequests()

  return <RequestsTable projectsWithRequests={projectsWithRequests as unknown as ProjectWithRequests[]} />
}
