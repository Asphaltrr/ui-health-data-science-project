"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"

const STORAGE_KEY = "afor-auth"

export function setAuthSession(username: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ username, ts: Date.now() })
  )
}

function getAuthSession() {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getAuthSession()
    if (!session) {
      router.replace("/login")
    } else {
      const timer = window.setTimeout(() => setReady(true), 0)
      return () => window.clearTimeout(timer)
    }
  }, [router])

  if (pathname === "/login") return <>{children}</>
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-3 px-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
