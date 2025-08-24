"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HERITAGE_PROPERTIES, getPropertiesByType, type HeritageProperty } from "@/lib/heritage-data"
import { loadVisitsFromDatabase, getVisitStats, type VisitData } from "@/lib/storage"
import { getUserAchievements, ACHIEVEMENTS, checkAchievements, type Achievement } from "@/lib/achievements"
import { AchievementNotification } from "@/components/achievement-notification"
import { createClient } from "@/lib/supabase/client"
import {
  Castle,
  Church,
  Home,
  MapPin,
  Trophy,
  User,
  Calendar,
  Camera,
  Star,
  TrendingUp,
  Award,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export default function HomePage() {
  const [visitData, setVisitData] = useState<VisitData[]>([])
  const [properties, setProperties] = useState<HeritageProperty[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [visitStats, setVisitStats] = useState<any>(null)
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load user profile
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at || "",
        })
      }

      // Load visits and stats
      const visits = await loadVisitsFromDatabase()
      setVisitData(visits)

      const stats = await getVisitStats()
      setVisitStats(stats)

      // Merge visit data with properties
      const updatedProperties = HERITAGE_PROPERTIES.map((property) => {
        const visit = visits.find((v) => v.propertyId === property.id)
        return {
          ...property,
          visited: visit?.visited || false,
          visitDate: visit?.visitDate,
          notes: visit?.notes,
          rating: visit?.rating,
          photos: visit?.photos,
        }
      })
      setProperties(updatedProperties)

      // Load recent achievements
      const userAchievements = await getUserAchievements()
      const recent = userAchievements
        .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
        .slice(0, 3)
        .map((ua) => ACHIEVEMENTS.find((a) => a.id === ua.achievementId))
        .filter(Boolean) as Achievement[]

      setRecentAchievements(recent)

      // Check for new achievements
      const newAchs = await checkAchievements()
      if (newAchs.length > 0) {
        setNewAchievements(newAchs)
      }
    } catch (error) {
      console.error("[v0] Failed to load dashboard data:", error)
      // Fallback to empty state if database fails
      setVisitData([])
      setProperties(HERITAGE_PROPERTIES.map((p) => ({ ...p, visited: false })))
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">English Heritage Tracker</h1>
            <p className="text-muted-foreground">Loading your heritage journey...</p>
          </div>
        </div>
      </div>
    )
  }

  const visitedCount = visitData.filter((v) => v.visited).length
  const totalCount = HERITAGE_PROPERTIES.length
  const progressPercentage = (visitedCount / totalCount) * 100

  const propertiesByType = getPropertiesByType()
  const typeStats = Object.entries(propertiesByType)
    .map(([type, props]) => ({
      type,
      total: props.length,
      visited: props.filter((p) => {
        const visit = visitData.find((v) => v.propertyId === p.id)
        return visit?.visited || false
      }).length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  const getTypeIcon = (type: string) => {
    if (type.includes("Castle")) return <Castle className="h-4 w-4" />
    if (type.includes("Church") || type.includes("Abbey") || type.includes("Priory"))
      return <Church className="h-4 w-4" />
    return <Home className="h-4 w-4" />
  }

  // Get recent visits
  const recentVisits = properties
    .filter((p) => p.visited && p.visitDate)
    .sort((a, b) => new Date(b.visitDate!).getTime() - new Date(a.visitDate!).getTime())
    .slice(0, 3)

  // Get visit streak (consecutive days with visits)
  const getVisitStreak = () => {
    const visitDates = visitData
      .filter((v) => v.visited && v.visitDate)
      .map((v) => v.visitDate!)
      .sort()

    if (visitDates.length === 0) return 0

    let streak = 1
    for (let i = 1; i < visitDates.length; i++) {
      const current = new Date(visitDates[i])
      const previous = new Date(visitDates[i - 1])
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else if (diffDays > 1) {
        streak = 1
      }
    }
    return streak
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Achievement Notifications */}
      {newAchievements.length > 0 && (
        <AchievementNotification achievements={newAchievements} onDismiss={() => setNewAchievements([])} />
      )}

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header with User Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Welcome back{userProfile?.full_name ? `, ${userProfile.full_name}` : ""}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Continue your heritage exploration journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/achievements">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Sites Visited</span>
              </div>
              <div className="text-2xl font-bold text-primary">{visitedCount}</div>
              <p className="text-xs text-muted-foreground">of {totalCount} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {visitStats?.averageRating ? visitStats.averageRating.toFixed(1) : "0.0"}
              </div>
              <p className="text-xs text-muted-foreground">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Photos</span>
              </div>
              <div className="text-2xl font-bold text-primary">{visitStats?.totalPhotos || 0}</div>
              <p className="text-xs text-muted-foreground">uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold text-primary">{getVisitStreak()}</div>
              <p className="text-xs text-muted-foreground">day streak</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Progress Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Trophy className="h-5 w-5 text-accent" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    {visitedCount} / {totalCount}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs sm:text-sm">
                    {progressPercentage.toFixed(1)}% Complete
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  You've visited {visitedCount} English Heritage properties.
                  {visitedCount < totalCount && ` ${totalCount - visitedCount} more to go!`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-accent" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-accent/10">
                      <div className="text-lg">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/achievements">
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      View All Achievements
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No achievements yet</p>
                  <p className="text-xs text-muted-foreground">Start visiting sites to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Property Types Overview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-5 w-5 text-primary" />
                Property Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {typeStats.map(({ type, total, visited }) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(type)}
                      <div>
                        <p className="font-medium text-sm">{type}</p>
                        <p className="text-xs text-muted-foreground">
                          {visited} / {total} visited
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{total > 0 ? Math.round((visited / total) * 100) : 0}%</div>
                      <Progress value={total > 0 ? (visited / total) * 100 : 0} className="h-2 w-16 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visits */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-secondary" />
                Recent Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentVisits.length > 0 ? (
                <div className="space-y-3">
                  {recentVisits.map((property) => (
                    <div key={property.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={property.imageUrl || "/placeholder.svg"}
                          alt={property.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{property.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{property.county}</span>
                          <Calendar className="h-3 w-3 ml-1" />
                          <span>{new Date(property.visitDate!).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {property.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{property.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <Link href="/visited">
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      View All Visits
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No visits yet</p>
                  <p className="text-xs text-muted-foreground">Start exploring to see your recent visits here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Button
            size="lg"
            className="h-14 sm:h-16 text-base sm:text-lg"
            onClick={() => (window.location.href = "/properties")}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Discover Sites
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 sm:h-16 text-base sm:text-lg bg-transparent"
            onClick={() => (window.location.href = "/visited")}
          >
            <Trophy className="h-5 w-5 mr-2" />
            My Visits
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 sm:h-16 text-base sm:text-lg bg-transparent"
            onClick={() => (window.location.href = "/achievements")}
          >
            <Award className="h-5 w-5 mr-2" />
            Achievements
          </Button>
        </div>
      </div>
    </div>
  )
}
