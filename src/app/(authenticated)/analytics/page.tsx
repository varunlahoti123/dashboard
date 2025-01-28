'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

// Sample data for different projects
const projectData = {
  project1: {
    name: "Personal Injury Cases",
    stats: {
      submitted: 245,
      submittedChange: "+12% from last week",
      processing: 82,
      processingChange: "Currently in progress",
      delivered: 156,
      deliveredChange: "+23% from last week",
      failed: 7,
      failedChange: "2.8% failure rate"
    },
    chartData: [
      { day: '1', records: 4 },
      { day: '2', records: 7 },
      { day: '3', records: 12 },
      { day: '4', records: 15 },
      { day: '5', records: 18 },
      { day: '6', records: 24 },
      { day: '7', records: 28 }
    ]
  },
  project2: {
    name: "Medicare Appeals",
    stats: {
      submitted: 178,
      submittedChange: "+8% from last week",
      processing: 45,
      processingChange: "Currently in progress",
      delivered: 120,
      deliveredChange: "+15% from last week",
      failed: 13,
      failedChange: "7.3% failure rate"
    },
    chartData: [
      { day: '1', records: 2 },
      { day: '2', records: 5 },
      { day: '3', records: 8 },
      { day: '4', records: 20 },
      { day: '5', records: 25 },
      { day: '6', records: 28 },
      { day: '7', records: 32 }
    ]
  },
  // project3: {
  //   name: "Hospital Audit Project",
  //   stats: {
  //     submitted: 312,
  //     submittedChange: "+20% from last week",
  //     processing: 95,
  //     processingChange: "Currently in progress",
  //     delivered: 205,
  //     deliveredChange: "+30% from last week",
  //     failed: 12,
  //     failedChange: "3.8% failure rate"
  //   },
  //   chartData: [
  //     { day: '1', records: 10 },
  //     { day: '2', records: 15 },
  //     { day: '3', records: 25 },
  //     { day: '4', records: 30 },
  //     { day: '5', records: 45 },
  //     { day: '6', records: 50 },
  //     { day: '7', records: 65 }
  //   ]
  // }
}

type ProjectKey = keyof typeof projectData;

export default function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectKey>('project1')
  const currentData = projectData[selectedProject]

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h2>
        <div className="w-[280px]">
          <Select 
            onValueChange={(value: string) => setSelectedProject(value as ProjectKey)} 
            defaultValue={selectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project1">Personal Injury Cases</SelectItem>
              <SelectItem value="project2">Medicare Appeals</SelectItem>
              {/* <SelectItem value="project3">Hospital Audit Project</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submitted Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.submitted}</div>
            <p className="text-xs text-muted-foreground">
              {currentData.stats.submittedChange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.processing}</div>
            <p className="text-xs text-muted-foreground">
              {currentData.stats.processingChange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              {currentData.stats.deliveredChange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Requests
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              {currentData.stats.failedChange}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Records Delivered Over Time - {currentData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentData.chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ 
                    value: 'Days', 
                    position: 'bottom' 
                  }} 
                />
                <YAxis
                  label={{ 
                    value: 'Records Delivered', 
                    angle: -90, 
                    position: 'left' 
                  }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.value !== undefined) {
                      return (
                        <div className="bg-white border p-2 shadow-lg rounded-lg">
                          <p className="font-medium">Day {label}</p>
                          <p className="text-sm text-muted-foreground">
                            Records: {payload[0].value}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="records"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

