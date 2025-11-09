"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock, LockOpen, AlertTriangle, WifiOff, MapPin, Battery } from "lucide-react"

interface Padlock {
  id: string
  name: string
  status: "locked" | "unlocked" | "tampered" | "offline"
  battery: number
  location: string
  lastActivity: string
  siteId: string
}

interface PadlockGridProps {
  padlocks: Padlock[]
}

export function PadlockGrid({ padlocks }: PadlockGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {padlocks.map((padlock) => {
        const StatusIcon = getStatusIcon(padlock.status)
        return (
          <Card key={padlock.id} className="p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${getStatusColor(padlock.status)}`}
                >
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{padlock.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {padlock.location}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  padlock.status === "locked" ? "default" : padlock.status === "tampered" ? "destructive" : "secondary"
                }
                className={
                  padlock.status === "locked"
                    ? "bg-status-normal text-primary-foreground"
                    : padlock.status === "tampered"
                      ? "bg-status-critical text-primary-foreground"
                      : padlock.status === "unlocked"
                        ? "bg-status-info text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }
              >
                {getStatusLabel(padlock.status)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Battery className={`h-3 w-3 ${getBatteryColor(padlock.battery)}`} />
                    Batterie
                  </span>
                  <span className={`text-xs font-medium ${getBatteryColor(padlock.battery)}`}>{padlock.battery}%</span>
                </div>
                <Progress value={padlock.battery} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Dernière activité</span>
                <span className="text-foreground">{padlock.lastActivity}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={padlock.status === "offline"}
                >
                  {padlock.status === "locked" ? "Déverrouiller" : "Verrouiller"}
                </Button>
                <Button size="sm" variant="ghost" disabled={padlock.status === "offline"}>
                  Détails
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
