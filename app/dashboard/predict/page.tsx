"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { PatientForm } from "@/components/patient-form"
import { PredictionResult } from "@/components/prediction-result"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { predictPatient } from "@/lib/api"
import { type PatientFormValues } from "@/lib/patient"
import { type PredictionResponse } from "@/lib/types"

export default function PredictPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: PatientFormValues) => {
    setError(null)
    try {
      const res = await predictPatient(values)
      setResult(res)
    } catch (err) {
      console.error(err)
      setError("API indisponible, aucune donnée affichée.")
      setResult(null)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Patient Input</CardTitle>
          <CardDescription>
            Formulaire complet validé avec react-hook-form + zod
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientForm
            onSubmit={handleSubmit}
            submitLabel="Prédire"
            loadingLabel="Appel API..."
          />
          {error ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-400">
              <AlertCircle className="size-4" />
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <div className="xl:col-span-2 space-y-4">
        <PredictionResult result={result} />
        <Card>
          <CardHeader>
            <CardTitle>Pattern clinique</CardTitle>
            <CardDescription>
              Les seuils métiers sont appliqués côté API.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">Loader dédié pendant l&apos;appel</Badge>
            <Badge variant="outline">Badge vert/rouge automatique</Badge>
            <Badge variant="outline">Jauge Recharts</Badge>
            <Badge variant="outline">Feature importance</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
