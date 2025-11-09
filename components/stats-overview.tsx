"use client"

import { Card } from "@/components/ui/card"
import { Lock, Camera, Battery, Radio, AlertTriangle } from "lucide-react"
import { sites, padlocks, cameras, batteries, proximityDetectors, alerts } from "@/lib/mock-data"

export function StatsOverview() {
  const totalPadlocks = padlocks.length
  const totalCameras = cameras.length
  const totalBatteries = batteries.length
  const totalDetectors = proximityDetectors.length
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length

  const criticalSites = sites.filter((s) => s.status === "critical").length
  const warningSites = sites.filter((s) => s.status === "warning").length

  const stats = [
    {
      label: "Sites Actifs",
      value: sites.length,
      icon: Radio,
      detail: `${criticalSites} critique${criticalSites > 1 ? "s" : ""}, ${warningSites} alerte${warningSites > 1 ? "s" : ""}`,
      status: criticalSites > 0 ? "critical" : warningSites > 0 ? "warning" : "normal",
    },
    {
      label: "Cadenas",
      value: totalPadlocks,
      icon: Lock,
      detail: `${padlocks.filter((p) => p.status === "locked").length} verrouillé${padlocks.filter((p) => p.status === "locked").length > 1 ? "s" : ""}`,
      status: "normal",
    },
    {
      label: "Caméras",
      value: totalCameras,
      icon: Camera,
      detail: `${cameras.filter((c) => c.status === "recording").length} en enregistrement`,
      status: "normal",
    },
    {
      label: "Batteries",
      value: totalBatteries,
      icon: Battery,
      detail: `${batteries.filter((b) => b.status === "critical").length} critique${batteries.filter((b) => b.status === "critical").length > 1 ? "s" : ""}`,
      status: batteries.some((b) => b.status === "critical") ? "critical" : "normal",
    },
    {
      label: "Alertes Actives",
      value: activeAlerts,
      icon: AlertTriangle,
      detail: `${alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length} critique${alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length > 1 ? "s" : ""}`,
      status: activeAlerts > 0 ? "critical" : "normal",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon
                className={`h-5 w-5 ${
                  stat.status === "critical"
                    ? "text-status-critical"
                    : stat.status === "warning"
                      ? "text-status-warning"
                      : "text-status-info"
                }`}
              />
              <span
                className={`text-2xl font-bold ${
                  stat.status === "critical"
                    ? "text-status-critical"
                    : stat.status === "warning"
                      ? "text-status-warning"
                      : "text-foreground"
                }`}
              >
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">{stat.label}</h3>
            <p className="text-xs text-muted-foreground">{stat.detail}</p>
          </Card>
        )
      })}
    </div>
  )
}
