"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, FileDown, AlertCircle } from "lucide-react";
import { createBulkRecordRequestsFromCsv, getRecordRequestTemplate } from "@/app/_actions/record-requests";
import { toast } from "sonner";
import { parse } from 'csv-parse/sync';
import { ProjectWithRequests } from "@/types/projects";
import { stringify } from 'csv-stringify/sync';

interface CsvRow {
  projectName: string;
  patientName: string;
  patientDob: string;
  providerName: string;
  providerAddress: string;
  visitDateStart: string;
  visitDateEnd: string;
  hipaaAuthorizationLocation?: string;
}

export function RecordRequestsBulkActions({ projects }: { projects: ProjectWithRequests[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateCsv = async (file: File) => {
    const text = await file.text();
    const allRecords = parse(text, { columns: true, skip_empty_lines: true }) as CsvRow[];
    
    const records = allRecords.filter((r: CsvRow) => 
      r.projectName?.trim() !== '' && 
      r.patientName?.trim() !== '' && 
      r.patientDob?.trim() !== '' && 
      r.providerName?.trim() !== '' &&
      (r.hipaaAuthorizationLocation ?? '').startsWith('http')
    );
    
    const projectNames = new Set(projects.map(p => p.name));
    const missingProjects = new Set(
      records.map(r => r.projectName.trim())
        .filter(name => !projectNames.has(name))
    );

    if (missingProjects.size > 0) {
      setError(`Invalid project names: ${Array.from(missingProjects).join(', ')}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    setUploading(true);
    
    try {
      const file = event.target.files[0];
      const text = await file.text();
      const allRecords = parse(text, { columns: true, skip_empty_lines: true }) as CsvRow[];
      
      const validRecords = allRecords.filter((r: CsvRow) => 
        r.projectName?.trim() !== '' && 
        r.patientName?.trim() !== '' && 
        r.patientDob?.trim() !== '' && 
        r.providerName?.trim() !== ''
      );

      const csvContent = stringify(validRecords, {
        header: true,
        quoted: true,
        quote: '"',
        escape: '"'
      });
      
      const filteredCsvFile = new File([csvContent], file.name, { type: 'text/csv' });
      
      if (!await validateCsv(filteredCsvFile)) return;
      
      const formData = new FormData();
      formData.append('file', filteredCsvFile);
      
      const count = await createBulkRecordRequestsFromCsv(formData);
      router.refresh();
      toast.success(`${count} record requests added`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    const template = await getRecordRequestTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'record-requests-template.csv';
    a.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" size="sm" disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <FileDown className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-2 p-2 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
} 