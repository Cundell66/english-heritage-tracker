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

  console.log("[v0] Attempting to save visit to database for property:", propertyId)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[v0] Authentication error:", authError)
    throw new Error(`Authentication failed: ${authError.message}`)
  }

  if (!user) {
    console.error("[v0] No authenticated user found")
    throw new Error("User not authenticated")
  }

  console.log("[v0] User authenticated:", user.id)

  if (visited) {
    console.log("[v0] Upserting visit record with data:", {
      property_id: propertyId,
      property_name: propertyName,
      county,
      property_type: propertyType,
      visited_date: visitDate || new Date().toISOString().split("T")[0],
      user_id: user.id,
    })

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
        photos: photos || [],
        visit_duration: visitDuration || 60, // Default to 1 hour if not specified
        weather,
        companions,
        highlights,
        would_recommend: wouldRecommend,
      },
      {
        onConflict: "property_id,user_id",
      },
    )

    if (error) {
      console.error("[v0] Database upsert error:", error)
      throw new Error(`Failed to save visit: ${error.message}`)
    }

    console.log("[v0] Visit saved successfully")
  } else {
    console.log("[v0] Deleting visit record for property:", propertyId)
    const { error } = await supabase.from("visits").delete().eq("property_id", propertyId).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Database delete error:", error)
      throw new Error(`Failed to delete visit: ${error.message}`)
    }

    console.log("[v0] Visit deleted successfully")
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
      photos: visit.photos || undefined,
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

  console.log("[v0] Attempting to upload photo for property:", propertyId, "File:", file.name)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[v0] Photo upload authentication error:", authError)
    throw new Error(`Authentication failed: ${authError.message}`)
  }

  if (!user) {
    console.error("[v0] No authenticated user for photo upload")
    throw new Error("User not authenticated")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${propertyId}/${Date.now()}.${fileExt}`

  console.log("[v0] Uploading file to storage bucket 'visit-photos' with path:", fileName)

  const { data, error } = await supabase.storage.from("visit-photos").upload(fileName, file)

  if (error) {
    console.error("[v0] Storage upload error:", error)
    if (error.message.includes("Bucket not found")) {
      throw new Error("Photo storage is not configured. Please contact support.")
    }
    throw new Error(`Failed to upload photo: ${error.message}`)
  }

  console.log("[v0] Photo uploaded successfully:", data)

  const {
    data: { publicUrl },
  } = supabase.storage.from("visit-photos").getPublicUrl(fileName)

  console.log("[v0] Generated public URL:", publicUrl)
  return publicUrl
}

export const deleteVisitPhoto = async (photoUrl: string): Promise<void> => {
  const supabase = createClient()

  console.log("[v0] Attempting to delete photo:", photoUrl)

  // Extract file path from URL
  const urlParts = photoUrl.split("/")
  const fileName = urlParts.slice(-3).join("/")

  console.log("[v0] Extracted file path:", fileName)

  const { error } = await supabase.storage.from("visit-photos").remove([fileName])

  if (error) {
    console.error("[v0] Photo deletion error:", error)
    throw new Error(`Failed to delete photo: ${error.message}`)
  }

  console.log("[v0] Photo deleted successfully")
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
