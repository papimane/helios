"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Battery, MapPin, Clock, MoreVertical } from "lucide-react"

interface BatteryDevice {
  id: string
  name: string
  status: "normal" | "low" | "critical"
  charge: number
  location: string
  lastUpdate: string
  siteId: string
}

interface BatteryListProps {
  batteries: BatteryDevice[]
}

export function BatteryList({ batteries }: BatteryListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-status-normal"
      case "low":
        return "text-status-warning"
      case "critical":
        return "text-status-critical"
      default:
        return "text-muted-foreground"
    }
  }

  const getChargeColor = (charge: number) => {
    if (charge > 50) return "text-status-normal"
    if (charge > 20) return "text-status-warning"
    return "text-status-critical"
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">État des Batteries</h2>
      <div className="space-y-3">
        {batteries.map((battery) => (
          <div
            key={battery.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div
              className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${getStatusColor(battery.status)}`}
            >
              <Battery className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-foreground">{battery.name}</h3>
                <Badge
                  variant={battery.status === "normal" ? "default" : "destructive"}
                  className={`text-xs ${
                    battery.status === "normal"
                      ? "bg-status-normal text-primary-foreground"
                      : battery.status === "low"
                        ? "bg-status-warning text-primary-foreground"
                        : "bg-status-critical text-primary-foreground"
                  }`}
                >
                  {battery.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Niveau de Charge</span>
                  <span className={`font-medium ${getChargeColor(battery.charge)}`}>{battery.charge}%</span>
                </div>
                <Progress value={battery.charge} className="h-1.5" />
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {battery.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {battery.lastUpdate}
                </span>
              </div>
            </div>

            <Button size="sm" variant="ghost" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
