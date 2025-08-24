"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Achievement } from "@/lib/achievements"
import { Trophy, X } from "lucide-react"

interface AchievementNotificationProps {
  achievements: Achievement[]
  onDismiss: () => void
}

export function AchievementNotification({ achievements, onDismiss }: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (achievements.length === 0) {
      setIsVisible(false)
      return
    }

    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setIsVisible(false)
        onDismiss()
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [currentIndex, achievements.length, onDismiss])

  if (!isVisible || achievements.length === 0) return null

  const achievement = achievements[currentIndex]

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
      <Card className="w-80 bg-accent/95 border-accent shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent-foreground" />
              <span className="font-semibold text-accent-foreground">Achievement Unlocked!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                onDismiss()
              }}
              className="h-6 w-6 p-0 text-accent-foreground hover:bg-accent-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div>
              <h3 className="font-semibold text-accent-foreground">{achievement.name}</h3>
              <p className="text-sm text-accent-foreground/80">{achievement.description}</p>
              {achievement.reward && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-accent-foreground/70">+{achievement.reward.points} points</span>
                  {achievement.reward.title && (
                    <span className="text-xs text-accent-foreground/70">• "{achievement.reward.title}"</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {achievements.length > 1 && (
            <div className="flex justify-center mt-3">
              <div className="flex gap-1">
                {achievements.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentIndex ? "bg-accent-foreground" : "bg-accent-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
