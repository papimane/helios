import { Card } from "@/components/ui/card"
import { Battery, TrendingDown, AlertTriangle, Zap } from "lucide-react"

interface BatteryDevice {
  id: string
  name: string
  status: "normal" | "low" | "critical"
  charge: number
  location: string
  lastUpdate: string
  siteId: string
}

interface BatteryStatsProps {
  batteries: BatteryDevice[]
}

export function BatteryStats({ batteries }: BatteryStatsProps) {
  const totalBatteries = batteries.length
  const normalBatteries = batteries.filter((b) => b.status === "normal").length
  const lowBatteries = batteries.filter((b) => b.status === "low").length
  const criticalBatteries = batteries.filter((b) => b.status === "critical").length
  const averageCharge =
    batteries.length > 0 ? Math.round(batteries.reduce((sum, b) => sum + b.charge, 0) / batteries.length) : 0

  const stats = [
    {
      label: "Total Batteries",
      value: totalBatteries,
      icon: Battery,
      color: "text-status-info",
    },
    {
      label: "Charge Moyenne",
      value: `${averageCharge}%`,
      icon: Zap,
      color: averageCharge > 50 ? "text-status-normal" : "text-status-warning",
    },
    {
      label: "Batterie Faible",
      value: lowBatteries,
      icon: TrendingDown,
      color: "text-status-warning",
    },
    {
      label: "Critique",
      value: criticalBatteries,
      icon: AlertTriangle,
      color: "text-status-critical",
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
