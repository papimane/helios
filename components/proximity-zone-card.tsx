"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Radio, AlertCircle, CheckCircle, WifiOff } from "lucide-react"
import type { ProximityDetector } from "@/lib/mock-data"

interface ProximityZoneCardProps {
  detector: ProximityDetector
  siteName: string
}

export function ProximityZoneCard({ detector, siteName }: ProximityZoneCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear":
        return CheckCircle
      case "detected":
        return AlertCircle
      case "offline":
        return WifiOff
      default:
        return Radio
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear":
        return "text-status-normal"
      case "detected":
        return "text-status-warning"
      case "offline":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  const StatusIcon = getStatusIcon(detector.status)

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${getStatusColor(detector.status)}`}
          >
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{detector.name}</h3>
            <p className="text-xs text-muted-foreground">{siteName}</p>
          </div>
        </div>
        <Badge
          variant={detector.status === "clear" ? "default" : detector.status === "detected" ? "secondary" : "outline"}
          className={
            detector.status === "clear"
              ? "bg-status-normal text-primary-foreground"
              : detector.status === "detected"
                ? "bg-status-warning text-primary-foreground"
                : "bg-muted text-muted-foreground"
          }
        >
          {detector.status}
        </Badge>
      </div>

      <div className="space-y-4">
        {detector.lastDetection && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Detection</span>
            <span className="text-foreground font-medium">{detector.lastDetection}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sensitivity</span>
            <span className="text-foreground font-medium">{detector.sensitivity}%</span>
          </div>
          <Slider value={[detector.sensitivity]} max={100} step={5} disabled={detector.status === "offline"} />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            disabled={detector.status === "offline"}
          >
            Configure
          </Button>
          <Button size="sm" variant="ghost" disabled={detector.status === "offline"}>
            History
          </Button>
        </div>
      </div>
    </Card>
  )
}
