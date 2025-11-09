import { Card } from "@/components/ui/card"
import { alerts } from "@/lib/mock-data"
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"

export function AlertStats() {
  const totalAlerts = alerts.length
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length
  const warningAlerts = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged).length

  const stats = [
    {
      label: "Total Alerts",
      value: totalAlerts,
      icon: AlertCircle,
      color: "text-status-info",
    },
    {
      label: "Active",
      value: activeAlerts,
      icon: AlertTriangle,
      color: activeAlerts > 0 ? "text-status-warning" : "text-muted-foreground",
    },
    {
      label: "Critical",
      value: criticalAlerts,
      icon: AlertTriangle,
      color: criticalAlerts > 0 ? "text-status-critical" : "text-muted-foreground",
    },
    {
      label: "Acknowledged",
      value: acknowledgedAlerts,
      icon: CheckCircle,
      color: "text-status-normal",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-foreground">{stat.label}</h3>
          </Card>
        )
      })}
    </div>
  )
}
