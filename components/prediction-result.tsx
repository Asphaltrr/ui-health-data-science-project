import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProbabilityGauge } from "@/components/charts/probability-gauge"
import { type PredictionResponse } from "@/lib/types"

type PredictionResultProps = {
  result?: PredictionResponse | null
}

export function PredictionResult({ result }: PredictionResultProps) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>
            Lancez une prédiction pour visualiser le risque patient.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Le statut, les probabilités et les variables influentes s&apos;afficheront
          ici. Les données sont présentées avec une jauge et un top-features.
        </CardContent>
      </Card>
    )
  }

  const isSurvival = result.prediction === 1 || result.proba_survie >= 0.5

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Résultat IA</CardTitle>
          <CardDescription>Inférence en temps réel du modèle</CardDescription>
        </div>
        <Badge
          variant={isSurvival ? "default" : "outline"}
          className={isSurvival ? "bg-emerald-500 text-emerald-950" : ""}
        >
          {isSurvival ? "Survie probable" : "Risque élevé"}
        </Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between pb-3 text-sm text-muted-foreground">
            <span>Probabilités</span>
            <span>
              Survie {Math.round(result.proba_survie * 100)}% / Décès{" "}
              {Math.round(result.proba_deces * 100)}%
            </span>
          </div>
          <ProbabilityGauge
            survival={result.proba_survie}
            death={result.proba_deces}
          />
        </div>
        <div className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Top features (backend)</div>
              <div className="text-xs text-muted-foreground">
                Classement tel que renvoyé par l&apos;API
              </div>
            </div>
            <Badge variant="secondary">{result.top_features.length} clés</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.top_features.map((feat) => (
              <Badge key={feat} variant="outline">
                {feat}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
