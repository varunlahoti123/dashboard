'use client'

import { useState } from "react"
import { updateNotes } from "@/app/_actions/record-requests"
import { Pencil } from "lucide-react"

export function EditNotes({ requestId, initialNotes }: { requestId: string, initialNotes?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(initialNotes ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    await updateNotes(requestId, notes)
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-700">{notes ?? 'No notes available'}</p>
        <button onClick={() => setIsEditing(true)} className="p-1 hover:text-gray-900">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 text-sm border rounded"
        rows={3}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm">Cancel</button>
        <button type="submit" className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Save</button>
      </div>
    </form>
  )
} 