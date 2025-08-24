"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AchievementCard } from "@/components/achievement-card"
import { ACHIEVEMENTS, getUserAchievements, getAchievementProgress, type UserAchievement } from "@/lib/achievements"
import { ArrowLeft, Trophy, Target, Award } from "lucide-react"
import Link from "next/link"

export default function AchievementsPage() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({})
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const userAchs = await getUserAchievements()
      setUserAchievements(userAchs)

      // Load progress for locked achievements
      const progressData: Record<string, number> = {}
      const lockedAchievements = ACHIEVEMENTS.filter((a) => !userAchs.some((ua) => ua.achievementId === a.id))

      for (const achievement of lockedAchievements) {
        const progress = await getAchievementProgress(achievement.id)
        progressData[achievement.id] = progress
      }

      setAchievementProgress(progressData)
    } catch (error) {
      console.error("Failed to load achievements:", error)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Achievements</h1>
            <p className="text-muted-foreground">Loading your achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => userAchievements.some((ua) => ua.achievementId === a.id))
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !userAchievements.some((ua) => ua.achievementId === a.id))

  // Filter achievements
  let filteredAchievements = ACHIEVEMENTS
  if (filterCategory !== "all") {
    filteredAchievements = filteredAchievements.filter((a) => a.category === filterCategory)
  }
  if (filterStatus === "unlocked") {
    filteredAchievements = filteredAchievements.filter((a) => userAchievements.some((ua) => ua.achievementId === a.id))
  } else if (filterStatus === "locked") {
    filteredAchievements = filteredAchievements.filter((a) => !userAchievements.some((ua) => ua.achievementId === a.id))
  }

  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + (a.reward?.points || 0), 0)
  const categories = Array.from(new Set(ACHIEVEMENTS.map((a) => a.category)))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Trophy className="h-8 w-8 text-accent" />
              Achievements
            </h1>
            <p className="text-muted-foreground">Track your heritage exploration milestones</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {unlockedAchievements.length} / {ACHIEVEMENTS.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <p className="text-sm text-muted-foreground">Achievement points earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rarity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {["legendary", "epic", "rare", "common"].map((rarity) => {
                  const count = unlockedAchievements.filter((a) => a.rarity === rarity).length
                  return (
                    <Badge key={rarity} variant="outline" className="text-xs">
                      {count} {rarity}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Achievements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Achievements</SelectItem>
                  <SelectItem value="unlocked">Unlocked Only</SelectItem>
                  <SelectItem value="locked">Locked Only</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center">
                <Badge variant="outline">{filteredAchievements.length} achievements</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id)
            const isUnlocked = !!userAchievement
            const progress = achievementProgress[achievement.id] || 0

            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked}
                progress={progress}
                unlockedAt={userAchievement?.unlockedAt}
              />
            )
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No achievements found</h2>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to see more achievements.</p>
            <Button
              variant="outline"
              onClick={() => {
                setFilterCategory("all")
                setFilterStatus("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
