"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Topbar } from "@/components/topbar"
import { healthcheck } from "@/lib/api"
import { type HealthcheckResponse } from "@/lib/types"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [health, setHealth] = useState<HealthcheckResponse | null>(null)

  useEffect(() => {
    healthcheck()
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  return (
    <AppSidebar>
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Topbar
            title="Afor Health"
            subtitle="Pilotage du modèle temps réel"
            latencyMs={health?.latency_ms}
          />
          <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-6 py-6 md:px-6">
            {children}
          </div>
        </div>
      </AuthGuard>
    </AppSidebar>
  )
}
