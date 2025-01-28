import { Suspense } from "react"
import { getUserProjectsWithRecordRequests } from "@/app/_actions/record-requests"
import { RequestsTable } from "./components/requests-table"

export default async function RequestsPage() {
  const projectsWithRequests = await getUserProjectsWithRecordRequests()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Record Requests</h2>
      <RequestsTable projectsWithRequests={projectsWithRequests} />
    </div>
  )
}
