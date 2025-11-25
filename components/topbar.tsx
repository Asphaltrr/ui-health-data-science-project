"use client"

import { useMemo } from "react"
import { Bell, Circle } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

type TopbarProps = {
  title?: string
  subtitle?: string
  latencyMs?: number
}

export function Topbar({ title, subtitle, latencyMs }: TopbarProps) {
  const statusTone = useMemo(() => {
    if (latencyMs == null || Number.isNaN(latencyMs))
      return "bg-muted-foreground/50"
    if (latencyMs < 120) return "bg-emerald-400"
    if (latencyMs < 250) return "bg-amber-400"
    return "bg-red-500"
  }, [latencyMs])

  return (
    <header className="backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-20 flex items-center gap-4 border-b px-4 py-3">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{title ?? "Pilotage IA"}</span>
        {subtitle ? (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border px-3 py-1.5 md:flex">
          <Circle className={`size-2.5 rounded-full ${statusTone}`} />
          <span className="text-xs text-muted-foreground">
            Latence{" "}
            {latencyMs == null || Number.isNaN(latencyMs)
              ? "NaN ms"
              : `${latencyMs} ms`}
          </span>
        </div>
        <div className="hidden md:flex">
          <Input
            placeholder="Rechercher un patient..."
            className="w-60 rounded-full bg-muted/30 px-4"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border px-2 py-1">
          <div className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold">
            AF
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Clinicien
          </span>
        </div>
      </div>
    </header>
  )
}
