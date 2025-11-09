"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BatteryMap } from "@/components/battery-map"
import { BatteryList } from "@/components/battery-list"
import { BatteryStats } from "@/components/battery-stats"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, ArrowLeft, Search, Filter, Battery } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { thingsboardAPI } from "@/lib/thingsboard-api"
import { DeviceStorage } from "@/lib/device-storage"

export interface BatteryDevice {
  id: string
  name: string
  status: "normal" | "low" | "critical"
  charge: number
  location: string
  lastUpdate: string
  siteId: string
  coordinates?: { lat: number; lng: number }
}

export default function BatteriesPage() {
  const [batteries, setBatteries] = useState<BatteryDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchBatteries = async () => {
    try {
      console.log("[v0] Récupération des batteries depuis l'API...")
      const registeredDevices = DeviceStorage.getDevices()
      const batteryDevices = registeredDevices.filter((d) => d.type === "battery")

      if (batteryDevices.length === 0) {
        console.log("[v0] Aucune batterie enregistrée")
        setBatteries([])
        setLoading(false)
        return
      }

      const deviceIds = batteryDevices.map((d) => d.id)
      const devices = await thingsboardAPI.getDevices(deviceIds)

      console.log("[v0] Batteries récupérées:", devices)

      const mappedBatteries: BatteryDevice[] = await Promise.all(
        devices.map(async (device) => {
          // Récupérer la télémétrie pour le niveau de charge
          let charge = 75 // Valeur par défaut
          try {
            const telemetry = await thingsboardAPI.getDeviceTelemetry(device.id.id, ["battery", "charge", "level"])
            if (telemetry.battery?.[0]?.value) {
              charge = Number.parseInt(telemetry.battery[0].value)
            } else if (telemetry.charge?.[0]?.value) {
              charge = Number.parseInt(telemetry.charge[0].value)
            } else if (telemetry.level?.[0]?.value) {
              charge = Number.parseInt(telemetry.level[0].value)
            }
          } catch (err) {
            console.log("[v0] Impossible de récupérer la télémétrie pour", device.name)
          }

          const status = charge > 50 ? "normal" : charge > 20 ? "low" : "critical"
          const lastUpdate = new Date(device.createdTime).toLocaleString("fr-FR")

          return {
            id: device.id.id,
            name: device.name,
            status,
            charge,
            location: device.label || "Non spécifié",
            lastUpdate,
            siteId: device.customerId?.id || "unknown",
          }
        }),
      )

      setBatteries(mappedBatteries)
      setError(null)
    } catch (err) {
      console.error("[v0] Erreur lors de la récupération des batteries:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")

      if (err instanceof Error && err.message.includes("Session expirée")) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatteries()

    const interval = setInterval(() => {
      console.log("[v0] Rafraîchissement automatique des batteries...")
      fetchBatteries()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des batteries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Suivi des Batteries</h1>
                <p className="text-sm text-muted-foreground">{batteries.length} batteries surveillées</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <Card className="p-4 bg-status-critical/10 border-status-critical">
            <p className="text-status-critical">{error}</p>
          </Card>
        )}

        {batteries.length === 0 && !error && (
          <Card className="p-8 text-center">
            <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune batterie enregistrée</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des batteries depuis la page d'administration pour commencer le suivi.
            </p>
            <Link href="/admin">
              <Button>Aller à l'administration</Button>
            </Link>
          </Card>
        )}

        {batteries.length > 0 && (
          <>
            {/* Stats */}
            <BatteryStats batteries={batteries} />

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des batteries..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            {/* Map and List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BatteryMap batteries={batteries} />
              <BatteryList batteries={batteries} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
