'use client'

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProjectWithRequests } from "@/types/projects"
import { ChevronDown, ChevronUp, FileText } from "lucide-react"
import React, { Suspense } from "react"
import { AddPatientForm } from "./add-patient-form"
import { HipaaAuthorization, HipaaAuthorizationSkeleton } from "./hipaa-authorization"
import { ColumnDef } from "@/components/ui/table"
import { useFilterStore } from "./filter-store"
import { RequestsFilters } from "./requests-filters"
import { EditNotes } from "./edit-notes"

const tableRowStyles = "transition-all duration-300 ease-in-out hover:bg-muted animate-in fade-in-0 cursor-pointer"

type RequestWithProjectName = ProjectWithRequests['requests'][0] & { 
  projectName: string;
  tempPatientId: string;
};

const columns: ColumnDef<RequestWithProjectName>[] = [
  {
    id: 'medicalChart',
    header: 'Medical Chart',
    cell: ({ row: { original: request } }) => (
      request.status === 'completed' ? (
        <a 
          href="https://med.ucf.edu/media/2018/08/Sample-Adult-History-And-Physical-By-M2-Student.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center"
        >
          <FileText className="h-5 w-5 text-gray-600 hover:text-gray-900" />
        </a>
      ) : null
    )
  }
]

export function RequestsTable({ projectsWithRequests }: { projectsWithRequests: ProjectWithRequests[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const { selectedStatuses } = useFilterStore()
  
  const patientIds = [
    '#a1b2c3d4', '#e5f6g7h8', '#i9j0k1l2', '#m3n4o5p6', '#q7r8s9t0',
    '#u1v2w3x4', '#y5z6a7b8', '#c9d0e1f2', '#g3h4i5j6', '#k7l8m9n0',
    '#o1p2q3r4', '#s5t6u7v8', '#w9x0y1z2', '#a3b4c5d6', '#e7f8g9h0',
    '#i1j2k3l4', '#m5n6o7p8', '#q9r0s1t2', '#u3v4w5x6', '#y7z8a9b0'
  ];
  
  const allRequests = useMemo(() => {
    const patientIdMap = new Map<string, string>();
    let nextIdIndex = 0;

    return projectsWithRequests
      .flatMap(project => 
        project.requests.map(request => ({
          ...request,
          projectName: project.name,
          tempPatientId: patientIdMap.get(request.patientName) ?? patientIds[nextIdIndex++ % patientIds.length]
        }))
      )
      .sort((a, b) => a.id.localeCompare(b.id)) as RequestWithProjectName[];
  }, [projectsWithRequests]);

  const filteredRequests = useMemo(() => {
    const requests = selectedProjectId === "all" 
      ? allRequests
      : allRequests.filter(r => projectsWithRequests.find(p => p.id === selectedProjectId)?.requests.some(req => req.id === r.id));
    
    return (selectedStatuses.length ? requests.filter(r => r.status && selectedStatuses.includes(r.status)) : requests);
  }, [selectedProjectId, allRequests, projectsWithRequests, selectedStatuses]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <RequestsFilters />
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projectsWithRequests.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddPatientForm projects={projectsWithRequests}/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visit Date Range</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Medical Chart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request, index) => (
                <React.Fragment key={request.id}>
                  <TableRow 
                    className={`${tableRowStyles}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setExpandedRequestId(expandedRequestId === request.id ? null : request.id)}
                  >
                    <TableCell>
                      {expandedRequestId === request.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </TableCell>
                    <TableCell className="font-medium">{request.tempPatientId}</TableCell>
                    <TableCell className="font-medium">#{request.id.slice(0, 8)}</TableCell>
                    <TableCell>{request.projectName}</TableCell>
                    <TableCell>{request.patientName}</TableCell>
                    <TableCell>{request.providerName}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status?.split('_')
                          .map(word => (word?.[0] ?? '').toUpperCase() + (word?.slice(1) || ''))
                          .join(' ') ?? 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(request.visitDateStart).toLocaleDateString()} - {new Date(request.visitDateEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {request.status === 'completed' && (
                        <a 
                          href="https://med.ucf.edu/media/2018/08/Sample-Adult-History-And-Physical-By-M2-Student.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center"
                        >
                          <FileText className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRequestId === request.id && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6}>
                        <div className="py-3 px-4 grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <EditNotes requestId={request.id} initialNotes={request.notes ?? undefined} />
                          </div>
                          <div className="space-y-1">
                            <Suspense fallback={<HipaaAuthorizationSkeleton />}>
                              <HipaaAuthorization requestId={request.id} />
                            </Suspense>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
} 