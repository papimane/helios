"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Maximize2, ExternalLink } from "lucide-react"

interface CameraFeedProps {
  camera: {
    id: string
    name: string
    status: "recording" | "online" | "offline"
    location: string
    streamUrl?: string
  }
}

export function CameraFeed({ camera }: CameraFeedProps) {
  const getEmbedUrl = (url?: string) => {
    if (!url) return null

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`
    }

    // URL directe
    return url
  }

  const embedUrl = getEmbedUrl(camera.streamUrl)

  return (
    <Card className="overflow-hidden group">
      {/* Video Feed */}
      <div className="relative bg-secondary aspect-video">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun flux configuré</p>
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {camera.status === "recording" && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-status-critical/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
            REC
          </div>
        )}

        {/* Offline overlay */}
        {camera.status === "offline" && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Caméra hors ligne</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        {embedUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {camera.streamUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 bg-background/50 hover:bg-background/80"
                    onClick={() => window.open(camera.streamUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/50 hover:bg-background/80">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{camera.name}</h3>
            <p className="text-xs text-muted-foreground">{camera.location}</p>
          </div>
          <Badge
            variant={camera.status === "recording" ? "destructive" : camera.status === "online" ? "default" : "outline"}
            className={
              camera.status === "recording"
                ? "bg-status-critical text-primary-foreground"
                : camera.status === "online"
                  ? "bg-status-normal text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }
          >
            {camera.status}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
