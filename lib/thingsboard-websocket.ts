const WS_BASE_URL = "wss://platform.iokub.com/api/ws/plugins/telemetry"

export interface TelemetryUpdate {
  [key: string]: Array<{
    ts: number
    value: string | number | boolean
  }>
}

export interface AttributeUpdate {
  [key: string]: string | number | boolean
}

export interface DeviceUpdate {
  deviceId: string
  data: any
}

type UpdateCallback = (update: DeviceUpdate) => void

class ThingsboardWebSocket {
  private ws: WebSocket | null = null
  private token: string | null = null
  private subscriptions: Map<string, number> = new Map()
  private callbacks: Map<number, UpdateCallback> = new Map()
  private cmdId = 0
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isConnecting = false
  private isAuthenticated = false

  async connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN && this.isAuthenticated) {
        console.log("[v0] WebSocket déjà connecté et authentifié")
        resolve()
        return
      }

      if (this.isConnecting) {
        console.log("[v0] Connexion WebSocket déjà en cours")
        reject(new Error("Connexion déjà en cours"))
        return
      }

      this.isConnecting = true
      this.token = token

      console.log("[v0] Tentative de connexion WebSocket à:", WS_BASE_URL)
      console.log("[v0] Token utilisé:", token.substring(0, 20) + "...")

      try {
        // Thingsboard WebSocket nécessite le token dans l'URL
        const wsUrl = `${WS_BASE_URL}?token=${token}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log("[v0] ✅ WebSocket connecté avec succès à Thingsboard")
          this.isConnecting = false
          this.isAuthenticated = true
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("[v0] 📨 Message WebSocket reçu:", JSON.stringify(message, null, 2))
            this.handleMessage(message)
          } catch (err) {
            console.error("[v0] ❌ Erreur lors du parsing du message WebSocket:", err)
            console.error("[v0] Message brut:", event.data)
          }
        }

        this.ws.onerror = (error) => {
          console.error("[v0] ❌ Erreur WebSocket:", error)
          this.isConnecting = false
          this.isAuthenticated = false
          reject(error)
        }

        this.ws.onclose = (event) => {
          console.log("[v0] 🔌 WebSocket déconnecté. Code:", event.code, "Raison:", event.reason)
          this.isConnecting = false
          this.isAuthenticated = false
          this.scheduleReconnect()
        }
      } catch (err) {
        console.error("[v0] ❌ Erreur lors de la création du WebSocket:", err)
        this.isConnecting = false
        this.isAuthenticated = false
        reject(err)
      }
    })
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = setTimeout(() => {
      if (this.token && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
        console.log("[v0] 🔄 Tentative de reconnexion WebSocket...")
        this.connect(this.token).catch((err) => {
          console.error("[v0] ❌ Échec de reconnexion:", err)
        })
      }
    }, 5000)
  }

  private handleMessage(message: any) {
    console.log("[v0] 🔍 Traitement du message. subscriptionId:", message.subscriptionId)

    if (message.subscriptionId !== undefined) {
      const callback = this.callbacks.get(message.subscriptionId)
      console.log("[v0] Callback trouvé:", !!callback)

      if (callback && message.data) {
        console.log("[v0] 📢 Appel du callback avec les données:", message.data)
        const update: DeviceUpdate = {
          deviceId: message.data.entityId || "",
          data: message.data,
        }
        callback(update)
      }
    }
  }

  subscribeToDevice(deviceId: string, callback: UpdateCallback): number {
    const cmdId = ++this.cmdId
    const subscriptionId = cmdId

    console.log("[v0] 📡 Souscription au dispositif:", deviceId, "avec cmdId:", cmdId)

    this.subscriptions.set(deviceId, subscriptionId)
    this.callbacks.set(subscriptionId, callback)

    // Souscrire à la télémétrie ET aux attributs
    const command = {
      tsSubCmds: [
        {
          entityType: "DEVICE",
          entityId: deviceId,
          scope: "LATEST_TELEMETRY",
          cmdId: cmdId,
        },
      ],
      historyCmds: [],
      attrSubCmds: [
        {
          entityType: "DEVICE",
          entityId: deviceId,
          scope: "SERVER_SCOPE",
          cmdId: cmdId + 1000, // ID différent pour les attributs
        },
      ],
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("[v0] 📤 Envoi de la commande de souscription:", JSON.stringify(command, null, 2))
      this.ws.send(JSON.stringify(command))

      // Callback pour les attributs aussi
      this.callbacks.set(cmdId + 1000, callback)
    } else {
      console.error("[v0] ❌ WebSocket non connecté (état:", this.ws?.readyState, "), impossible de souscrire")
    }

    return subscriptionId
  }

  unsubscribe(subscriptionId: number) {
    console.log("[v0] 🔕 Désinscription de la souscription:", subscriptionId)
    this.callbacks.delete(subscriptionId)
    this.callbacks.delete(subscriptionId + 1000) // Supprimer aussi le callback des attributs

    const command = {
      tsSubCmds: [],
      historyCmds: [],
      attrSubCmds: [],
      unsubscribe: {
        cmdId: subscriptionId,
      },
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(command))
    }
  }

  disconnect() {
    console.log("[v0] 🔌 Déconnexion du WebSocket")

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.subscriptions.clear()
    this.callbacks.clear()
    this.token = null
    this.isAuthenticated = false
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.isAuthenticated
  }
}

export const thingsboardWS = new ThingsboardWebSocket()
