import "@/styles/globals.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BarChart3, CheckCircle, Clock, FileText, Flag, PieChart, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
export default function DashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Hogan LovellsDashboard</h2>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search requests..."
            className="mr-2"
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              -5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Requests
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,089</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Flagged Requests
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Recent Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="request-trace">Request Traceability</TabsTrigger>
          {/* <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger> */}
        </TabsList>
        <TabsContent value="requests" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-2">ID</th>
                  <th className="text-left pb-2">Patient</th>
                  <th className="text-left pb-2">Provider</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">#12345</td>
                  <td>John Doe</td>
                  <td>General Hospital</td>
                  <td>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                  <td>2023-06-15</td>
                </tr>
                <tr>
                  <td className="py-2">#12346</td>
                  <td>Jane Smith</td>
                  <td>City Clinic</td>
                  <td>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td>2023-06-14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SLA Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                  <PieChart className="h-16 w-16 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="request-trace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Traceability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="request-id">Request ID</Label>
                  <Input id="request-id" placeholder="Enter request ID" />
                  <Button>Trace</Button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Request Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Enter a request ID to view its timeline and associated charts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
    
      </Tabs>

      {/* Replace Provider Packet Flagging card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Record Flagging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Flagged Records</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                Request #12345 - John Doe
              </li>
              <li className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                Request #12346 - Jane Smith
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

