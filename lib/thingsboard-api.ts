// Client API pour la plateforme Thingsboard IoKub

const API_BASE_URL = "https://platform.iokub.com:443/api"

export interface ThingsboardDevice {
  id: {
    entityType: string
    id: string
  }
  createdTime: number
  tenantId: {
    entityType: string
    id: string
  }
  customerId: {
    entityType: string
    id: string
  }
  name: string
  type: string
  label: string
  deviceProfileId: {
    entityType: string
    id: string
  }
  deviceData: {
    configuration: { type: string }
    transportConfiguration: { type: string }
  }
}

export interface ThingsboardAuthResponse {
  token: string
  refreshToken: string
}

class ThingsboardAPI {
  private token: string | null = null

  private getToken(): string {
    // Vérifier si on a un token en mémoire
    if (this.token) {
      return this.token
    }

    // Essayer de récupérer depuis localStorage
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("thingsboard_token")
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }

    // Si aucun token n'est trouvé, lever une erreur
    throw new Error("Non authentifié - veuillez vous connecter")
  }

  private handleUnauthorized(): void {
    this.logout()
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=true"
    }
  }

  async login(username: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error("Échec de l'authentification")
    }

    const data: ThingsboardAuthResponse = await response.json()
    this.token = data.token

    // Stocker le token dans localStorage pour persistance
    if (typeof window !== "undefined") {
      localStorage.setItem("thingsboard_token", data.token)
    }

    return data.token
  }

  async getDevices(deviceIds?: string[]): Promise<ThingsboardDevice[]> {
    const token = this.getToken()

    let idsToFetch = deviceIds
    if (!idsToFetch || idsToFetch.length === 0) {
      // Importer dynamiquement pour éviter les problèmes SSR
      if (typeof window !== "undefined") {
        const { DeviceStorage } = await import("./device-storage")
        idsToFetch = DeviceStorage.getDeviceIds()
      }
    }

    let url = `${API_BASE_URL}/devices`
    if (idsToFetch && idsToFetch.length > 0) {
      url += `?deviceIds=${idsToFetch.join("%2C")}`
    }

    console.log("[v0] API URL:", url)
    console.log("[v0] Device IDs à récupérer:", idsToFetch)

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] Statut de la réponse API:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erreur API - Statut:", response.status, "Réponse:", errorText)

        if (response.status === 401) {
          console.log("[v0] Token expiré, nettoyage et redirection...")
          this.handleUnauthorized()
          throw new Error("Session expirée")
        }
        throw new Error(`Échec de récupération des dispositifs (${response.status})`)
      }

      const data = await response.json()
      console.log("[v0] Dispositifs récupérés:", data)
      return data
    } catch (error) {
      console.error("[v0] Erreur lors de l'appel API:", error)
      throw error
    }
  }

  async getDeviceById(deviceId: string): Promise<ThingsboardDevice> {
    const token = this.getToken()

    const response = await fetch(`${API_BASE_URL}/device/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error("Session expirée - redirection vers la page de connexion")
      }
      throw new Error("Échec de récupération du dispositif")
    }

    return response.json()
  }

  async getDeviceTelemetry(deviceId: string, keys: string[]): Promise<any> {
    const token = this.getToken()

    const keysParam = keys.join(",")
    const response = await fetch(
      `${API_BASE_URL}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keysParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error("Session expirée - redirection vers la page de connexion")
      }
      throw new Error("Échec de récupération de la télémétrie")
    }

    return response.json()
  }

  async getDeviceAttributes(deviceId: string): Promise<any> {
    const token = this.getToken()

    const response = await fetch(`${API_BASE_URL}/plugins/telemetry/DEVICE/${deviceId}/values/attributes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error("Session expirée - redirection vers la page de connexion")
      }
      throw new Error("Échec de récupération des attributs")
    }

    return response.json()
  }

  logout(): void {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("thingsboard_token")
    }
  }
}

export const thingsboardAPI = new ThingsboardAPI()
