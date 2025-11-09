import { AlertPanel } from "@/components/alert-panel"
import { AlertStats } from "@/components/alert-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
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
                <h1 className="text-2xl font-bold text-foreground">Gestion des Alertes</h1>
                <p className="text-sm text-muted-foreground">Surveiller et gérer les alertes système</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistiques */}
        <AlertStats />

        {/* Filtres */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher des alertes..." className="pl-9" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>

        {/* Panneau d'alertes */}
        <AlertPanel />
      </main>
    </div>
  )
}
