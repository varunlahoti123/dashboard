'use client'

import { Filter } from "lucide-react"
import { useFilterStore } from './filter-store'

export function RequestsFilters() {
  const { selectedStatuses, toggleStatus } = useFilterStore()
  const statuses = ['completed', 'pending', 'in_progress']

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Status:</span>
      </div>
      <div className="flex gap-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              selectedStatuses.includes(status) ? 'ring-2 ring-offset-2' : ''
            } ${status === 'completed' ? 'bg-green-100 text-green-800' : 
                status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'}`}
          >
            {status.split('_').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>
    </div>
  )
}