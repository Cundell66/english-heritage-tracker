"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { type SocialVisit, likeVisit, unlikeVisit, addComment, getVisitComments, type VisitComment } from "@/lib/social"
import { Heart, MessageCircle, MapPin, Star, Calendar, User, Send } from "lucide-react"
import Image from "next/image"

interface SocialVisitCardProps {
  visit: SocialVisit
  onUpdate: () => void
}

export function SocialVisitCard({ visit, onUpdate }: SocialVisitCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [comments, setComments] = useState<VisitComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      if (visit.isLiked) {
        await unlikeVisit(visit.id)
      } else {
        await likeVisit(visit.id)
      }
      onUpdate()
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      await addComment(visit.id, newComment.trim())
      setNewComment("")
      await loadComments()
      onUpdate()
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsCommenting(false)
    }
  }

  const loadComments = async () => {
    try {
      const visitComments = await getVisitComments(visit.id)
      setComments(visitComments)
    } catch (error) {
      console.error("Failed to load comments:", error)
    }
  }

  const handleShowComments = async () => {
    if (!showComments) {
      await loadComments()
    }
    setShowComments(!showComments)
  }

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-3 w-3 ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={visit.userAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{visit.userName}</p>
            <p className="text-xs text-muted-foreground">visited {visit.propertyName}</p>
          </div>
          <div className="text-xs text-muted-foreground">{new Date(visit.createdAt).toLocaleDateString()}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{visit.propertyName}</h3>
            <Badge className={getTypeColor(visit.propertyType)} variant="outline">
              {visit.propertyType}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{visit.county}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(visit.visitDate).toLocaleDateString()}</span>
            </div>
            {visit.rating && (
              <div className="flex items-center gap-1">
                {renderStars(visit.rating)}
                <span className="ml-1">({visit.rating}/5)</span>
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        {visit.photos && visit.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {visit.photos.slice(0, 6).map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Visit photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {visit.photos.length > 6 && (
              <div className="relative aspect-square rounded-lg bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">+{visit.photos.length - 6} more</span>
              </div>
            )}
          </div>
        )}

        {/* Highlights */}
        {visit.highlights && (
          <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-accent mb-1">Highlights:</p>
            <p className="text-sm">{visit.highlights}</p>
          </div>
        )}

        {/* Notes */}
        {visit.notes && (
          <div>
            <p className="text-sm">{visit.notes}</p>
          </div>
        )}

        {/* Engagement Actions */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 ${visit.isLiked ? "text-red-500" : "text-muted-foreground"}`}
          >
            <Heart className={`h-4 w-4 ${visit.isLiked ? "fill-current" : ""}`} />
            <span>{visit.likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowComments}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{visit.commentsCount}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-2 border-t">
            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="bg-muted rounded-lg p-2">
                        <p className="text-xs font-medium">{comment.userName}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
                rows={2}
              />
              <Button size="sm" onClick={handleComment} disabled={!newComment.trim() || isCommenting}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
