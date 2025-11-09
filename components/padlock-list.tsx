"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, LockOpen, AlertTriangle, WifiOff, Battery, MapPin, MoreVertical } from "lucide-react"

interface Padlock {
  id: string
  name: string
  status: "locked" | "unlocked" | "tampered" | "offline"
  battery: number
  location: string
  lastActivity: string
  siteId: string
}

interface PadlockListProps {
  padlocks: Padlock[]
}

export function PadlockList({ padlocks }: PadlockListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return Lock
      case "unlocked":
        return LockOpen
      case "tampered":
        return AlertTriangle
      case "offline":
        return WifiOff
      default:
        return Lock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "text-status-normal"
      case "unlocked":
        return "text-status-info"
      case "tampered":
        return "text-status-critical"
      case "offline":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-status-normal"
    if (battery > 20) return "text-status-warning"
    return "text-status-critical"
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "locked":
        return "Verrouillé"
      case "unlocked":
        return "Déverrouillé"
      case "tampered":
        return "Altéré"
      case "offline":
        return "Hors ligne"
      default:
        return status
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {padlocks.map((padlock) => {
          const StatusIcon = getStatusIcon(padlock.status)
          return (
            <div
              key={padlock.id}
              className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div
                className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${getStatusColor(padlock.status)}`}
              >
                <StatusIcon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{padlock.name}</h3>
                  <Badge
                    variant={
                      padlock.status === "locked"
                        ? "default"
                        : padlock.status === "tampered"
                          ? "destructive"
                          : "secondary"
                    }
                    className={`text-xs ${
                      padlock.status === "locked"
                        ? "bg-status-normal text-primary-foreground"
                        : padlock.status === "tampered"
                          ? "bg-status-critical text-primary-foreground"
                          : padlock.status === "unlocked"
                            ? "bg-status-info text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStatusLabel(padlock.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {padlock.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-sm font-medium ${getBatteryColor(padlock.battery)}`}>
                    <Battery className={`h-4 w-4 inline mr-1 ${getBatteryColor(padlock.battery)}`} />
                    {padlock.battery}%
                  </div>
                  <div className="text-xs text-muted-foreground">{padlock.lastActivity}</div>
                </div>

                <Button size="sm" variant="ghost" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
