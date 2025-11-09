// Mapper pour convertir les dispositifs Thingsboard en types de l'application

import type { ThingsboardDevice } from "./thingsboard-api"
import type { Padlock, Battery, Camera } from "./types"

export function mapThingsboardDeviceToPadlock(device: ThingsboardDevice, telemetry?: any): Padlock {
  return {
    id: device.id.id,
    siteId: device.customerId.id,
    name: device.label || device.name,
    status: telemetry?.locked ? "locked" : "unlocked",
    batteryLevel: telemetry?.battery || 100,
    location: device.label || "Non spécifié",
    lastOpened: telemetry?.lastOpened ? new Date(telemetry.lastOpened) : undefined,
    openedBy: telemetry?.openedBy,
  }
}

export function mapThingsboardDeviceToBattery(device: ThingsboardDevice, telemetry?: any): Battery {
  return {
    id: device.id.id,
    siteId: device.customerId.id,
    name: device.label || device.name,
    status: telemetry?.status || "in-service",
    location: {
      lat: telemetry?.latitude || 0,
      lng: telemetry?.longitude || 0,
    },
    batteryLevel: telemetry?.battery || 100,
    temperature: telemetry?.temperature || 20,
    lastUpdate: new Date(device.createdTime),
  }
}

export function mapThingsboardDeviceToCamera(device: ThingsboardDevice, telemetry?: any): Camera {
  return {
    id: device.id.id,
    siteId: device.customerId.id,
    name: device.label || device.name,
    streamUrl: telemetry?.streamUrl || "",
    status: telemetry?.active ? "active" : "inactive",
    location: device.label || "Non spécifié",
  }
}

export function getDeviceTypeFromThingsboard(type: string): "padlock" | "battery" | "camera" | "proximity" | "unknown" {
  const lowerType = type.toLowerCase()

  if (lowerType.includes("cadenas") || lowerType.includes("lock") || lowerType.includes("bouton")) {
    return "padlock"
  }
  if (lowerType.includes("batterie") || lowerType.includes("battery")) {
    return "battery"
  }
  if (lowerType.includes("caméra") || lowerType.includes("camera")) {
    return "camera"
  }
  if (lowerType.includes("proximité") || lowerType.includes("proximity") || lowerType.includes("détecteur")) {
    return "proximity"
  }

  return "unknown"
}
