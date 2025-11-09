"use client"

import { CameraFeed } from "@/components/camera-feed"

interface CameraDevice {
  id: string
  name: string
  status: "recording" | "online" | "offline"
  location: string
  lastActivity: string
  siteId: string
  streamUrl?: string // Ajout du champ streamUrl
}

interface CameraGridProps {
  cameras: CameraDevice[]
}

export function CameraGrid({ cameras }: CameraGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cameras.map((camera) => (
        <CameraFeed key={camera.id} camera={camera} />
      ))}
    </div>
  )
}
