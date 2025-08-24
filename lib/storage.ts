import { createClient } from "@/lib/supabase/client"

export interface VisitData {
  propertyId: string
  visited: boolean
  visitDate?: string
  notes?: string
  rating?: number
  photos?: string[]
  visitDuration?: number
  weather?: string
  companions?: string
  highlights?: string
  wouldRecommend?: boolean
}

export const saveVisitToDatabase = async (
  propertyId: string,
  propertyName: string,
  county: string,
  propertyType: string,
  visited: boolean,
  visitDate?: string,
  notes?: string,
  rating?: number,
  photos?: string[],
  visitDuration?: number,
  weather?: string,
  companions?: string,
  highlights?: string,
  wouldRecommend?: boolean,
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
        notes,
        rating,
        photos: photos ? JSON.stringify(photos) : null,
        visit_duration: visitDuration,
        weather,
        companions,
        highlights,
        would_recommend: wouldRecommend,
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
      rating: visit.rating || undefined,
      photos: visit.photos ? JSON.parse(visit.photos) : undefined,
      visitDuration: visit.visit_duration || undefined,
      weather: visit.weather || undefined,
      companions: visit.companions || undefined,
      highlights: visit.highlights || undefined,
      wouldRecommend: visit.would_recommend || undefined,
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
  rating?: number,
  photos?: string[],
  visitDuration?: number,
  weather?: string,
  companions?: string,
  highlights?: string,
  wouldRecommend?: boolean,
) => {
  await saveVisitToDatabase(
    propertyId,
    propertyName,
    county,
    propertyType,
    visited,
    visitDate,
    notes,
    rating,
    photos,
    visitDuration,
    weather,
    companions,
    highlights,
    wouldRecommend,
  )
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

export const uploadVisitPhoto = async (file: File, propertyId: string): Promise<string> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${propertyId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage.from("visit-photos").upload(fileName, file)

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from("visit-photos").getPublicUrl(fileName)

  return publicUrl
}

export const deleteVisitPhoto = async (photoUrl: string): Promise<void> => {
  const supabase = createClient()

  // Extract file path from URL
  const urlParts = photoUrl.split("/")
  const fileName = urlParts.slice(-3).join("/")

  const { error } = await supabase.storage.from("visit-photos").remove([fileName])

  if (error) throw error
}

export const getVisitStats = async () => {
  const visits = await loadVisitsFromDatabase()
  const visitedSites = visits.filter((v) => v.visited)

  return {
    totalVisits: visitedSites.length,
    averageRating: visitedSites.reduce((sum, v) => sum + (v.rating || 0), 0) / visitedSites.length || 0,
    totalPhotos: visitedSites.reduce((sum, v) => sum + (v.photos?.length || 0), 0),
    recommendedSites: visitedSites.filter((v) => v.wouldRecommend).length,
    visitsByMonth: visitedSites.reduce(
      (acc, v) => {
        if (v.visitDate) {
          const month = new Date(v.visitDate).toISOString().slice(0, 7)
          acc[month] = (acc[month] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ),
  }
}
