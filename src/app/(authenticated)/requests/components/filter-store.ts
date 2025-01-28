import { create } from 'zustand'

type FilterStore = {
  selectedStatuses: string[]
  toggleStatus: (status: string) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedStatuses: [],
  toggleStatus: (status) => set((state) => ({
    selectedStatuses: state.selectedStatuses.includes(status) 
      ? state.selectedStatuses.filter(s => s !== status)
      : [...state.selectedStatuses, status]
  }))
})) 