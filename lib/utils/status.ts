import type { SiteStatus, PadlockStatus, ProximityStatus, BatteryStatus } from "../types"

export function getSiteStatusColor(status: SiteStatus): string {
  switch (status) {
    case "normal":
      return "text-status-normal"
    case "warning":
      return "text-status-warning"
    case "critical":
      return "text-status-critical"
    case "offline":
      return "text-muted-foreground"
    default:
      return "text-foreground"
  }
}

export function getSiteStatusBg(status: SiteStatus): string {
  switch (status) {
    case "normal":
      return "bg-status-normal/10 border-status-normal/20"
    case "warning":
      return "bg-status-warning/10 border-status-warning/20"
    case "critical":
      return "bg-status-critical/10 border-status-critical/20"
    case "offline":
      return "bg-muted/10 border-muted/20"
    default:
      return "bg-card"
  }
}

export function getPadlockStatusColor(status: PadlockStatus): string {
  switch (status) {
    case "locked":
      return "text-status-normal"
    case "unlocked":
      return "text-status-warning"
    case "alarm":
      return "text-status-critical"
    case "low-battery":
      return "text-status-warning"
    default:
      return "text-foreground"
  }
}

export function getProximityStatusColor(status: ProximityStatus): string {
  switch (status) {
    case "clear":
      return "text-status-normal"
    case "detected":
      return "text-status-warning"
    case "alarm":
      return "text-status-critical"
    default:
      return "text-foreground"
  }
}

export function getBatteryStatusColor(status: BatteryStatus): string {
  switch (status) {
    case "in-service":
      return "text-status-normal"
    case "moving":
      return "text-status-info"
    case "out-of-zone":
      return "text-status-critical"
    case "signal-lost":
      return "text-muted-foreground"
    default:
      return "text-foreground"
  }
}

export function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
