"use client"

import { PadlockGrid } from "@/components/padlock-grid"
import { PadlockList } from "@/components/padlock-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, ArrowLeft, Grid3x3, List, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { thingsboardAPI } from "@/lib/thingsboard-api"
import { DeviceStorage } from "@/lib/device-storage"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { thingsboardWS } from "@/lib/thingsboard-websocket"

interface Padlock {
  id: string
  name: string
  status: "locked" | "unlocked" | "tampered" | "offline"
  battery: number
  location: string
  lastActivity: string
  siteId: string
}

export default function PadlocksPage() {
  const [padlocks, setPadlocks] = useState<Padlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function setupWebSocket() {
      const token = localStorage.getItem("thingsboard_token")
      if (!token) {
        console.log("[v0] ❌ Pas de token disponible pour le WebSocket")
        return
      }

      try {
        console.log("[v0] 🔌 Initialisation de la connexion WebSocket...")
        await thingsboardWS.connect(token)
        console.log("[v0] ✅ WebSocket connecté avec succès")

        // Souscrire aux mises à jour de tous les cadenas
        const registeredPadlocks = DeviceStorage.getDevicesByType("padlock")
        console.log("[v0] 📡 Souscription à", registeredPadlocks.length, "cadenas")

        registeredPadlocks.forEach((padlock) => {
          console.log("[v0] 📡 Souscription au cadenas:", padlock.id)
          thingsboardWS.subscribeToDevice(padlock.id, (update) => {
            console.log("[v0] 🔔 Mise à jour reçue pour le dispositif:", padlock.id)
            console.log("[v0] 📦 Données de mise à jour:", JSON.stringify(update, null, 2))

            // Mettre à jour le cadenas dans la liste
            setPadlocks((prev) => {
              const updated = prev.map((p) => {
                if (p.id === padlock.id) {
                  console.log("[v0] 🔄 Mise à jour du cadenas:", p.name)

                  // Extraire les nouvelles données
                  const newData = { ...p }

                  if (update.data) {
                    // Vérifier si c'est une mise à jour de télémétrie
                    if (update.data.data) {
                      Object.entries(update.data.data).forEach(([key, values]: [string, any]) => {
                        if (Array.isArray(values) && values.length > 0) {
                          const latestValue = values[0].value
                          console.log("[v0] 📊 Nouvelle valeur pour", key, ":", latestValue)

                          if (key === "battery") {
                            newData.battery = Number.parseInt(latestValue) || p.battery
                          } else if (key === "locked") {
                            newData.status = latestValue === "true" || latestValue === true ? "locked" : "unlocked"
                          } else if (key === "status") {
                            newData.status = latestValue as Padlock["status"]
                          }

                          // Mettre à jour la dernière activité
                          const timestamp = values[0].ts
                          const date = new Date(timestamp)
                          newData.lastActivity = date.toLocaleString("fr-FR")
                        }
                      })
                    }
                  }

                  console.log("[v0] ✅ Cadenas mis à jour:", newData)
                  return newData
                }
                return p
              })
              return updated
            })

            // Recharger les données complètes du dispositif pour obtenir le nom mis à jour
            fetchDeviceDetails(padlock.id)
          })
        })
      } catch (err) {
        console.error("[v0] ❌ Erreur lors de la connexion WebSocket:", err)
      }
    }

    setupWebSocket()

    return () => {
      console.log("[v0] 🧹 Nettoyage: déconnexion du WebSocket")
      thingsboardWS.disconnect()
    }
  }, [])

  async function fetchDeviceDetails(deviceId: string) {
    try {
      console.log("[v0] 🔄 Rechargement des détails du dispositif:", deviceId)
      const devices = await thingsboardAPI.getDevices([deviceId])

      if (devices.length > 0) {
        const device = devices[0]
        console.log("[v0] 📥 Dispositif rechargé:", device.name, device.label)

        setPadlocks((prev) =>
          prev.map((p) => {
            if (p.id === deviceId) {
              const updatedName = device.name || device.label || p.name
              console.log("[v0] 🏷️ Mise à jour du nom:", p.name, "→", updatedName)
              return {
                ...p,
                name: updatedName,
                location: device.label || p.location,
              }
            }
            return p
          }),
        )
      }
    } catch (err) {
      console.error("[v0] ❌ Erreur lors du rechargement du dispositif:", err)
    }
  }

  async function fetchPadlocks() {
    try {
      setError(null)

      const registeredPadlocks = DeviceStorage.getDevicesByType("padlock")

      if (registeredPadlocks.length === 0) {
        setPadlocks([])
        setLoading(false)
        return
      }

      const padlockIds = registeredPadlocks.map((p) => p.id)

      const devices = await thingsboardAPI.getDevices(padlockIds)

      console.log("[v0] 🔄 Rafraîchissement des dispositifs:", devices.length)

      const mappedPadlocks: Padlock[] = await Promise.all(
        devices.map(async (device) => {
          let battery = 100
          let status: Padlock["status"] = "offline"
          let lastActivity = "Jamais"

          try {
            const telemetry = await thingsboardAPI.getDeviceTelemetry(device.id.id, ["battery", "status", "locked"])

            if (telemetry.battery && telemetry.battery.length > 0) {
              battery = Number.parseInt(telemetry.battery[0].value) || 100
            }

            if (telemetry.locked && telemetry.locked.length > 0) {
              const isLocked = telemetry.locked[0].value === "true" || telemetry.locked[0].value === true
              status = isLocked ? "locked" : "unlocked"
            } else if (telemetry.status && telemetry.status.length > 0) {
              status = telemetry.status[0].value as Padlock["status"]
            }

            if (telemetry.locked && telemetry.locked.length > 0) {
              const timestamp = telemetry.locked[0].ts
              const date = new Date(timestamp)
              lastActivity = date.toLocaleString("fr-FR")
            }
          } catch (err) {
            console.log("[v0] ⚠️ Erreur télémétrie pour:", device.id.id)
          }

          const deviceName = device.name || device.label || `Dispositif ${device.id.id.substring(0, 8)}`

          return {
            id: device.id.id,
            name: deviceName,
            status,
            battery,
            location: device.label || "Non spécifié",
            lastActivity,
            siteId: device.customerId?.id || "unknown",
          }
        }),
      )

      console.log("[v0] ✅ Cadenas mis à jour:", mappedPadlocks.length)
      setPadlocks(mappedPadlocks)
    } catch (err: any) {
      console.error("[v0] ❌ Erreur lors de la récupération des cadenas:", err)

      if (err.message?.includes("Session expirée") || err.message?.includes("Non authentifié")) {
        setError("Session expirée. Redirection vers la page de connexion...")
        setTimeout(() => {
          logout()
          router.push("/login")
        }, 2000)
      } else {
        setError("Impossible de récupérer les cadenas. Vérifiez votre connexion.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPadlocks()
  }, [logout, router])

  useEffect(() => {
    console.log("[v0] ⏰ Configuration du rafraîchissement automatique (30s)")

    const intervalId = setInterval(() => {
      console.log("[v0] 🔄 Rafraîchissement automatique des cadenas...")
      fetchPadlocks()
    }, 30000) // 30 secondes

    return () => {
      console.log("[v0] 🧹 Nettoyage: arrêt du rafraîchissement automatique")
      clearInterval(intervalId)
    }
  }, [])

  const lockedCount = padlocks.filter((p) => p.status === "locked").length
  const unlockedCount = padlocks.filter((p) => p.status === "unlocked").length
  const tamperedCount = padlocks.filter((p) => p.status === "tampered").length
  const offlineCount = padlocks.filter((p) => p.status === "offline").length

  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-2xl font-bold text-foreground">Surveillance des Cadenas</h1>
                <p className="text-sm text-muted-foreground">
                  {loading ? "Chargement..." : `${padlocks.length} dispositifs connectés`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-bold text-status-normal">{lockedCount}</div>
              <div className="text-sm text-muted-foreground">Verrouillés</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-status-info">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">Déverrouillés</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-status-critical">{tamperedCount}</div>
              <div className="text-sm text-muted-foreground">Altérés</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">{offlineCount}</div>
              <div className="text-sm text-muted-foreground">Hors ligne</div>
            </Card>
          </div>
        )}

        {error && (
          <Card className="p-4 bg-status-critical/10 border-status-critical">
            <p className="text-status-critical">{error}</p>
          </Card>
        )}

        {!loading && padlocks.length === 0 && !error && (
          <Card className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun cadenas enregistré</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des cadenas dans la page d'administration pour commencer la surveillance.
            </p>
            <Link href="/admin">
              <Button>Aller à l'administration</Button>
            </Link>
          </Card>
        )}

        {!loading && padlocks.length > 0 && (
          <>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des cadenas..." className="pl-9" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-foreground">Tous les Cadenas</h2>
              <PadlockGrid padlocks={padlocks} />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-foreground">Vue Liste</h2>
              <PadlockList padlocks={padlocks} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
