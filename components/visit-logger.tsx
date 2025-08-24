"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePropertyVisit, uploadVisitPhoto, deleteVisitPhoto } from "@/lib/storage"
import { Star, ThumbsUp, X, Upload } from "lucide-react"
import Image from "next/image"

interface VisitLoggerProps {
  propertyId: string
  propertyName: string
  county: string
  propertyType: string
  currentVisit?: {
    visited: boolean
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
  onVisitUpdate: () => void
}

export function VisitLogger({
  propertyId,
  propertyName,
  county,
  propertyType,
  currentVisit,
  onVisitUpdate,
}: VisitLoggerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [visitDate, setVisitDate] = useState(currentVisit?.visitDate || new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState(currentVisit?.notes || "")
  const [rating, setRating] = useState(currentVisit?.rating || null)
  const [photos, setPhotos] = useState<string[]>(currentVisit?.photos || [])
  const [visitDuration, setVisitDuration] = useState(currentVisit?.visitDuration || 0)
  const [weather, setWeather] = useState(currentVisit?.weather || "")
  const [companions, setCompanions] = useState(currentVisit?.companions || "")
  const [highlights, setHighlights] = useState(currentVisit?.highlights || "")
  const [wouldRecommend, setWouldRecommend] = useState(currentVisit?.wouldRecommend || false)

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const maxFileSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported image format. Please use JPEG, PNG, or WebP.`)
        return
      }
    }

    setIsLoading(true)
    try {
      console.log("[v0] Starting photo upload for", files.length, "files")
      const uploadPromises = Array.from(files).map((file) => uploadVisitPhoto(file, propertyId))
      const uploadedUrls = await Promise.all(uploadPromises)
      setPhotos((prev) => [...prev, ...uploadedUrls])
      console.log("[v0] Successfully uploaded", uploadedUrls.length, "photos")

      event.target.value = ""
    } catch (error) {
      console.error("[v0] Failed to upload photos:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      if (errorMessage.includes("Photo storage is not configured")) {
        alert("Photo storage is not set up yet. Please run the photo storage setup script first.")
      } else {
        alert(`Failed to upload photos: ${errorMessage}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoDelete = async (photoUrl: string) => {
    try {
      await deleteVisitPhoto(photoUrl)
      setPhotos((prev) => prev.filter((url) => url !== photoUrl))
    } catch (error) {
      console.error("Failed to delete photo:", error)
      alert("Failed to delete photo. Please try again.")
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updatePropertyVisit(
        propertyId,
        propertyName,
        county,
        propertyType,
        true,
        visitDate,
        notes,
        rating,
        photos,
        visitDuration,
        weather,
        companions,
        highlights,
        wouldRecommend,
      )
      onVisitUpdate()
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to save visit:", error)
      alert("Failed to save visit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (currentRating: number | null, onRatingChange: (rating: number | null) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= (currentRating || 0) ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
        {currentRating && (
          <button
            type="button"
            onClick={() => onRatingChange(null)}
            className="p-1 rounded transition-colors text-gray-400 hover:text-gray-600 ml-2"
            title="Clear rating"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {currentVisit?.visited ? "Edit Visit" : "Log Visit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {currentVisit?.visited ? "Edit Visit" : "Log Your Visit"}
          </DialogTitle>
          <DialogDescription>
            Record details about your visit to {propertyName}, including photos, rating, and notes.
          </DialogDescription>
          <p className="text-sm text-muted-foreground">
            {propertyName}, {county}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Visit Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input id="visitDate" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.5"
                value={visitDuration || ""}
                onChange={(e) => setVisitDuration(Number.parseFloat(e.target.value) || 0)}
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label>Your Rating</Label>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(rating, setRating)}
              <span className="text-sm text-muted-foreground">{rating ? `${rating}/5 stars` : "No rating"}</span>
            </div>
          </div>

          {/* Photos */}
          <div>
            <Label>Photos</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? "Uploading..." : "Upload Photos"}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} {isLoading && "(uploading...)"}
                </span>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Visit photo ${index + 1}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <button
                        onClick={() => handlePhotoDelete(photo)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weather & Companions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weather">Weather</Label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Sunny</SelectItem>
                  <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                  <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                  <SelectItem value="snowy">❄️ Snowy</SelectItem>
                  <SelectItem value="windy">💨 Windy</SelectItem>
                  <SelectItem value="foggy">🌫️ Foggy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companions">Companions</Label>
              <Input
                id="companions"
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                placeholder="e.g. Family, Friends, Solo"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <Label htmlFor="highlights">Highlights</Label>
            <Textarea
              id="highlights"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="What were the best parts of your visit?"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share your thoughts, tips, or memories from this visit..."
              rows={4}
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-3">
            <Label htmlFor="recommend">Would you recommend this site?</Label>
            <Button
              type="button"
              variant={wouldRecommend ? "default" : "outline"}
              size="sm"
              onClick={() => setWouldRecommend(!wouldRecommend)}
              className={wouldRecommend ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {wouldRecommend ? "Yes, I recommend it!" : "Click to recommend"}
            </Button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Visit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
