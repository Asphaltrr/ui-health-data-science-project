"use client"

import { useState } from "react"
import { AlertCircle, Sparkle } from "lucide-react"

import { ExplainResult } from "@/components/explain-result"
import { PatientForm } from "@/components/patient-form"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { explainPatient } from "@/lib/api"
import { type PatientFormValues } from "@/lib/patient"
import { type ExplainResponse } from "@/lib/types"

export default function ExplainPage() {
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: PatientFormValues) => {
    setError(null)
    setLoading(true)
    try {
      const res = await explainPatient(values)
      setResult(res)
    } catch (err) {
      console.error(err)
      setError("API indisponible, aucune explication affichée.")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Explication locale</CardTitle>
            <CardDescription>
              Formulaire identique à la prédiction pour cohérence des features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientForm
              onSubmit={handleSubmit}
              submitLabel="Expliquer"
              loadingLabel="Génération SHAP..."
            />
            {error ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="size-4" />
                {error}
              </div>
            ) : null}
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          <ExplainResult data={result} loading={loading} />
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>UX moderne</CardTitle>
                <CardDescription>Waterfall + tri automatique</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Sparkle className="size-3.5" />
                SHAP-like
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              La liste triée des features est synchronisée avec le graphique.
              Les erreurs sont gérées sans fallback : seules les données réelles
              sont rendues.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
