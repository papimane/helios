"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Lock, Camera, Battery, Radio } from "lucide-react"
import { alerts } from "@/lib/mock-data"
import Link from "next/link"

export function NotificationDropdown() {
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)

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
        return Bell
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unacknowledgedAlerts.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-status-critical"
            >
              {unacknowledgedAlerts.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive" className="bg-status-critical text-primary-foreground">
              {unacknowledgedAlerts.length} nouvelle{unacknowledgedAlerts.length > 1 ? "s" : ""}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unacknowledgedAlerts.length > 0 ? (
          <>
            {unacknowledgedAlerts.slice(0, 5).map((alert) => {
              const Icon = getIcon(alert.type)
              return (
                <DropdownMenuItem key={alert.id} className="flex items-start gap-3 p-3 cursor-pointer">
                  <Icon
                    className={`h-4 w-4 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-status-critical"
                        : alert.severity === "warning"
                          ? "text-status-warning"
                          : "text-status-info"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/alerts" className="text-center justify-center cursor-pointer">
                Voir toutes les alertes
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">Aucune nouvelle notification</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
