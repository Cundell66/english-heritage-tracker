"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HERITAGE_PROPERTIES, getPropertiesByType, type HeritageProperty } from "@/lib/heritage-data"
import { loadVisitData, type VisitData } from "@/lib/storage"
import { Castle, Church, Home, MapPin, Trophy } from "lucide-react"

export default function HomePage() {
  const [visitData, setVisitData] = useState<VisitData[]>([])
  const [properties, setProperties] = useState<HeritageProperty[]>([])

  useEffect(() => {
    const visits = loadVisitData()
    setVisitData(visits)

    // Merge visit data with properties
    const updatedProperties = HERITAGE_PROPERTIES.map((property) => {
      const visit = visits.find((v) => v.propertyId === property.id)
      return {
        ...property,
        visited: visit?.visited || false,
        visitDate: visit?.visitDate,
        notes: visit?.notes,
      }
    })
    setProperties(updatedProperties)
  }, [])

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">English Heritage Tracker</h1>
          <p className="text-muted-foreground">Track your visits to England's historic sites</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {visitedCount} / {totalCount}
                </span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {progressPercentage.toFixed(1)}% Complete
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've visited {visitedCount} English Heritage properties out of {totalCount} total sites.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Property Types Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typeStats.map(({ type, total, visited }) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(type)}
                    <div>
                      <p className="font-medium">{type}</p>
                      <p className="text-sm text-muted-foreground">
                        {visited} / {total} visited
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{total > 0 ? Math.round((visited / total) * 100) : 0}%</div>
                    <Progress value={total > 0 ? (visited / total) * 100 : 0} className="h-2 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button size="lg" className="h-16 text-lg" onClick={() => (window.location.href = "/properties")}>
            <MapPin className="h-5 w-5 mr-2" />
            Browse All Properties
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-lg bg-transparent"
            onClick={() => (window.location.href = "/visited")}
          >
            <Trophy className="h-5 w-5 mr-2" />
            View Visited Sites
          </Button>
        </div>
      </div>
    </div>
  )
}
