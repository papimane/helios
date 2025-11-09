"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { StatsOverview } from "@/components/stats-overview"
import { SiteMap } from "@/components/site-map"
import { RecentAlerts } from "@/components/recent-alerts"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Contenu Principal */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Vue d'ensemble des statistiques */}
          <StatsOverview />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Link href="/padlocks">
              <Button variant="outline" className="w-full bg-transparent">
                Voir Cadenas
              </Button>
            </Link>
            <Link href="/cameras">
              <Button variant="outline" className="w-full bg-transparent">
                Voir Caméras
              </Button>
            </Link>
            <Link href="/batteries">
              <Button variant="outline" className="w-full bg-transparent">
                Voir Batteries
              </Button>
            </Link>
            <Link href="/proximity">
              <Button variant="outline" className="w-full bg-transparent">
                Voir Détecteurs
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="default" className="w-full">
                Administration
              </Button>
            </Link>
          </div>

          {/* Carte des sites et alertes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Vue d'ensemble des Sites</h2>
              <SiteMap />
            </div>
            <div>
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
