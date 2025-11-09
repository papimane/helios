"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProximityZoneCard } from "@/components/proximity-zone-card"
import { ProximityActivityFeed } from "@/components/proximity-activity-feed"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, ArrowLeft, Search, Filter, Radio } from "lucide-react"
import Link from "next/link"
import { thingsboardAPI } from "@/lib/thingsboard-api"
import { DeviceStorage } from "@/lib/device-storage"

export interface ProximityDetector {
  id: string
  name: string
  status: "clear" | "detected" | "offline"
  sensitivity: number
  lastDetection?: string
  siteId: string
  location: string
}

export default function ProximityPage() {
  const [proximityDetectors, setProximityDetectors] = useState<ProximityDetector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchProximityDetectors = async () => {
    try {
      console.log("[v0] Récupération des détecteurs de proximité depuis l'API...")
      const registeredDevices = DeviceStorage.getDevices()
      const proximityDevices = registeredDevices.filter((d) => d.type === "proximity")

      if (proximityDevices.length === 0) {
        console.log("[v0] Aucun détecteur de proximité enregistré")
        setProximityDetectors([])
        setLoading(false)
        return
      }

      const deviceIds = proximityDevices.map((d) => d.id)
      const devices = await thingsboardAPI.getDevices(deviceIds)

      console.log("[v0] Détecteurs de proximité récupérés:", devices)

      const mappedDetectors: ProximityDetector[] = await Promise.all(
        devices.map(async (device) => {
          // Récupérer la télémétrie pour le statut de détection
          let status: "clear" | "detected" | "offline" = "clear"
          let sensitivity = 75
          let lastDetection: string | undefined

          try {
            const telemetry = await thingsboardAPI.getDeviceTelemetry(device.id.id, [
              "detection",
              "presence",
              "motion",
              "sensitivity",
            ])

            if (telemetry.detection?.[0]?.value === "true" || telemetry.presence?.[0]?.value === "true") {
              status = "detected"
              lastDetection = new Date(telemetry.detection?.[0]?.ts || Date.now()).toLocaleString("fr-FR")
            } else if (telemetry.motion?.[0]?.value === "true") {
              status = "detected"
              lastDetection = new Date(telemetry.motion?.[0]?.ts || Date.now()).toLocaleString("fr-FR")
            }

            if (telemetry.sensitivity?.[0]?.value) {
              sensitivity = Number.parseInt(telemetry.sensitivity[0].value)
            }
          } catch (err) {
            console.log("[v0] Impossible de récupérer la télémétrie pour", device.name)
            status = "offline"
          }

          return {
            id: device.id.id,
            name: device.name,
            status,
            sensitivity,
            lastDetection,
            siteId: device.customerId?.id || "unknown",
            location: device.label || "Non spécifié",
          }
        }),
      )

      setProximityDetectors(mappedDetectors)
      setError(null)
    } catch (err) {
      console.error("[v0] Erreur lors de la récupération des détecteurs:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")

      if (err instanceof Error && err.message.includes("Session expirée")) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProximityDetectors()

    const interval = setInterval(() => {
      console.log("[v0] Rafraîchissement automatique des détecteurs de proximité...")
      fetchProximityDetectors()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const clearCount = proximityDetectors.filter((d) => d.status === "clear").length
  const detectedCount = proximityDetectors.filter((d) => d.status === "detected").length
  const offlineCount = proximityDetectors.filter((d) => d.status === "offline").length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des détecteurs...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Détection de Proximité</h1>
                <p className="text-sm text-muted-foreground">{proximityDetectors.length} zones surveillées</p>
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

        {proximityDetectors.length === 0 && !error && (
          <Card className="p-8 text-center">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun détecteur enregistré</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des détecteurs de proximité depuis la page d'administration.
            </p>
            <Link href="/admin">
              <Button>Aller à l'administration</Button>
            </Link>
          </Card>
        )}

        {proximityDetectors.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Radio className="h-8 w-8 text-status-normal" />
                  <div>
                    <div className="text-2xl font-bold text-status-normal">{clearCount}</div>
                    <div className="text-sm text-muted-foreground">Zones Dégagées</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Radio className="h-8 w-8 text-status-warning" />
                  <div>
                    <div className="text-2xl font-bold text-status-warning">{detectedCount}</div>
                    <div className="text-sm text-muted-foreground">Détections Actives</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Radio className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">{offlineCount}</div>
                    <div className="text-sm text-muted-foreground">Hors ligne</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des zones de détection..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Zones de Détection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proximityDetectors.map((detector) => (
                    <ProximityZoneCard key={detector.id} detector={detector} siteName={detector.location} />
                  ))}
                </div>
              </div>
              <div>
                <ProximityActivityFeed />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
