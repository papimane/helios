"use client"

import { Card } from "@/components/ui/card"
import { BatteryIcon } from "lucide-react"

interface BatteryDevice {
  id: string
  name: string
  status: "normal" | "low" | "critical"
  charge: number
  location: string
  lastUpdate: string
  siteId: string
}

interface BatteryMapProps {
  batteries: BatteryDevice[]
}

export function BatteryMap({ batteries }: BatteryMapProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Localisation des Batteries</h2>
      <div className="relative bg-secondary rounded-lg overflow-hidden" style={{ height: "500px" }}>
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/placeholder.svg?height=500&width=800"
            alt="Carte de localisation des batteries"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Battery markers */}
        {batteries.map((battery, index) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case "normal":
                return "bg-status-normal"
              case "low":
                return "bg-status-warning"
              case "critical":
                return "bg-status-critical"
              default:
                return "bg-muted"
            }
          }

          // Position markers in a grid pattern for demo
          const positions = [
            { top: "20%", left: "25%" },
            { top: "40%", left: "60%" },
            { top: "65%", left: "35%" },
            { top: "30%", left: "75%" },
            { top: "50%", left: "45%" },
            { top: "75%", left: "65%" },
          ]

          const position = positions[index % positions.length]

          return (
            <div
              key={battery.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: position.top, left: position.left }}
            >
              <div
                className={`h-10 w-10 rounded-full ${getStatusColor(battery.status)} flex items-center justify-center shadow-lg border-2 border-background transition-transform group-hover:scale-110`}
              >
                <BatteryIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                  <div className="text-xs font-medium text-foreground">{battery.name}</div>
                  <div className="text-xs text-muted-foreground">{battery.charge}% charge</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-status-normal" />
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-status-warning" />
          <span className="text-muted-foreground">Faible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-status-critical" />
          <span className="text-muted-foreground">Critique</span>
        </div>
      </div>
    </Card>
  )
}
