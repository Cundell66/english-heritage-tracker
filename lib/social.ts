import { createClient } from "@/lib/supabase/client"

export interface SocialVisit {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  propertyId: string
  propertyName: string
  county: string
  propertyType: string
  visitDate: string
  notes?: string
  rating?: number
  photos?: string[]
  highlights?: string
  createdAt: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
}

export interface VisitComment {
  id: string
  visitId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  bio?: string
  location?: string
  joinedAt: string
  visitCount: number
  achievementCount: number
  followersCount: number
  followingCount: number
  isFollowing?: boolean
}

export const getSocialFeed = async (limit = 20, offset = 0): Promise<SocialVisit[]> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  // Get visits with user info and engagement counts
  const { data: visits, error } = await supabase
    .from("visits")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  // Get like counts and user's likes
  const visitIds = visits?.map((v) => v.id) || []
  const [likesData, commentsData, userLikesData] = await Promise.all([
    supabase
      .from("visit_likes")
      .select("visit_id")
      .in("visit_id", visitIds)
      .then((res) => res.data || []),
    supabase
      .from("visit_comments")
      .select("visit_id")
      .in("visit_id", visitIds)
      .then((res) => res.data || []),
    supabase
      .from("visit_likes")
      .select("visit_id")
      .eq("user_id", user.id)
      .in("visit_id", visitIds)
      .then((res) => res.data || []),
  ])

  // Count likes and comments per visit
  const likeCounts = likesData.reduce(
    (acc, like) => {
      acc[like.visit_id] = (acc[like.visit_id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const commentCounts = commentsData.reduce(
    (acc, comment) => {
      acc[comment.visit_id] = (acc[comment.visit_id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const userLikes = new Set(userLikesData.map((like) => like.visit_id))

  return (
    visits?.map((visit) => ({
      id: visit.id,
      userId: visit.user_id,
      userName: visit.profiles?.full_name || "Anonymous Explorer",
      userAvatar: visit.profiles?.avatar_url,
      propertyId: visit.property_id,
      propertyName: visit.property_name,
      county: visit.county,
      propertyType: visit.property_type,
      visitDate: visit.visited_date,
      notes: visit.notes,
      rating: visit.rating,
      photos: visit.photos ? JSON.parse(visit.photos) : undefined,
      highlights: visit.highlights,
      createdAt: visit.created_at,
      likesCount: likeCounts[visit.id] || 0,
      commentsCount: commentCounts[visit.id] || 0,
      isLiked: userLikes.has(visit.id),
    })) || []
  )
}

export const likeVisit = async (visitId: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("visit_likes").upsert(
    {
      visit_id: visitId,
      user_id: user.id,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: "visit_id,user_id",
    },
  )

  if (error) throw error
}

export const unlikeVisit = async (visitId: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("visit_likes").delete().eq("visit_id", visitId).eq("user_id", user.id)

  if (error) throw error
}

export const addComment = async (visitId: string, content: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("visit_comments").insert({
    visit_id: visitId,
    user_id: user.id,
    content,
    created_at: new Date().toISOString(),
  })

  if (error) throw error
}

export const getVisitComments = async (visitId: string): Promise<VisitComment[]> => {
  const supabase = createClient()

  const { data: comments, error } = await supabase
    .from("visit_comments")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `,
    )
    .eq("visit_id", visitId)
    .order("created_at", { ascending: true })

  if (error) throw error

  return (
    comments?.map((comment) => ({
      id: comment.id,
      visitId: comment.visit_id,
      userId: comment.user_id,
      userName: comment.profiles?.full_name || "Anonymous Explorer",
      userAvatar: comment.profiles?.avatar_url,
      content: comment.content,
      createdAt: comment.created_at,
    })) || []
  )
}

export const followUser = async (targetUserId: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("user_follows").upsert(
    {
      follower_id: user.id,
      following_id: targetUserId,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: "follower_id,following_id",
    },
  )

  if (error) throw error
}

export const unfollowUser = async (targetUserId: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)

  if (error) throw error
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const supabase = createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (profileError) throw profileError

  // Get visit count
  const { count: visitCount } = await supabase.from("visits").select("*", { count: "exact" }).eq("user_id", userId)

  // Get achievement count
  const { count: achievementCount } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact" })
    .eq("user_id", userId)

  // Get followers/following counts
  const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
    supabase.from("user_follows").select("*", { count: "exact" }).eq("following_id", userId),
    supabase.from("user_follows").select("*", { count: "exact" }).eq("follower_id", userId),
  ])

  // Check if current user is following this user
  let isFollowing = false
  if (currentUser && currentUser.id !== userId) {
    const { data: followData } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", userId)
      .single()

    isFollowing = !!followData
  }

  return {
    id: profile.id,
    email: profile.email || "",
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    location: profile.location,
    joinedAt: profile.created_at,
    visitCount: visitCount || 0,
    achievementCount: achievementCount || 0,
    followersCount: followersCount || 0,
    followingCount: followingCount || 0,
    isFollowing,
  }
}

export const getLeaderboard = async (limit = 10): Promise<UserProfile[]> => {
  const supabase = createClient()

  // Get users with visit counts
  const { data: users, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      visits:visits(count)
    `,
    )
    .limit(limit)

  if (error) throw error

  // Sort by visit count and return formatted profiles
  return (
    users
      ?.map((user) => ({
        id: user.id,
        email: user.email || "",
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        joinedAt: user.created_at,
        visitCount: user.visits?.[0]?.count || 0,
        achievementCount: 0, // Would need separate query
        followersCount: 0, // Would need separate query
        followingCount: 0, // Would need separate query
      }))
      .sort((a, b) => b.visitCount - a.visitCount) || []
  )
}

export const searchUsers = async (query: string, limit = 10): Promise<UserProfile[]> => {
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(limit)

  if (error) throw error

  return (
    users?.map((user) => ({
      id: user.id,
      email: user.email || "",
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      joinedAt: user.created_at,
      visitCount: 0, // Would need separate query
      achievementCount: 0, // Would need separate query
      followersCount: 0, // Would need separate query
      followingCount: 0, // Would need separate query
    })) || []
  )
}
