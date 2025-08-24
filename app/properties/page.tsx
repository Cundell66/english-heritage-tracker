"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HERITAGE_PROPERTIES, type HeritageProperty, type PropertyType } from "@/lib/heritage-data"
import { loadVisitsFromDatabase, updatePropertyVisit, type VisitData } from "@/lib/storage"
import { ArrowLeft, MapPin, Calendar, Check, X, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<HeritageProperty[]>([])
  const [filteredProperties, setFilteredProperties] = useState<HeritageProperty[]>([])
  const [visitData, setVisitData] = useState<VisitData[]>([])
  const [fullVisitData, setFullVisitData] = useState<Map<string, VisitData>>(new Map())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [visitFilter, setVisitFilter] = useState<string>("all")

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const visits = await loadVisitsFromDatabase()
        setVisitData(visits)

        const visitMap = new Map<string, VisitData>()
        visits.forEach((visit) => {
          if (visit.propertyId) {
            visitMap.set(visit.propertyId, visit)
          }
        })
        setFullVisitData(visitMap)

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
        setFilteredProperties(updatedProperties)
      } catch (error) {
        console.error("Failed to load visits:", error)
        // Fallback to empty state if database fails
        setProperties(HERITAGE_PROPERTIES.map((p) => ({ ...p, visited: false })))
        setFilteredProperties(HERITAGE_PROPERTIES.map((p) => ({ ...p, visited: false })))
      }
    }

    loadVisits()
  }, [])

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.county.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // County filter
    if (selectedCounty !== "all") {
      filtered = filtered.filter((property) => property.county === selectedCounty)
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((property) => property.type === selectedType)
    }

    // Visit status filter
    if (visitFilter === "visited") {
      filtered = filtered.filter((property) => property.visited)
    } else if (visitFilter === "unvisited") {
      filtered = filtered.filter((property) => !property.visited)
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, selectedCounty, selectedType, visitFilter])

  const handleVisitToggle = async (propertyId: string, visited: boolean) => {
    console.log("[v0] Visit toggle clicked:", { propertyId, visited })

    const property = properties.find((p) => p.id === propertyId)
    if (!property) {
      console.log("[v0] Property not found:", propertyId)
      return
    }

    const visitDate = visited ? new Date().toISOString().split("T")[0] : undefined
    console.log("[v0] Attempting to update visit:", {
      propertyId,
      name: property.name,
      county: property.county,
      type: property.type,
      visited,
      visitDate,
    })

    try {
      const updatedVisitData = await updatePropertyVisit(
        propertyId,
        property.name,
        property.county,
        property.type,
        visited,
        visitDate,
      )
      console.log("[v0] Database update successful")

      setVisitData(updatedVisitData)

      // Merge fresh visit data with properties
      const updatedProperties = HERITAGE_PROPERTIES.map((prop) => {
        const visit = updatedVisitData.find((v) => v.propertyId === prop.id)
        return {
          ...prop,
          visited: visit?.visited || false,
          visitDate: visit?.visitDate,
          notes: visit?.notes,
        }
      })
      setProperties(updatedProperties)
      console.log("[v0] Local state updated with fresh database data")
    } catch (error) {
      console.error("[v0] Full error object:", error)
      console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
      console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`Failed to update visit status: ${errorMessage}. Please check the console for more details.`)
    }
  }

  const counties = Array.from(new Set(HERITAGE_PROPERTIES.map((p) => p.county))).sort()
  const types = Array.from(new Set(HERITAGE_PROPERTIES.map((p) => p.type))).sort()

  const getTypeColor = (type: PropertyType) => {
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
      Castle: "/placeholder-qspyo.png",
      Abbey: "/abbey-ruins-gothic-arches-monastery.png",
      Priory: "/priory-ruins.png",
      Church: "/historic-stone-church.png",
      "Roman fort": "/roman-fort-walls.png",
      "Roman villa": "/roman-villa-ruins-mosaic.png",
      "Country House": "/historic-mansion-estate.png",
      Palace: "/historic-royal-palace.png",
      "Manor house": "/historic-manor-estate.png",
      "Megalithic tomb": "/ancient-megalithic-chamber.png",
      "Stone circle": "/placeholder-awr8t.png",
      Henge: "/ancient-henge-earthwork.png",
      Hillfort: "/iron-age-hillfort.png",
      "Device Fort": "/tudor-coastal-fort.png",
      Tower: "/historic-stone-tower.png",
      Bridge: "/placeholder.svg?height=200&width=300",
      Village: "/placeholder.svg?height=200&width=300",
      Amphitheatre: "/placeholder.svg?height=200&width=300",
      Wall: "/placeholder.svg?height=200&width=300",
      Gatehouse: "/placeholder.svg?height=200&width=300",
    }

    return typeImageMap[property.type] || "/placeholder.svg?height=200&width=300"
  }

  const getVisitDetails = (propertyId: string): VisitData | null => {
    return fullVisitData.get(propertyId) || null
  }

  const renderStarRating = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-sm ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}>
            ★
          </span>
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">All Properties</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Browse and track your visits to {HERITAGE_PROPERTIES.length} English Heritage sites
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-9"
                />
              </div>

              {/* County Filter */}
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger className="h-10 sm:h-9">
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-10 sm:h-9">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Visit Status Filter */}
              <Select value={visitFilter} onValueChange={setVisitFilter}>
                <SelectTrigger className="h-10 sm:h-9">
                  <SelectValue placeholder="All Sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="visited">Visited Only</SelectItem>
                  <SelectItem value="unvisited">Not Visited</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {filteredProperties.length} properties
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={`transition-all hover:shadow-md overflow-hidden ${property.visited ? "ring-2 ring-accent/20" : ""}`}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={getPropertyImage(property) || "/placeholder.svg"}
                  alt={property.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg leading-tight mb-2 pr-2">{property.name}</CardTitle>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{property.county}</span>
                    </div>
                    <Badge className={`${getTypeColor(property.type)} text-xs`} variant="outline">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {property.visited ? (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Visited
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs">
                        <X className="h-3 w-3 mr-1" />
                        Not Visited
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {property.visited ? (
                  // Visited property - show visit details
                  (() => {
                    const visitDetails = getVisitDetails(property.id)
                    return (
                      <>
                        {/* Historical information for visited properties */}
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
                              This {property.type.toLowerCase()} is located in {property.county} and is part of English
                              Heritage's collection of historic sites spanning over 5,000 years of history.
                            </p>
                          </div>
                        )}

                        {/* Visit details section */}
                        {visitDetails ? (
                          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 space-y-4">
                            <h3 className="font-semibold text-accent mb-2">Your Visit</h3>

                            {/* Basic visit info */}
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              Visited on {new Date(visitDetails.visitDate || "").toLocaleDateString()}
                            </div>

                            {/* Rating */}
                            {visitDetails.rating && (
                              <div>
                                <p className="text-sm font-medium mb-1">Your Rating:</p>
                                {renderStarRating(visitDetails.rating)}
                              </div>
                            )}

                            {/* Photos */}
                            {visitDetails.photos &&
                              Array.isArray(visitDetails.photos) &&
                              visitDetails.photos.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Your Photos:</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {visitDetails.photos.map((photo, index) => (
                                      <div key={index} className="relative h-20 w-full overflow-hidden rounded-md">
                                        <Image
                                          src={photo || "/placeholder.svg"}
                                          alt={`Visit photo ${index + 1}`}
                                          fill
                                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                                          sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Visit notes */}
                            {visitDetails.notes && (
                              <div>
                                <p className="text-sm font-medium mb-1">Your Notes:</p>
                                <p className="text-sm text-muted-foreground">{visitDetails.notes}</p>
                              </div>
                            )}

                            {/* Additional visit details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              {visitDetails.weather && (
                                <div>
                                  <span className="font-medium">Weather:</span> {visitDetails.weather}
                                </div>
                              )}
                              {visitDetails.visit_duration && (
                                <div>
                                  <span className="font-medium">Duration:</span> {visitDetails.visit_duration} minutes
                                </div>
                              )}
                              {visitDetails.companions && (
                                <div className="sm:col-span-2">
                                  <span className="font-medium">Companions:</span> {visitDetails.companions}
                                </div>
                              )}
                            </div>

                            {/* Highlights */}
                            {visitDetails.highlights &&
                              Array.isArray(visitDetails.highlights) &&
                              visitDetails.highlights.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium mb-1">Highlights:</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                    {visitDetails.highlights.map((highlight, index) => (
                                      <li key={index}>{highlight}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* Recommendations */}
                            {visitDetails.recommendations && (
                              <div>
                                <p className="text-sm font-medium mb-1">Your Recommendations:</p>
                                <p className="text-sm text-muted-foreground">{visitDetails.recommendations}</p>
                              </div>
                            )}
                          </div>
                        ) : property.visitDate ? (
                          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                            <h3 className="font-semibold text-accent mb-2">Your Visit</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              Visited on {new Date(property.visitDate).toLocaleDateString()}
                            </div>
                            {property.notes && <p className="text-sm text-muted-foreground mt-2">{property.notes}</p>}
                          </div>
                        ) : null}
                      </>
                    )
                  })()
                ) : (
                  // Unvisited property - show only historical information
                  <>
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
                          This {property.type.toLowerCase()} is located in {property.county} and is part of English
                          Heritage's collection of historic sites spanning over 5,000 years of history.
                        </p>
                      </div>
                    )}

                    {property.notes && (
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Additional Notes</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{property.notes}</p>
                      </div>
                    )}

                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground text-center">
                        Mark this property as visited to add photos, ratings, and personal notes about your experience.
                      </p>
                    </div>
                  </>
                )}

                <div className="text-xs text-muted-foreground border-t pt-4">
                  Information sourced from Wikipedia and English Heritage records.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base sm:text-lg">No properties found matching your filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCounty("all")
                setSelectedType("all")
                setVisitFilter("all")
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
