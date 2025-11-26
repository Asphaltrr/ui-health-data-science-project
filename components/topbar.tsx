"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, Circle, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { ThemeToggle } from "@/components/theme-toggle"
import { clearAuthSession } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

type TopbarProps = {
  title?: string
  subtitle?: string
  latencyMs?: number
}

export function Topbar({ title, subtitle, latencyMs }: TopbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [userLabel, setUserLabel] = useState("Utilisateur")

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("afor-auth")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.username) {
          const timer = window.setTimeout(
            () => setUserLabel(parsed.username),
            0
          )
          return () => window.clearTimeout(timer)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])
  const statusTone = useMemo(() => {
    if (latencyMs == null || Number.isNaN(latencyMs))
      return "bg-muted-foreground/50"
    if (latencyMs < 120) return "bg-emerald-400"
    if (latencyMs < 250) return "bg-amber-400"
    return "bg-red-500"
  }, [latencyMs])

  const routeTitle = useMemo(() => {
    if (!pathname) return "Pilotage IA"
    if (pathname.startsWith("/dashboard/predict")) return "Prédiction"
    if (pathname.startsWith("/dashboard/explain")) return "Explication"
    if (pathname.startsWith("/dashboard/history")) return "Historique"
    if (pathname.startsWith("/dashboard/monitoring")) return "Monitoring"
    if (pathname.startsWith("/dashboard")) return "Tableau de bord"
    return title ?? "Pilotage IA"
  }, [pathname, title])

  return (
    <header className="backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 border-b">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4 px-4 py-3">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{routeTitle}</span>
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
          {/* <div className="hidden md:flex">
            <Input
              placeholder="Rechercher un patient..."
              className="w-60 rounded-full bg-muted/30 px-4"
            />
          </div> */}
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-muted text-foreground/80 hover:bg-muted/80 flex size-9 items-center justify-center rounded-full text-xs font-semibold transition">
                {userLabel.slice(0, 2).toUpperCase()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{userLabel}</span>
                <span className="text-xs text-muted-foreground">
                  Session active
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clearAuthSession()
                  router.replace("/login")
                }}
              >
                <LogOut className="size-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
