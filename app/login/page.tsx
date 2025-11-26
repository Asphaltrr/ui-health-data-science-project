"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, User } from "lucide-react"

import { setAuthSession } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const expectedUser = process.env.NEXT_PUBLIC_AUTH_USER
  const expectedPass = process.env.NEXT_PUBLIC_AUTH_PASS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expectedUser || !expectedPass) {
      setError("Identifiants non configurés (variables NEXT_PUBLIC_AUTH_* manquantes).")
      return
    }
    if (username === expectedUser && password === expectedPass) {
      setAuthSession(username)
      router.replace("/dashboard")
    } else {
      setError("Identifiants invalides.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="size-4" /> Nom d&apos;utilisateur
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="size-4" /> Mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
            {error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : null}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
