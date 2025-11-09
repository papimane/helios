// Mock data for the Helios security monitoring system

export interface Site {
  id: string
  name: string
  location: string
  status: "normal" | "warning" | "critical"
  coordinates: { lat: number; lng: number }
  devices: {
    padlocks: number
    cameras: number
    batteries: number
    proximityDetectors: number
  }
}

export interface Padlock {
  id: string
  siteId: string
  name: string
  status: "locked" | "unlocked" | "tampered" | "offline"
  battery: number
  lastActivity: string
  location: string
}

export interface Camera {
  id: string
  siteId: string
  name: string
  status: "online" | "offline" | "recording"
  feed: string
  lastMotion: string | null
}

export interface Battery {
  id: string
  siteId: string
  name: string
  charge: number
  status: "normal" | "low" | "critical"
  location: { lat: number; lng: number }
  lastUpdate: string
}

export interface ProximityDetector {
  id: string
  siteId: string
  name: string
  status: "clear" | "detected" | "offline"
  lastDetection: string | null
  sensitivity: number
}

export interface Alert {
  id: string
  siteId: string
  type: "padlock" | "camera" | "battery" | "proximity"
  severity: "info" | "warning" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

export const sites: Site[] = [
  {
    id: "site-1",
    name: "North Warehouse",
    location: "Building A, Floor 1",
    status: "normal",
    coordinates: { lat: 40.7128, lng: -74.006 },
    devices: { padlocks: 8, cameras: 4, batteries: 12, proximityDetectors: 6 },
  },
  {
    id: "site-2",
    name: "South Storage",
    location: "Building B, Floor 2",
    status: "warning",
    coordinates: { lat: 40.758, lng: -73.9855 },
    devices: { padlocks: 6, cameras: 3, batteries: 8, proximityDetectors: 4 },
  },
  {
    id: "site-3",
    name: "East Facility",
    location: "Building C, Floor 1",
    status: "critical",
    coordinates: { lat: 40.7489, lng: -73.968 },
    devices: { padlocks: 10, cameras: 5, batteries: 15, proximityDetectors: 8 },
  },
  {
    id: "site-4",
    name: "West Complex",
    location: "Building D, Floor 3",
    status: "normal",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    devices: { padlocks: 5, cameras: 2, batteries: 7, proximityDetectors: 3 },
  },
]

export const padlocks: Padlock[] = [
  {
    id: "pl-1",
    siteId: "site-1",
    name: "Main Entrance",
    status: "locked",
    battery: 85,
    lastActivity: "2 hours ago",
    location: "Door A1",
  },
  {
    id: "pl-2",
    siteId: "site-1",
    name: "Storage Room 1",
    status: "locked",
    battery: 92,
    lastActivity: "5 hours ago",
    location: "Room 101",
  },
  {
    id: "pl-3",
    siteId: "site-2",
    name: "Loading Bay",
    status: "unlocked",
    battery: 45,
    lastActivity: "10 minutes ago",
    location: "Bay 3",
  },
  {
    id: "pl-4",
    siteId: "site-3",
    name: "Server Room",
    status: "tampered",
    battery: 12,
    lastActivity: "1 minute ago",
    location: "Room 305",
  },
  {
    id: "pl-5",
    siteId: "site-1",
    name: "Emergency Exit",
    status: "locked",
    battery: 78,
    lastActivity: "1 day ago",
    location: "Exit B",
  },
  {
    id: "pl-6",
    siteId: "site-2",
    name: "Equipment Storage",
    status: "offline",
    battery: 0,
    lastActivity: "3 days ago",
    location: "Room 205",
  },
]

export const cameras: Camera[] = [
  {
    id: "cam-1",
    siteId: "site-1",
    name: "Entrance Camera",
    status: "recording",
    feed: "/placeholder.svg?height=200&width=300",
    lastMotion: "5 minutes ago",
  },
  {
    id: "cam-2",
    siteId: "site-1",
    name: "Hallway Camera",
    status: "online",
    feed: "/placeholder.svg?height=200&width=300",
    lastMotion: "1 hour ago",
  },
  {
    id: "cam-3",
    siteId: "site-2",
    name: "Loading Dock",
    status: "recording",
    feed: "/placeholder.svg?height=200&width=300",
    lastMotion: "2 minutes ago",
  },
  {
    id: "cam-4",
    siteId: "site-3",
    name: "Perimeter Camera",
    status: "offline",
    feed: "/placeholder.svg?height=200&width=300",
    lastMotion: null,
  },
]

export const batteries: Battery[] = [
  {
    id: "bat-1",
    siteId: "site-1",
    name: "Battery Pack A1",
    charge: 95,
    status: "normal",
    location: { lat: 40.7128, lng: -74.006 },
    lastUpdate: "5 minutes ago",
  },
  {
    id: "bat-2",
    siteId: "site-2",
    name: "Battery Pack B2",
    charge: 45,
    status: "low",
    location: { lat: 40.758, lng: -73.9855 },
    lastUpdate: "10 minutes ago",
  },
  {
    id: "bat-3",
    siteId: "site-3",
    name: "Battery Pack C3",
    charge: 15,
    status: "critical",
    location: { lat: 40.7489, lng: -73.968 },
    lastUpdate: "2 minutes ago",
  },
  {
    id: "bat-4",
    siteId: "site-1",
    name: "Battery Pack A2",
    charge: 88,
    status: "normal",
    location: { lat: 40.713, lng: -74.0065 },
    lastUpdate: "8 minutes ago",
  },
]

export const proximityDetectors: ProximityDetector[] = [
  { id: "prox-1", siteId: "site-1", name: "Zone A Detector", status: "clear", lastDetection: null, sensitivity: 75 },
  {
    id: "prox-2",
    siteId: "site-2",
    name: "Zone B Detector",
    status: "detected",
    lastDetection: "30 seconds ago",
    sensitivity: 80,
  },
  {
    id: "prox-3",
    siteId: "site-3",
    name: "Zone C Detector",
    status: "detected",
    lastDetection: "1 minute ago",
    sensitivity: 90,
  },
  {
    id: "prox-4",
    siteId: "site-1",
    name: "Zone A2 Detector",
    status: "offline",
    lastDetection: "2 days ago",
    sensitivity: 70,
  },
]

export const alerts: Alert[] = [
  {
    id: "alert-1",
    siteId: "site-3",
    type: "padlock",
    severity: "critical",
    message: "Tamper detected on Server Room padlock",
    timestamp: "1 minute ago",
    acknowledged: false,
  },
  {
    id: "alert-2",
    siteId: "site-3",
    type: "battery",
    severity: "critical",
    message: "Battery Pack C3 critically low (15%)",
    timestamp: "2 minutes ago",
    acknowledged: false,
  },
  {
    id: "alert-3",
    siteId: "site-2",
    type: "proximity",
    severity: "warning",
    message: "Motion detected in Zone B",
    timestamp: "30 seconds ago",
    acknowledged: false,
  },
  {
    id: "alert-4",
    siteId: "site-2",
    type: "padlock",
    severity: "warning",
    message: "Low battery on Loading Bay padlock (45%)",
    timestamp: "15 minutes ago",
    acknowledged: true,
  },
  {
    id: "alert-5",
    siteId: "site-3",
    type: "camera",
    severity: "warning",
    message: "Perimeter Camera offline",
    timestamp: "1 hour ago",
    acknowledged: true,
  },
]
