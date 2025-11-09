"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { alerts } from "@/lib/mock-data"
import { AlertTriangle, Lock, Camera, Battery, Radio, Check } from "lucide-react"

export function RecentAlerts() {
  const getIcon = (type: string) => {
    switch (type) {
      case "padlock":
        return Lock
      case "camera":
        return Camera
      case "battery":
        return Battery
      case "proximity":
        return Radio
      default:
        return AlertTriangle
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "critique"
      case "warning":
        return "alerte"
      case "info":
        return "info"
      default:
        return severity
    }
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Alertes Récentes</h2>
      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert) => {
          const Icon = getIcon(alert.type)
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                alert.acknowledged ? "bg-muted/30 border-border" : "bg-accent/30 border-border"
              }`}
            >
              <Icon
                className={`h-5 w-5 mt-0.5 ${
                  alert.severity === "critical"
                    ? "text-status-critical"
                    : alert.severity === "warning"
                      ? "text-status-warning"
                      : "text-status-info"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={alert.severity === "critical" ? "destructive" : "secondary"}
                    className={`text-xs ${
                      alert.severity === "critical"
                        ? "bg-status-critical"
                        : alert.severity === "warning"
                          ? "bg-status-warning"
                          : "bg-status-info"
                    } text-primary-foreground`}
                  >
                    {getSeverityLabel(alert.severity)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
              {!alert.acknowledged && (
                <Button size="sm" variant="ghost" className="shrink-0">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
