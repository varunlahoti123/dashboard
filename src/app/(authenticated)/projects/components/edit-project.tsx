'use client'

import { useState } from "react"
import { updateProjectDetails } from "@/app/_actions/projects"
import { FileText, FileCheck, Pencil } from "lucide-react"

export function EditProject({ projectId, initialName, initialDescription, initialLOR, initialRL }: { 
  projectId: string;
  initialName: string;
  initialDescription?: string;
  initialLOR?: string;
  initialRL?: string;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription ?? '')
  const [lor, setLor] = useState(initialLOR ?? '')
  const [rl, setRl] = useState(initialRL ?? '')

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{name}</h3>
            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-gray-900">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Letter of Representation</h3>
            </div>
            {initialLOR ? (
              <a href={initialLOR} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-blue-500">
                View Document →
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No document uploaded</p>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Request Letter</h3>
            </div>
            {initialRL ? (
              <a href={initialRL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-blue-500">
                View Document →
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No document uploaded</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await updateProjectDetails(projectId, { name, description, letterRepresentationDocumentLocation: lor || null, requestLetterDocumentLocation: rl || null })
      setIsEditing(false)
    }} className="space-y-4">
      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 text-xl font-semibold border rounded" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 text-sm border rounded" rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Letter of Representation</h3>
          </div>
          <input value={lor} onChange={(e) => setLor(e.target.value)} placeholder="Document URL" className="w-full p-2 text-sm border rounded mt-2" />
        </div>
        <div className="p-4 border rounded-lg hover:border-green-500 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Request Letter</h3>
          </div>
          <input value={rl} onChange={(e) => setRl(e.target.value)} placeholder="Document URL" className="w-full p-2 text-sm border rounded mt-2" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm">Cancel</button>
        <button type="submit" className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Save</button>
      </div>
    </form>
  )
} 