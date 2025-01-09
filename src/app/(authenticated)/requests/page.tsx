import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, FolderPlus, UserPlus } from 'lucide-react'

export default function RequestsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Medical Record Requests</h2>
        <div className="flex items-center gap-2">
          {/* Create Project Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to organize your medical record requests.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Enter project name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <Button className="w-full">Create Project</Button>
            </DialogContent>
          </Dialog>

          {/* Add Patient Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Add a new patient to an existing project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input id="patient-name" placeholder="Enter patient name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facility">Facility Name(s)</Label>
                  <Input id="facility" placeholder="Enter facility names" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visit-dates">Visit Dates</Label>
                  <Input id="visit-dates" placeholder="Enter visit dates" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project1">Medical Records Review 2024</SelectItem>
                      <SelectItem value="project2">Insurance Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Add Patient</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {/* Example Project Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Project: Medical Records Review 2024</CardTitle>
            <p className="text-sm text-muted-foreground">
              Comprehensive review of patient records for Q1 2024
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Patient Name</th>
                    <th className="p-2 text-left">Facility</th>
                    <th className="p-2 text-left">Visit Dates</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">John Doe</td>
                    <td className="p-2">General Hospital</td>
                    <td className="p-2">2024-01-15</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        In Progress
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Jane Smith</td>
                    <td className="p-2">City Medical Center</td>
                    <td className="p-2">2024-01-20</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Another Project Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Project: Insurance Review</CardTitle>
            <p className="text-sm text-muted-foreground">
              Insurance claim documentation review
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Patient Name</th>
                    <th className="p-2 text-left">Facility</th>
                    <th className="p-2 text-left">Visit Dates</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">Robert Johnson</td>
                    <td className="p-2">Memorial Hospital</td>
                    <td className="p-2">2024-02-01</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        In Progress
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

