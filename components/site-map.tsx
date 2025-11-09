"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sites } from "@/lib/mock-data"
import { MapPin, Lock, Camera, Battery, Radio } from "lucide-react"

export function SiteMap() {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "normal":
        return "normal"
      case "warning":
        return "alerte"
      case "critical":
        return "critique"
      default:
        return status
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sites.map((site) => (
        <Card key={site.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-foreground">{site.name}</h3>
                <p className="text-sm text-muted-foreground">{site.location}</p>
              </div>
            </div>
            <Badge
              variant={site.status === "normal" ? "default" : site.status === "warning" ? "secondary" : "destructive"}
              className={
                site.status === "normal"
                  ? "bg-status-normal text-primary-foreground"
                  : site.status === "warning"
                    ? "bg-status-warning text-primary-foreground"
                    : "bg-status-critical text-primary-foreground"
              }
            >
              {getStatusLabel(site.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{site.devices.padlocks} Cadenas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{site.devices.cameras} Caméras</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Battery className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{site.devices.batteries} Batteries</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Radio className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{site.devices.proximityDetectors} Détecteurs</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
