"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { alerts, sites } from "@/lib/mock-data"
import { Lock, Camera, Battery, Radio, Check, X, Eye } from "lucide-react"

export function AlertPanel() {
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
        return Lock
    }
  }

  const getSiteName = (siteId: string) => {
    return sites.find((s) => s.id === siteId)?.name || "Unknown Site"
  }

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged)

  return (
    <div className="space-y-6">
      {/* Unacknowledged Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Active Alerts</h2>
          <div className="space-y-3">
            {unacknowledgedAlerts.map((alert) => {
              const Icon = getIcon(alert.type)
              return (
                <Card key={alert.id} className="p-4 border-l-4 border-l-status-critical">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${
                        alert.severity === "critical"
                          ? "text-status-critical"
                          : alert.severity === "warning"
                            ? "text-status-warning"
                            : "text-status-info"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
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
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{alert.message}</h3>
                      <p className="text-sm text-muted-foreground">{getSiteName(alert.siteId)}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="default" className="bg-status-normal hover:bg-status-normal/90">
                        <Check className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Acknowledged Alerts</h2>
          <div className="space-y-3">
            {acknowledgedAlerts.map((alert) => {
              const Icon = getIcon(alert.type)
              return (
                <Card key={alert.id} className="p-4 bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        <Check className="h-4 w-4 text-status-normal" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{alert.message}</h3>
                      <p className="text-sm text-muted-foreground">{getSiteName(alert.siteId)}</p>
                    </div>

                    <Button size="sm" variant="ghost" className="shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
