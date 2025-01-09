"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { AlertCircle, FileText, Upload, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export default function BulkUpload() {
  const [files, setFiles] = React.useState<File[]>([])
  const [patients, setPatients] = React.useState<string[]>(["John Doe", "Jane Smith", "Alice Johnson"])
  const [uploadStatus, setUploadStatus] = React.useState<"idle" | "success" | "error">("idle")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    // Simulating upload process
    setTimeout(() => {
      setUploadStatus("success")
      // Reset after 3 seconds
      setTimeout(() => setUploadStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Bulk Upload Medical Records</CardTitle>
        <CardDescription>Upload multiple PDF files and associate them with patients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="file-upload">Select PDF Files</Label>
            <div className="mt-2 flex items-center space-x-2">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient} value={patient}>
                              {patient}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">+ Add New Patient</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {uploadStatus === "success" && (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Files have been successfully uploaded and associated with patients.</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>There was an error uploading the files. Please try again.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setFiles([])}>Clear All</Button>
        <Button onClick={handleUpload} disabled={files.length === 0}>
          <FileText className="mr-2 h-4 w-4" />
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </Button>
      </CardFooter>
    </Card>
  )
}

