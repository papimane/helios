export type SiteStatus = "normal" | "warning" | "critical" | "offline"
export type PadlockStatus = "locked" | "unlocked" | "alarm" | "low-battery"
export type ProximityStatus = "clear" | "detected" | "alarm"
export type BatteryStatus = "in-service" | "moving" | "out-of-zone" | "signal-lost"

export interface Site {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  status: SiteStatus
  address: string
  padlockCount: number
  batteryCount: number
  cameraCount: number
  lastUpdate: Date
}

export interface Padlock {
  id: string
  siteId: string
  name: string
  status: PadlockStatus
  lastOpened?: Date
  openedBy?: string
  batteryLevel: number
  location: string
}

export interface ProximityEvent {
  id: string
  siteId: string
  detectionType: "motion" | "bluetooth" | "radar"
  status: ProximityStatus
  intensity: number
  duration: number
  timestamp: Date
  location: string
}

export interface Battery {
  id: string
  siteId: string
  name: string
  status: BatteryStatus
  location: {
    lat: number
    lng: number
  }
  batteryLevel: number
  temperature: number
  lastUpdate: Date
}

export interface Camera {
  id: string
  siteId: string
  name: string
  streamUrl: string
  status: "active" | "inactive" | "alarm"
  location: string
}

export interface Alert {
  id: string
  siteId: string
  type: "padlock" | "proximity" | "battery" | "camera"
  severity: "info" | "warning" | "critical"
  title: string
  message: string
  timestamp: Date
  acknowledged: boolean
  relatedEntityId: string
}

export interface Event {
  id: string
  siteId: string
  type: "padlock-opened" | "proximity-detected" | "battery-moved" | "camera-triggered"
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}
