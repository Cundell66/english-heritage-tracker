"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HERITAGE_PROPERTIES, type HeritageProperty } from "@/lib/heritage-data"
import { loadVisitsFromDatabase, type VisitData } from "@/lib/storage"
import { ArrowLeft, MapPin, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

export default function VisitedPage() {
  const [visitedProperties, setVisitedProperties] = useState<HeritageProperty[]>([])
  const [visitData, setVisitData] = useState<VisitData[]>([])

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const visits = await loadVisitsFromDatabase()
        setVisitData(visits)

        // Get only visited properties with their visit data
        const visited = HERITAGE_PROPERTIES.filter((property) => {
          const visit = visits.find((v) => v.propertyId === property.id)
          return visit?.visited
        }).map((property) => {
          const visit = visits.find((v) => v.propertyId === property.id)
          return {
            ...property,
            visited: true,
            visitDate: visit?.visitDate,
            notes: visit?.notes,
          }
        })

        // Sort by visit date (most recent first)
        visited.sort((a, b) => {
          if (!a.visitDate && !b.visitDate) return 0
          if (!a.visitDate) return 1
          if (!b.visitDate) return -1
          return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        })

        setVisitedProperties(visited)
      } catch (error) {
        console.error("[v0] Failed to load visits:", error)
        // Fallback to empty array if database fails
        setVisitData([])
        setVisitedProperties([])
      }
    }

    loadVisits()
  }, [])

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      Castle: "bg-primary/10 text-primary border-primary/20",
      Abbey: "bg-accent/10 text-accent border-accent/20",
      Priory: "bg-accent/10 text-accent border-accent/20",
      Church: "bg-accent/10 text-accent border-accent/20",
      "Roman fort": "bg-secondary/10 text-secondary border-secondary/20",
      "Roman villa": "bg-secondary/10 text-secondary border-secondary/20",
      "Country House": "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    }
    return colorMap[type] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Trophy className="h-8 w-8 text-accent" />
              Visited Properties
            </h1>
            <p className="text-muted-foreground">You've visited {visitedProperties.length} English Heritage sites</p>
          </div>
        </div>

        {visitedProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No visits recorded yet</h2>
              <p className="text-muted-foreground mb-4">
                Start exploring English Heritage sites and mark them as visited to see them here.
              </p>
              <Link href="/properties">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {visitedProperties.map((property) => (
              <Card key={property.id} className="ring-2 ring-accent/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{property.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {property.county}
                        </div>
                        {property.visitDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Visited {new Date(property.visitDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Badge className={getTypeColor(property.type)} variant="outline">
                        {property.type}
                      </Badge>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">Visited</Badge>
                  </div>
                </CardHeader>
                {property.notes && (
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">Your Notes:</p>
                      <p className="text-sm text-muted-foreground">{property.notes}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
