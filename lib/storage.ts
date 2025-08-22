import { createClient } from "@/lib/supabase/client"

export interface VisitData {
  propertyId: string
  visited: boolean
  visitDate?: string
  notes?: string
}

export const saveVisitToDatabase = async (
  propertyId: string,
  propertyName: string,
  county: string,
  propertyType: string,
  visited: boolean,
  visitDate?: string,
  notes?: string,
) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  if (visited) {
    // Insert or update visit record
    const { error } = await supabase.from("visits").upsert(
      {
        property_id: propertyId,
        property_name: propertyName,
        county,
        property_type: propertyType,
        visited_date: visitDate || new Date().toISOString().split("T")[0],
        user_id: user.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "property_id,user_id",
      },
    )

    if (error) throw error
  } else {
    // Remove visit record
    const { error } = await supabase.from("visits").delete().eq("property_id", propertyId).eq("user_id", user.id)

    if (error) throw error
  }
}

export const loadVisitsFromDatabase = async (): Promise<VisitData[]> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: visits, error } = await supabase.from("visits").select("*").eq("user_id", user.id)

  if (error) throw error

  return (
    visits?.map((visit) => ({
      propertyId: visit.property_id,
      visited: true,
      visitDate: visit.visited_date,
      notes: visit.notes || undefined,
    })) || []
  )
}

export const updatePropertyVisit = async (
  propertyId: string,
  propertyName: string,
  county: string,
  propertyType: string,
  visited: boolean,
  visitDate?: string,
  notes?: string,
) => {
  await saveVisitToDatabase(propertyId, propertyName, county, propertyType, visited, visitDate, notes)
  return await loadVisitsFromDatabase()
}

export const getPropertyVisitStatus = async (propertyId: string): Promise<VisitData | null> => {
  const visits = await loadVisitsFromDatabase()
  return visits.find((v) => v.propertyId === propertyId) || null
}

// Legacy functions for backward compatibility (now empty)
export const saveVisitData = (visits: VisitData[]) => {
  // No longer needed - data is saved to database
}

export const loadVisitData = (): VisitData[] => {
  // No longer needed - data is loaded from database
  return []
}
