"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { AvatarSelector } from "@/components/avatar-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const AVATAR_OPTIONS = [
  { id: "king", name: "King", emoji: "👑" },
  { id: "queen", name: "Queen", emoji: "👸" },
  { id: "knight", name: "Knight", emoji: "⚔️" },
  { id: "lady", name: "Lady", emoji: "👩‍🎨" },
  { id: "neanderthal", name: "Neanderthal", emoji: "🦴" },
  { id: "roman", name: "Roman", emoji: "🏛️" },
  { id: "viking", name: "Viking", emoji: "⚡" },
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedAvatar, setSelectedAvatar] = useState("king")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const client = createBrowserClient()
      setSupabase(client)
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      router.push("/auth/login")
    }
  }, [router])

  useEffect(() => {
    if (supabase) {
      loadUserProfile()
    }
  }, [supabase])

  const loadUserProfile = async () => {
    if (!supabase) return

    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Get or create user profile
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading profile:", error)
        return
      }

      if (profile) {
        setUserProfile(profile)
        setSelectedAvatar(profile.avatar_type || "king")
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Heritage Explorer",
              avatar_type: "king",
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
        } else {
          setUserProfile(newProfile)
          setSelectedAvatar("king")
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId)
  }

  const handleSaveAvatar = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_type: selectedAvatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating avatar:", error)
        alert("Failed to save avatar. Please try again.")
      } else {
        alert("Avatar saved successfully!")
        // Update local state
        setUserProfile({ ...userProfile, avatar_type: selectedAvatar })
      }
    } catch (error) {
      console.error("Error saving avatar:", error)
      alert("Failed to save avatar. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const getCurrentAvatarEmoji = () => {
    const avatar = AVATAR_OPTIONS.find((a) => a.id === (userProfile?.avatar_type || "king"))
    return avatar?.emoji || "👑"
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Current Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`/placeholder-icon.png?height=64&width=64&text=${getCurrentAvatarEmoji()}`}
                  alt="Current avatar"
                />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{userProfile?.full_name || "Heritage Explorer"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Avatar: {AVATAR_OPTIONS.find((a) => a.id === (userProfile?.avatar_type || "king"))?.name || "King"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Selection */}
        <div>
          <AvatarSelector
            currentAvatar={userProfile?.avatar_type || "king"}
            onSelect={handleAvatarSelect}
            onSave={handleSaveAvatar}
            isLoading={isSaving}
          />
        </div>
      </div>
    </div>
  )
}
