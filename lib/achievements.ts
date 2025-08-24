import { loadVisitsFromDatabase, getVisitStats } from "@/lib/storage"
import { HERITAGE_PROPERTIES } from "@/lib/heritage-data"
import { createClient } from "@/lib/supabase/client"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "visits" | "exploration" | "dedication" | "social" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  requirement: {
    type: "visit_count" | "county_count" | "type_count" | "rating_average" | "photo_count" | "streak" | "special"
    target: number
    details?: string
  }
  reward?: {
    points: number
    title?: string
  }
}

export const ACHIEVEMENTS: Achievement[] = [
  // Visit Count Achievements
  {
    id: "first_visit",
    name: "Heritage Explorer",
    description: "Visit your first English Heritage site",
    icon: "🏰",
    category: "visits",
    rarity: "common",
    requirement: { type: "visit_count", target: 1 },
    reward: { points: 10 },
  },
  {
    id: "five_visits",
    name: "History Enthusiast",
    description: "Visit 5 English Heritage sites",
    icon: "🏛️",
    category: "visits",
    rarity: "common",
    requirement: { type: "visit_count", target: 5 },
    reward: { points: 25 },
  },
  {
    id: "ten_visits",
    name: "Heritage Hunter",
    description: "Visit 10 English Heritage sites",
    icon: "🗿",
    category: "visits",
    rarity: "common",
    requirement: { type: "visit_count", target: 10 },
    reward: { points: 50 },
  },
  {
    id: "twenty_five_visits",
    name: "Time Traveler",
    description: "Visit 25 English Heritage sites",
    icon: "⏳",
    category: "visits",
    rarity: "rare",
    requirement: { type: "visit_count", target: 25 },
    reward: { points: 100, title: "Time Traveler" },
  },
  {
    id: "fifty_visits",
    name: "Heritage Guardian",
    description: "Visit 50 English Heritage sites",
    icon: "🛡️",
    category: "visits",
    rarity: "rare",
    requirement: { type: "visit_count", target: 50 },
    reward: { points: 200, title: "Heritage Guardian" },
  },
  {
    id: "hundred_visits",
    name: "Master Explorer",
    description: "Visit 100 English Heritage sites",
    icon: "👑",
    category: "visits",
    rarity: "epic",
    requirement: { type: "visit_count", target: 100 },
    reward: { points: 500, title: "Master Explorer" },
  },
  {
    id: "completionist",
    name: "Heritage Completionist",
    description: "Visit all English Heritage sites",
    icon: "🏆",
    category: "visits",
    rarity: "legendary",
    requirement: { type: "visit_count", target: HERITAGE_PROPERTIES.length },
    reward: { points: 1000, title: "Heritage Completionist" },
  },

  // County Exploration Achievements
  {
    id: "county_explorer",
    name: "County Explorer",
    description: "Visit sites in 5 different counties",
    icon: "🗺️",
    category: "exploration",
    rarity: "common",
    requirement: { type: "county_count", target: 5 },
    reward: { points: 30 },
  },
  {
    id: "regional_wanderer",
    name: "Regional Wanderer",
    description: "Visit sites in 10 different counties",
    icon: "🧭",
    category: "exploration",
    rarity: "rare",
    requirement: { type: "county_count", target: 10 },
    reward: { points: 75 },
  },
  {
    id: "national_explorer",
    name: "National Explorer",
    description: "Visit sites in 20 different counties",
    icon: "🌍",
    category: "exploration",
    rarity: "epic",
    requirement: { type: "county_count", target: 20 },
    reward: { points: 200, title: "National Explorer" },
  },

  // Property Type Achievements
  {
    id: "castle_connoisseur",
    name: "Castle Connoisseur",
    description: "Visit 10 different castles",
    icon: "🏰",
    category: "exploration",
    rarity: "common",
    requirement: { type: "type_count", target: 10, details: "Castle" },
    reward: { points: 40 },
  },
  {
    id: "abbey_admirer",
    name: "Abbey Admirer",
    description: "Visit 5 different abbeys",
    icon: "⛪",
    category: "exploration",
    rarity: "common",
    requirement: { type: "type_count", target: 5, details: "Abbey" },
    reward: { points: 30 },
  },
  {
    id: "roman_historian",
    name: "Roman Historian",
    description: "Visit 5 Roman sites",
    icon: "🏛️",
    category: "exploration",
    rarity: "rare",
    requirement: { type: "type_count", target: 5, details: "Roman" },
    reward: { points: 50, title: "Roman Historian" },
  },

  // Quality & Dedication Achievements
  {
    id: "critic",
    name: "Heritage Critic",
    description: "Maintain an average rating of 4+ stars",
    icon: "⭐",
    category: "dedication",
    rarity: "rare",
    requirement: { type: "rating_average", target: 4 },
    reward: { points: 75 },
  },
  {
    id: "photographer",
    name: "Heritage Photographer",
    description: "Upload 50 photos across your visits",
    icon: "📸",
    category: "social",
    rarity: "rare",
    requirement: { type: "photo_count", target: 50 },
    reward: { points: 100, title: "Heritage Photographer" },
  },

  // Special Achievements
  {
    id: "stonehenge_visitor",
    name: "Ancient Wonder",
    description: "Visit the legendary Stonehenge",
    icon: "🗿",
    category: "special",
    rarity: "epic",
    requirement: { type: "special", target: 1, details: "stonehenge" },
    reward: { points: 150, title: "Ancient Wonder" },
  },
  {
    id: "hadrians_wall",
    name: "Wall Walker",
    description: "Visit 3 different Hadrian's Wall sites",
    icon: "🧱",
    category: "special",
    rarity: "rare",
    requirement: { type: "special", target: 3, details: "hadrians_wall" },
    reward: { points: 100, title: "Wall Walker" },
  },
]

export interface UserAchievement {
  achievementId: string
  unlockedAt: string
  progress?: number
}

export const checkAchievements = async (): Promise<Achievement[]> => {
  const visits = await loadVisitsFromDatabase()
  const visitedSites = visits.filter((v) => v.visited)
  const stats = await getVisitStats()

  const newAchievements: Achievement[] = []

  // Get already unlocked achievements
  const unlockedAchievements = await getUserAchievements()
  const unlockedIds = unlockedAchievements.map((ua) => ua.achievementId)

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.includes(achievement.id)) continue

    let isUnlocked = false

    switch (achievement.requirement.type) {
      case "visit_count":
        isUnlocked = visitedSites.length >= achievement.requirement.target
        break

      case "county_count":
        const uniqueCounties = new Set(
          visitedSites.map((v) => {
            const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
            return property?.county
          }),
        ).size
        isUnlocked = uniqueCounties >= achievement.requirement.target
        break

      case "type_count":
        const typeFilter = achievement.requirement.details
        const typeVisits = visitedSites.filter((v) => {
          const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
          return property?.type.includes(typeFilter || "")
        })
        isUnlocked = typeVisits.length >= achievement.requirement.target
        break

      case "rating_average":
        isUnlocked = stats.averageRating >= achievement.requirement.target
        break

      case "photo_count":
        isUnlocked = stats.totalPhotos >= achievement.requirement.target
        break

      case "special":
        if (achievement.requirement.details === "stonehenge") {
          isUnlocked = visitedSites.some((v) => {
            const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
            return property?.name.toLowerCase().includes("stonehenge")
          })
        } else if (achievement.requirement.details === "hadrians_wall") {
          const hadriansWallVisits = visitedSites.filter((v) => {
            const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
            return property?.name.toLowerCase().includes("hadrian")
          })
          isUnlocked = hadriansWallVisits.length >= achievement.requirement.target
        }
        break
    }

    if (isUnlocked) {
      newAchievements.push(achievement)
      await unlockAchievement(achievement.id)
    }
  }

  return newAchievements
}

export const unlockAchievement = async (achievementId: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("user_achievements").upsert(
    {
      user_id: user.id,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,achievement_id",
    },
  )

  if (error) throw error
}

export const getUserAchievements = async (): Promise<UserAchievement[]> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: achievements, error } = await supabase.from("user_achievements").select("*").eq("user_id", user.id)

  if (error) throw error

  return (
    achievements?.map((a) => ({
      achievementId: a.achievement_id,
      unlockedAt: a.unlocked_at,
    })) || []
  )
}

export const getAchievementProgress = async (achievementId: string): Promise<number> => {
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
  if (!achievement) return 0

  const visits = await loadVisitsFromDatabase()
  const visitedSites = visits.filter((v) => v.visited)
  const stats = await getVisitStats()

  switch (achievement.requirement.type) {
    case "visit_count":
      return Math.min(visitedSites.length / achievement.requirement.target, 1) * 100

    case "county_count":
      const uniqueCounties = new Set(
        visitedSites.map((v) => {
          const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
          return property?.county
        }),
      ).size
      return Math.min(uniqueCounties / achievement.requirement.target, 1) * 100

    case "type_count":
      const typeFilter = achievement.requirement.details
      const typeVisits = visitedSites.filter((v) => {
        const property = HERITAGE_PROPERTIES.find((p) => p.id === v.propertyId)
        return property?.type.includes(typeFilter || "")
      })
      return Math.min(typeVisits.length / achievement.requirement.target, 1) * 100

    case "rating_average":
      return Math.min(stats.averageRating / achievement.requirement.target, 1) * 100

    case "photo_count":
      return Math.min(stats.totalPhotos / achievement.requirement.target, 1) * 100

    default:
      return 0
  }
}

export const getRarityColor = (rarity: Achievement["rarity"]) => {
  const colors = {
    common: "bg-gray-100 text-gray-800 border-gray-200",
    rare: "bg-blue-100 text-blue-800 border-blue-200",
    epic: "bg-purple-100 text-purple-800 border-purple-200",
    legendary: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }
  return colors[rarity]
}
