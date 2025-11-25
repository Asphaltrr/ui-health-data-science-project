"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { type ExplainResponse } from "@/lib/types"

type ExplainResultProps = {
  data?: ExplainResponse | null
  loading?: boolean
}

export function ExplainResult({ data, loading }: ExplainResultProps) {
  const shapData =
    data?.contributions
      ? Object.entries(data.contributions)
          .map(([feature, value]) => ({
            feature,
            value,
            impact: Math.abs(value),
          }))
          .sort((a, b) => b.impact - a.impact)
          .slice(0, 12)
      : []

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Explication locale</CardTitle>
          <CardDescription>
            Décomposition du score par variable (SHAP-like)
          </CardDescription>
        </div>
        <Badge variant="outline">Top {shapData.length} features</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        ) : shapData.length ? (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart
                data={shapData}
                layout="vertical"
                margin={{ left: 80, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="feature" width={120} />
                <Tooltip
                  formatter={(value: number) => value.toFixed(3)}
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                />
                <Bar dataKey="value" radius={6} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Envoyez des données patient pour visualiser l&apos;explication locale
            du modèle.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
