// Gestion du stockage local des dispositifs enregistrés

export interface RegisteredDevice {
  id: string // UUID du dispositif Thingsboard
  name: string
  type: "padlock" | "camera" | "battery" | "proximity"
  label?: string
  streamUrl?: string // URL du flux vidéo (YouTube, direct stream, etc.)
  addedAt: number
}

const STORAGE_KEY = "helios_registered_devices"

export class DeviceStorage {
  static getDevices(): RegisteredDevice[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static addDevice(device: Omit<RegisteredDevice, "addedAt">): void {
    const devices = this.getDevices()
    const newDevice: RegisteredDevice = {
      ...device,
      addedAt: Date.now(),
    }
    devices.push(newDevice)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
  }

  static updateDevice(id: string, updates: Partial<RegisteredDevice>): void {
    const devices = this.getDevices()
    const index = devices.findIndex((d) => d.id === id)
    if (index !== -1) {
      devices[index] = { ...devices[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
    }
  }

  static deleteDevice(id: string): void {
    const devices = this.getDevices()
    const filtered = devices.filter((d) => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  static getDeviceIds(): string[] {
    return this.getDevices().map((d) => d.id)
  }

  static getDevicesByType(type: RegisteredDevice["type"]): RegisteredDevice[] {
    return this.getDevices().filter((d) => d.type === type)
  }
}
