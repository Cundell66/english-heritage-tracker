"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HERITAGE_PROPERTIES, type HeritageProperty } from "@/lib/heritage-data"
import { loadVisitsFromDatabase, type VisitData } from "@/lib/storage"
import { ArrowLeft, MapPin, Calendar, Trophy, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { VisitLogger } from "@/components/visit-logger"

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

  const getPropertyImage = (property: HeritageProperty) => {
    if (property.imageUrl) {
      return property.imageUrl
    }

    // Return type-based placeholder images
    const typeImageMap: Record<string, string> = {
      Castle: "/placeholder.svg?height=200&width=300&text=Castle",
      Abbey: "/abbey-ruins-gothic-arches-monastery.png",
      Priory: "/priory-ruins.png",
      Church: "/historic-stone-church.png",
      "Roman fort": "/roman-fort-walls.png",
      "Roman villa": "/roman-villa-ruins-mosaic.png",
      "Country House": "/historic-mansion-estate.png",
      Palace: "/historic-royal-palace.png",
      "Manor house": "/historic-manor-estate.png",
      "Megalithic tomb": "/ancient-megalithic-chamber.png",
      "Stone circle": "/placeholder.svg?height=200&width=300&text=Stone+Circle",
      Henge: "/ancient-henge-earthwork.png",
      Hillfort: "/iron-age-hillfort.png",
      "Device Fort": "/tudor-coastal-fort.png",
      Tower: "/historic-stone-tower.png",
      Bridge: "/placeholder.svg?height=200&width=300&text=Historic+Bridge",
      Village: "/placeholder.svg?height=200&width=300&text=Ancient+Village",
      Amphitheatre: "/placeholder.svg?height=200&width=300&text=Roman+Amphitheatre",
      Wall: "/placeholder.svg?height=200&width=300&text=Ancient+Wall",
      Gatehouse: "/placeholder.svg?height=200&width=300&text=Medieval+Gatehouse",
    }

    return typeImageMap[property.type] || "/placeholder.svg?height=200&width=300&text=Heritage+Site"
  }

  const handleVisitUpdate = async () => {
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
      console.error("[v0] Failed to refresh visits:", error)
    }
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
            {visitedProperties.map((property) => {
              const visitInfo = visitData.find((v) => v.propertyId === property.id)

              return (
                <Card key={property.id} className="ring-2 ring-accent/20 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 sm:h-32 sm:w-48 flex-shrink-0 overflow-hidden">
                      <Image
                        src={getPropertyImage(property) || "/placeholder.svg"}
                        alt={property.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>

                    <div className="flex-1">
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getTypeColor(property.type)} variant="outline">
                                {property.type}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="px-3 h-8 bg-transparent">
                                    <Info className="h-3 w-3 mr-1" />
                                    More Info
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl font-bold text-primary pr-8">
                                      {property.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                                      <Image
                                        src={getPropertyImage(property) || "/placeholder.svg"}
                                        alt={property.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 600px"
                                      />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {property.county}
                                      </div>
                                      <Badge className={getTypeColor(property.type)} variant="outline">
                                        {property.type}
                                      </Badge>
                                    </div>
                                    {property.description ? (
                                      <div>
                                        <h3 className="font-semibold text-primary mb-2">Historical Information</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                          {property.description}
                                        </p>
                                      </div>
                                    ) : (
                                      <div>
                                        <h3 className="font-semibold text-primary mb-2">About this Property</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                          This {property.type.toLowerCase()} is located in {property.county} and is part
                                          of English Heritage's collection of historic sites spanning over 5,000 years
                                          of history.
                                        </p>
                                      </div>
                                    )}
                                    {visitInfo && (
                                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                                        <h3 className="font-semibold text-accent mb-3">Your Visit Details</h3>

                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            Visited on{" "}
                                            {visitInfo.visitDate
                                              ? new Date(visitInfo.visitDate).toLocaleDateString()
                                              : "Unknown date"}
                                          </div>

                                          {visitInfo.rating && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium">Rating:</span>
                                              <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <span
                                                    key={star}
                                                    className={`text-lg ${
                                                      star <= visitInfo.rating! ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                                  >
                                                    ★
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {visitInfo.visit_duration && (
                                            <div className="text-sm">
                                              <span className="font-medium">Duration:</span> {visitInfo.visit_duration}{" "}
                                              minutes
                                            </div>
                                          )}

                                          {visitInfo.weather && (
                                            <div className="text-sm">
                                              <span className="font-medium">Weather:</span> {visitInfo.weather}
                                            </div>
                                          )}

                                          {visitInfo.companions &&
                                            Array.isArray(visitInfo.companions) &&
                                            visitInfo.companions.length > 0 && (
                                              <div className="text-sm">
                                                <span className="font-medium">Companions:</span>{" "}
                                                {visitInfo.companions.join(", ")}
                                              </div>
                                            )}

                                          {visitInfo.photos &&
                                            Array.isArray(visitInfo.photos) &&
                                            visitInfo.photos.length > 0 && (
                                              <div>
                                                <p className="text-sm font-medium mb-2">
                                                  Photos ({visitInfo.photos.length}):
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                  {visitInfo.photos.map((photo, index) => (
                                                    <div key={index} className="relative h-20 rounded overflow-hidden">
                                                      <Image
                                                        src={photo || "/placeholder.svg"}
                                                        alt={`Visit photo ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                          {visitInfo.highlights &&
                                            Array.isArray(visitInfo.highlights) &&
                                            visitInfo.highlights.length > 0 && (
                                              <div>
                                                <p className="text-sm font-medium mb-1">Highlights:</p>
                                                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                                  {visitInfo.highlights.map((highlight, index) => (
                                                    <li key={index}>{highlight}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                          {visitInfo.notes && (
                                            <div>
                                              <p className="text-sm font-medium mb-1">Notes:</p>
                                              <p className="text-sm text-muted-foreground">{visitInfo.notes}</p>
                                            </div>
                                          )}

                                          {visitInfo.recommendations && (
                                            <div>
                                              <p className="text-sm font-medium mb-1">Recommendations:</p>
                                              <p className="text-sm text-muted-foreground">
                                                {visitInfo.recommendations}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <div className="text-xs text-muted-foreground border-t pt-4">
                                      Information sourced from Wikipedia and English Heritage records.
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <VisitLogger
                                propertyId={property.id}
                                propertyName={property.name}
                                county={property.county}
                                propertyType={property.type}
                                currentVisit={visitInfo}
                                onVisitUpdate={handleVisitUpdate}
                              />
                            </div>
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
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
