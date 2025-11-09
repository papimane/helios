"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { proximityDetectors } from "@/lib/mock-data"
import { Radio, Clock } from "lucide-react"

export function ProximityActivityFeed() {
  const recentActivity = proximityDetectors
    .filter((d) => d.lastDetection)
    .sort((a, b) => {
      // Simple sort by detection time (in real app would parse timestamps)
      return (a.lastDetection || "").localeCompare(b.lastDetection || "")
    })
    .slice(0, 10)

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
      <div className="space-y-3">
        {recentActivity.map((detector) => (
          <div key={detector.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-accent/30">
            <Radio className="h-5 w-5 text-status-warning mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground text-sm">{detector.name}</h3>
                <Badge variant="secondary" className="text-xs bg-status-warning text-primary-foreground">
                  Motion Detected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {detector.lastDetection}
              </p>
            </div>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Radio className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity detected</p>
          </div>
        )}
      </div>
    </Card>
  )
}
