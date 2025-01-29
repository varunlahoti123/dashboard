import { Suspense } from "react"
import { getUserProjectsWithRecordRequests } from "@/app/_actions/record-requests"
import { RequestsTable } from "./components/requests-table"
import { AddPatientForm } from "./components/add-patient-form"
import { RecordRequestsBulkActions } from "./components/record-requests-bulk-actions"
import { RequestsFilters } from "./components/requests-filters"

export const dynamic = 'force-dynamic'

export default async function RequestsPage() {
  const projectsWithRequests = await getUserProjectsWithRecordRequests()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Record Requests</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
        </div>
      </div>
      <RequestsTable projectsWithRequests={projectsWithRequests} />
    </div>
  )
}
