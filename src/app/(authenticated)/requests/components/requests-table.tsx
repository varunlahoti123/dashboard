'use client'

import { useState } from "react"
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
import { ChevronDown, ChevronUp } from "lucide-react"
import React from "react"
import { AddPatientForm } from "./add-patient-form"

const tableRowStyles = "transition-all duration-300 ease-in-out hover:bg-muted animate-in fade-in-0 cursor-pointer"

type RequestWithProjectName = ProjectWithRequests['requests'][0] & { projectName: string };

export function RequestsTable({ projectsWithRequests }: { projectsWithRequests: ProjectWithRequests[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  
  const allRequests = projectsWithRequests.flatMap(project => 
    project.requests.map(request => ({
      ...request,
      projectName: project.name
    }))
  ) as RequestWithProjectName[]

  const filteredRequests = selectedProjectId === "all" 
    ? allRequests
    : allRequests.filter(request => 
        projectsWithRequests.find(p => p.id === selectedProjectId)?.requests.some(r => r.id === request.id)
      )

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Record Requests</h2>
        <div className="flex items-center gap-4">
          <AddPatientForm projects={projectsWithRequests}/>
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
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Visit Dates</TableHead>
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
                    <TableCell className="font-medium">#{request.id.slice(0, 8)}</TableCell>
                    <TableCell>{request.projectName}</TableCell>
                    <TableCell>{request.patientName}</TableCell>
                    <TableCell>{request.providerName}</TableCell>
                    <TableCell>
                      {new Date(request.visitDateStart).toLocaleDateString()} - {new Date(request.visitDateEnd).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {expandedRequestId === request.id && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6}>
                        <div className="py-3 px-4 grid grid-cols-3 gap-8">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status?.split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ') ?? 'Unknown'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Created</p>
                            <p className="text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p className="text-sm text-gray-700">{request.notes ?? 'No notes available'}</p>
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