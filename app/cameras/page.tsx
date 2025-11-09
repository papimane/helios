"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CameraGrid } from "@/components/camera-grid"
import { CameraTimeline } from "@/components/camera-timeline"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, ArrowLeft, Search, Filter, Camera, Video, VideoOff } from "lucide-react"
import Link from "next/link"
import { thingsboardAPI } from "@/lib/thingsboard-api"
import { DeviceStorage } from "@/lib/device-storage"

interface CameraDevice {
  id: string
  name: string
  status: "recording" | "online" | "offline"
  location: string
  lastActivity: string
  siteId: string
  streamUrl?: string
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchCameras = async () => {
    try {
      console.log("[v0] Récupération des caméras depuis l'API...")
      const registeredDevices = DeviceStorage.getDevices()
      console.log("[v0] Dispositifs enregistrés:", registeredDevices)

      const cameraDevices = registeredDevices.filter((d) => d.type === "camera")
      console.log("[v0] Caméras filtrées:", cameraDevices)

      if (cameraDevices.length === 0) {
        console.log("[v0] Aucune caméra enregistrée")
        setCameras([])
        setLoading(false)
        return
      }

      const deviceIds = cameraDevices.map((d) => d.id)
      console.log("[v0] UUIDs des caméras:", deviceIds)

      const devices = await thingsboardAPI.getDevices(deviceIds)

      console.log("[v0] Caméras récupérées:", devices)

      const mappedCameras: CameraDevice[] = devices.map((device) => {
        const registeredDevice = cameraDevices.find((d) => d.id === device.id.id)

        const status = device.label?.toLowerCase().includes("recording")
          ? "recording"
          : device.label?.toLowerCase().includes("offline")
            ? "offline"
            : "online"

        const lastActivity = new Date(device.createdTime).toLocaleString("fr-FR")

        return {
          id: device.id.id,
          name: device.name,
          status,
          location: device.label || "Non spécifié",
          lastActivity,
          siteId: device.customerId?.id || "unknown",
          streamUrl: registeredDevice?.streamUrl,
        }
      })

      setCameras(mappedCameras)
      setError(null)
    } catch (err) {
      console.error("[v0] Erreur lors de la récupération des caméras:", err)

      if (err instanceof Error && err.message.includes("Session expirée")) {
        console.log("[v0] Session expirée détectée, redirection vers login...")
        router.push("/login?expired=true")
        return
      }

      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCameras()

    const interval = setInterval(() => {
      console.log("[v0] Rafraîchissement automatique des caméras...")
      fetchCameras()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const recordingCount = cameras.filter((c) => c.status === "recording").length
  const onlineCount = cameras.filter((c) => c.status === "online").length
  const offlineCount = cameras.filter((c) => c.status === "offline").length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des caméras...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Surveillance Caméras</h1>
                <p className="text-sm text-muted-foreground">{cameras.length} caméras actives</p>
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

        {cameras.length === 0 && !error && (
          <Card className="p-8 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune caméra enregistrée</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des caméras depuis la page d'administration pour commencer la surveillance.
            </p>
            <Link href="/admin">
              <Button>Aller à l'administration</Button>
            </Link>
          </Card>
        )}

        {cameras.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-status-critical" />
                  <div>
                    <div className="text-2xl font-bold text-status-critical">{recordingCount}</div>
                    <div className="text-sm text-muted-foreground">Enregistrement</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Camera className="h-8 w-8 text-status-normal" />
                  <div>
                    <div className="text-2xl font-bold text-status-normal">{onlineCount}</div>
                    <div className="text-sm text-muted-foreground">En ligne</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <VideoOff className="h-8 w-8 text-muted-foreground" />
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
                <Input placeholder="Rechercher des caméras..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            {/* Camera Grid and Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Flux en direct</h2>
                <CameraGrid cameras={cameras} />
              </div>
              <div>
                <CameraTimeline />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
