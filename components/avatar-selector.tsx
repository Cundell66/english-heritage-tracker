"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Check } from "lucide-react"

const AVATAR_OPTIONS = [
  { id: "king", name: "King", emoji: "👑", description: "Royal ruler of the realm" },
  { id: "queen", name: "Queen", emoji: "👸", description: "Sovereign monarch" },
  { id: "knight", name: "Knight", emoji: "⚔️", description: "Noble warrior" },
  { id: "lady", name: "Lady", emoji: "👩‍🎨", description: "Elegant noblewoman" },
  { id: "neanderthal", name: "Neanderthal", emoji: "🦴", description: "Ancient ancestor" },
  { id: "roman", name: "Roman", emoji: "🏛️", description: "Empire citizen" },
  { id: "viking", name: "Viking", emoji: "⚡", description: "Norse explorer" },
]

interface AvatarSelectorProps {
  currentAvatar?: string
  onSelect: (avatarId: string) => void
  onSave: () => void
  isLoading?: boolean
}

export function AvatarSelector({ currentAvatar, onSelect, onSave, isLoading }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "king")

  const handleSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId)
    onSelect(avatarId)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">Choose Your Historical Avatar</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Select an avatar that represents your heritage exploration journey
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:shadow-md ${
                selectedAvatar === avatar.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleSelect(avatar.id)}
            >
              {selectedAvatar === avatar.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <Avatar className="h-16 w-16 mx-auto mb-2">
                <AvatarImage
                  src={`/placeholder-icon.png?height=64&width=64&text=${avatar.emoji}`}
                  alt={avatar.name}
                />
                <AvatarFallback className="text-2xl">{avatar.emoji}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm">{avatar.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{avatar.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={onSave} disabled={isLoading} className="min-w-32">
            {isLoading ? "Saving..." : "Save Avatar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
