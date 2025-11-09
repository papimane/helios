"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeviceStorage, type RegisteredDevice } from "@/lib/device-storage"
import { Plus, Trash2, Edit, Lock, Camera, Battery, Radio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [devices, setDevices] = useState<RegisteredDevice[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<RegisteredDevice | null>(null)
  const { toast } = useToast()

  // Formulaire
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "padlock" as RegisteredDevice["type"],
    label: "",
    streamUrl: "",
  })

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = () => {
    setDevices(DeviceStorage.getDevices())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id || !formData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingDevice) {
        DeviceStorage.updateDevice(editingDevice.id, formData)
        toast({
          title: "Dispositif mis à jour",
          description: `${formData.name} a été mis à jour avec succès`,
        })
      } else {
        DeviceStorage.addDevice(formData)
        toast({
          title: "Dispositif ajouté",
          description: `${formData.name} a été ajouté avec succès`,
        })
      }

      loadDevices()
      resetForm()
      setIsAddDialogOpen(false)
      setEditingDevice(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dispositif ?")) {
      DeviceStorage.deleteDevice(id)
      loadDevices()
      toast({
        title: "Dispositif supprimé",
        description: "Le dispositif a été supprimé avec succès",
      })
    }
  }

  const handleEdit = (device: RegisteredDevice) => {
    setEditingDevice(device)
    setFormData({
      id: device.id,
      name: device.name,
      type: device.type,
      label: device.label || "",
      streamUrl: device.streamUrl || "",
    })
    setIsAddDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      type: "padlock",
      label: "",
      streamUrl: "",
    })
    setEditingDevice(null)
  }

  const getTypeIcon = (type: RegisteredDevice["type"]) => {
    switch (type) {
      case "padlock":
        return <Lock className="h-4 w-4" />
      case "camera":
        return <Camera className="h-4 w-4" />
      case "battery":
        return <Battery className="h-4 w-4" />
      case "proximity":
        return <Radio className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: RegisteredDevice["type"]) => {
    switch (type) {
      case "padlock":
        return "Cadenas"
      case "camera":
        return "Caméra"
      case "battery":
        return "Batterie"
      case "proximity":
        return "Détecteur de proximité"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration des Dispositifs</h1>
              <p className="text-muted-foreground mt-1">
                Gérez les UUIDs des dispositifs connectés à la plateforme Thingsboard
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un dispositif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDevice ? "Modifier le dispositif" : "Ajouter un nouveau dispositif"}
                  </DialogTitle>
                  <DialogDescription>
                    Renseignez l'UUID du dispositif depuis la plateforme Thingsboard
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="uuid">UUID du dispositif *</Label>
                      <Input
                        id="uuid"
                        placeholder="825eef50-a5ec-11f0-9246-c1ecb24ecd0b"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        disabled={!!editingDevice}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du dispositif *</Label>
                      <Input
                        id="name"
                        placeholder="Cadenas Site A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de dispositif *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padlock">Cadenas</SelectItem>
                          <SelectItem value="camera">Caméra</SelectItem>
                          <SelectItem value="battery">Batterie</SelectItem>
                          <SelectItem value="proximity">Détecteur de proximité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.type === "camera" && (
                      <div className="space-y-2">
                        <Label htmlFor="streamUrl">URL du flux vidéo</Label>
                        <Input
                          id="streamUrl"
                          placeholder="https://www.youtube.com/watch?v=... ou URL directe"
                          value={formData.streamUrl}
                          onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Entrez l'URL d'un flux YouTube, d'une vidéo directe ou d'un stream RTSP
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="label">Label (optionnel)</Label>
                      <Input
                        id="label"
                        placeholder="Description supplémentaire"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">{editingDevice ? "Mettre à jour" : "Ajouter"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dispositifs enregistrés</CardTitle>
              <CardDescription>
                {devices.length} dispositif{devices.length !== 1 ? "s" : ""} enregistré{devices.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucun dispositif enregistré</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier dispositif
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>UUID</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Ajouté le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(device.type)}
                            <span className="text-sm">{getTypeLabel(device.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell className="font-mono text-xs">{device.id}</TableCell>
                        <TableCell className="text-muted-foreground">{device.label || "-"}</TableCell>
                        <TableCell>{new Date(device.addedAt).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(device)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(device.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
