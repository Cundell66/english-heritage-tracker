const STORAGE_KEY = "heritage-tracker-visits"

export interface VisitData {
  propertyId: string
  visited: boolean
  visitDate?: string
  notes?: string
}

export const saveVisitData = (visits: VisitData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits))
  }
}

export const loadVisitData = (): VisitData[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export const updatePropertyVisit = (propertyId: string, visited: boolean, visitDate?: string, notes?: string) => {
  const visits = loadVisitData()
  const existingIndex = visits.findIndex((v) => v.propertyId === propertyId)

  const visitData: VisitData = {
    propertyId,
    visited,
    visitDate,
    notes,
  }

  if (existingIndex >= 0) {
    visits[existingIndex] = visitData
  } else {
    visits.push(visitData)
  }

  saveVisitData(visits)
  return visits
}

export const getPropertyVisitStatus = (propertyId: string): VisitData | null => {
  const visits = loadVisitData()
  return visits.find((v) => v.propertyId === propertyId) || null
}
