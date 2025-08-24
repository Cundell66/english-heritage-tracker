"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialVisitCard } from "@/components/social-visit-card"
import { getSocialFeed, getLeaderboard, searchUsers, type SocialVisit, type UserProfile } from "@/lib/social"
import { ArrowLeft, Users, Search, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [socialFeed, setSocialFeed] = useState<SocialVisit[]>([])
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([])
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard" | "search">("feed")

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    try {
      setIsLoading(true)
      const [feedData, leaderboardData] = await Promise.all([getSocialFeed(20), getLeaderboard(10)])

      setSocialFeed(feedData)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error("Failed to load community data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const results = await searchUsers(searchQuery.trim())
      setSearchResults(results)
    } catch (error) {
      console.error("Failed to search users:", error)
    }
  }

  const handleFeedUpdate = () => {
    loadCommunityData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Community</h1>
            <p className="text-muted-foreground">Loading community activity...</p>
          </div>
        </div>
      </div>
    )
  }

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
              <Users className="h-8 w-8 text-accent" />
              Community
            </h1>
            <p className="text-muted-foreground">Connect with fellow heritage explorers</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "feed" ? "default" : "outline"}
            onClick={() => setActiveTab("feed")}
            className={activeTab === "feed" ? "" : "bg-transparent"}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Activity Feed
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "default" : "outline"}
            onClick={() => setActiveTab("leaderboard")}
            className={activeTab === "leaderboard" ? "" : "bg-transparent"}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setActiveTab("search")}
            className={activeTab === "search" ? "" : "bg-transparent"}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Users
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "feed" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                {socialFeed.length > 0 ? (
                  <div className="space-y-4">
                    {socialFeed.map((visit) => (
                      <SocialVisitCard key={visit.id} visit={visit} onUpdate={handleFeedUpdate} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to share your heritage visits with the community!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "search" && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Search Results</h3>
                    {searchResults.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{user.fullName || "Anonymous Explorer"}</p>
                                <p className="text-sm text-muted-foreground">{user.visitCount} visits</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-accent" />
                  Top Explorers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.fullName || "Anonymous Explorer"}</p>
                          <p className="text-xs text-muted-foreground">{user.visitCount} visits</p>
                        </div>
                      </div>
                    ))}
                    {activeTab !== "leaderboard" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                        onClick={() => setActiveTab("leaderboard")}
                      >
                        View Full Leaderboard
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Visits</span>
                    <span className="font-medium">{socialFeed.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Explorers</span>
                    <span className="font-medium">{leaderboard.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                    <span className="font-medium">{socialFeed.reduce((sum, visit) => sum + visit.likesCount, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="lg:col-span-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Heritage Explorer Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName || "Anonymous Explorer"}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{user.visitCount} visits</p>
                        <p className="text-sm text-muted-foreground">{user.achievementCount} achievements</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
