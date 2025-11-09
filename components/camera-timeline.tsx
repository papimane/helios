"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cameras } from "@/lib/mock-data"
import { Camera, Activity } from "lucide-react"

export function CameraTimeline() {
  const recentEvents = cameras
    .filter((c) => c.lastMotion)
    .map((c) => ({
      cameraId: c.id,
      cameraName: c.name,
      event: "Motion Detected",
      time: c.lastMotion,
      status: c.status,
    }))
    .slice(0, 8)

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Events</h2>
      <div className="space-y-3">
        {recentEvents.map((event, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-accent/30">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-status-info">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground text-sm">{event.cameraName}</h3>
                <Badge variant="secondary" className="text-xs bg-status-info text-primary-foreground">
                  {event.event}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{event.time}</p>
            </div>
          </div>
        ))}
        {recentEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent events</p>
          </div>
        )}
      </div>
    </Card>
  )
}
