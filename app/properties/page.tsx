"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HERITAGE_PROPERTIES, type HeritageProperty, type PropertyType } from "@/lib/heritage-data"
import { loadVisitsFromDatabase, updatePropertyVisit, type VisitData } from "@/lib/storage"
import { ArrowLeft, MapPin, Calendar, Check, X, Search, Info } from "lucide-react"
import Link from "next/link"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<HeritageProperty[]>([])
  const [filteredProperties, setFilteredProperties] = useState<HeritageProperty[]>([])
  const [visitData, setVisitData] = useState<VisitData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [visitFilter, setVisitFilter] = useState<string>("all")

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const visits = await loadVisitsFromDatabase()
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">All Properties</h1>
            <p className="text-muted-foreground">
              Browse and track your visits to {HERITAGE_PROPERTIES.length} English Heritage sites
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* County Filter */}
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="All Sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="visited">Visited Only</SelectItem>
                  <SelectItem value="unvisited">Not Visited</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="text-sm">
                  {filteredProperties.length} properties
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={`transition-all hover:shadow-md ${property.visited ? "ring-2 ring-accent/20" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{property.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {property.county}
                    </div>
                    <Badge className={getTypeColor(property.type)} variant="outline">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {property.visited ? (
                      <Badge className="bg-accent text-accent-foreground">
                        <Check className="h-3 w-3 mr-1" />
                        Visited
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <X className="h-3 w-3 mr-1" />
                        Not Visited
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {property.visited && property.visitDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    Visited on {new Date(property.visitDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex gap-2">
                  {property.visited ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitToggle(property.id, false)}
                      className="flex-1"
                    >
                      Mark as Not Visited
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleVisitToggle(property.id, true)}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Mark as Visited
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="px-3 bg-transparent">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-primary">{property.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
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
                            <h3 className="font-semibold text-heritage-blue mb-2">Historical Information</h3>
                            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-semibold text-heritage-blue mb-2">About this Property</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              This {property.type.toLowerCase()} is located in {property.county} and is part of English
                              Heritage's collection of historic sites spanning over 5,000 years of history.
                            </p>
                          </div>
                        )}
                        {property.visited && property.visitDate && (
                          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                            <h3 className="font-semibold text-accent mb-2">Your Visit</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              Visited on {new Date(property.visitDate).toLocaleDateString()}
                            </div>
                            {property.notes && <p className="text-sm text-muted-foreground mt-2">{property.notes}</p>}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground border-t pt-4">
                          Information sourced from Wikipedia and English Heritage records.
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No properties found matching your filters.</p>
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
