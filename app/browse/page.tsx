"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, MapPin, Calendar, Info, ArrowLeft } from "lucide-react"
import { HERITAGE_PROPERTIES } from "@/lib/heritage-data"
import Link from "next/link"
import Image from "next/image"

export default function BrowsePropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  // Get unique counties and types for filters
  const counties = [...new Set(HERITAGE_PROPERTIES.map((p) => p.county))].sort()
  const types = [...new Set(HERITAGE_PROPERTIES.map((p) => p.type))].sort()

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    return HERITAGE_PROPERTIES.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.county.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCounty = selectedCounty === "all" || property.county === selectedCounty
      const matchesType = selectedType === "all" || property.type === selectedType

      return matchesSearch && matchesCounty && matchesType
    })
  }, [searchTerm, selectedCounty, selectedType])

  const getPropertyImage = (property: any) => {
    if (property.imageUrl) {
      return property.imageUrl
    }
    return `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(property.name + " English Heritage site")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-balance mb-2">English Heritage Properties</h1>
            <p className="text-lg text-muted-foreground text-pretty">Explore England's historic sites and monuments</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties or counties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full sm:w-[200px]">
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

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[200px]">
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
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProperties.length} of {HERITAGE_PROPERTIES.length} properties
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={getPropertyImage(property) || "/placeholder.svg"}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-balance">{property.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.county}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {property.type}
                  </Badge>

                  {property.period && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{property.period}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          More Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-balance">{selectedProperty?.name}</DialogTitle>
                          <DialogDescription>
                            {selectedProperty?.county} • {selectedProperty?.type}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedProperty && (
                          <div className="space-y-4">
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <Image
                                src={getPropertyImage(selectedProperty) || "/placeholder.svg"}
                                alt={selectedProperty.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {selectedProperty.period && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{selectedProperty.period}</span>
                              </div>
                            )}

                            {selectedProperty.description && (
                              <div>
                                <h4 className="font-semibold mb-2">About this site</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {selectedProperty.description}
                                </p>
                              </div>
                            )}

                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-sm text-center text-muted-foreground">
                                <Link href="/login" className="text-primary hover:underline">
                                  Sign in
                                </Link>{" "}
                                to track your visits and add personal notes and photos
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
