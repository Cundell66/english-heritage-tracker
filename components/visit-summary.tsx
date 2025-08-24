"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Camera, Clock, ThumbsUp, Calendar } from "lucide-react"
import Image from "next/image"

interface VisitSummaryProps {
  visit: {
    visitDate?: string
    notes?: string
    rating?: number
    photos?: string[]
    visitDuration?: number
    weather?: string
    companions?: string
    highlights?: string
    wouldRecommend?: boolean
  }
  propertyName: string
}

export function VisitSummary({ visit, propertyName }: VisitSummaryProps) {
  const getWeatherEmoji = (weather: string) => {
    const weatherMap: Record<string, string> = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      snowy: "❄️",
      windy: "💨",
      foggy: "🌫️",
    }
    return weatherMap[weather] || "🌤️"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-accent flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Visit to {propertyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visit Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {visit.visitDate && (
            <div>
              <span className="font-medium">Date:</span>
              <p className="text-muted-foreground">{new Date(visit.visitDate).toLocaleDateString()}</p>
            </div>
          )}
          {visit.visitDuration && (
            <div>
              <span className="font-medium">Duration:</span>
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {visit.visitDuration}h
              </p>
            </div>
          )}
          {visit.weather && (
            <div>
              <span className="font-medium">Weather:</span>
              <p className="text-muted-foreground">
                {getWeatherEmoji(visit.weather)} {visit.weather}
              </p>
            </div>
          )}
          {visit.companions && (
            <div>
              <span className="font-medium">With:</span>
              <p className="text-muted-foreground">{visit.companions}</p>
            </div>
          )}
        </div>

        {/* Rating */}
        {visit.rating && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Your Rating:</span>
            {renderStars(visit.rating)}
            <span className="text-sm text-muted-foreground">({visit.rating}/5)</span>
          </div>
        )}

        {/* Recommendation */}
        {visit.wouldRecommend && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        )}

        {/* Photos */}
        {visit.photos && visit.photos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-4 w-4" />
              <span className="font-medium text-sm">Your Photos ({visit.photos.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {visit.photos.slice(0, 6).map((photo, index) => (
                <Image
                  key={index}
                  src={photo || "/placeholder.svg"}
                  alt={`Visit photo ${index + 1}`}
                  width={150}
                  height={100}
                  className="rounded-lg object-cover w-full h-20"
                />
              ))}
              {visit.photos.length > 6 && (
                <div className="bg-muted rounded-lg flex items-center justify-center h-20 text-sm text-muted-foreground">
                  +{visit.photos.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Highlights */}
        {visit.highlights && (
          <div>
            <span className="font-medium text-sm">Highlights:</span>
            <p className="text-sm text-muted-foreground mt-1">{visit.highlights}</p>
          </div>
        )}

        {/* Notes */}
        {visit.notes && (
          <div>
            <span className="font-medium text-sm">Notes:</span>
            <p className="text-sm text-muted-foreground mt-1">{visit.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
