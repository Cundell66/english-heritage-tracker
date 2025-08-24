"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type Achievement, getRarityColor } from "@/lib/achievements"
import { Trophy, Lock } from "lucide-react"

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  unlockedAt?: string
}

export function AchievementCard({ achievement, isUnlocked, progress = 0, unlockedAt }: AchievementCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${isUnlocked ? "ring-2 ring-accent/20" : "opacity-75"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl p-2 rounded-lg ${isUnlocked ? "bg-accent/10" : "bg-muted"}`}>
              {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {achievement.name}
                {isUnlocked && <Trophy className="h-4 w-4 text-accent" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
          <Badge className={getRarityColor(achievement.rarity)} variant="outline">
            {achievement.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress Bar */}
          {!isUnlocked && progress > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Unlock Date */}
          {isUnlocked && unlockedAt && (
            <div className="text-xs text-muted-foreground">Unlocked on {new Date(unlockedAt).toLocaleDateString()}</div>
          )}

          {/* Reward Info */}
          {achievement.reward && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reward:</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {achievement.reward.points} pts
                </Badge>
                {achievement.reward.title && (
                  <Badge variant="outline" className="text-xs">
                    "{achievement.reward.title}"
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Category: {achievement.category}</span>
            <span>
              {achievement.requirement.type === "visit_count" && `${achievement.requirement.target} visits`}
              {achievement.requirement.type === "county_count" && `${achievement.requirement.target} counties`}
              {achievement.requirement.type === "type_count" &&
                `${achievement.requirement.target} ${achievement.requirement.details}`}
              {achievement.requirement.type === "rating_average" && `${achievement.requirement.target}+ avg rating`}
              {achievement.requirement.type === "photo_count" && `${achievement.requirement.target} photos`}
              {achievement.requirement.type === "special" && "Special requirement"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
