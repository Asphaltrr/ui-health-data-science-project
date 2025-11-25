"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { StatCard } from "@/components/stat-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getHistory, getMonitoring } from "@/lib/api"
import { type HistoryItem, type MonitoringData } from "@/lib/types"

export default function MonitoringPage() {
  const [monitoring, setMonitoring] = useState<MonitoringData | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [mon, hist] = await Promise.all([getMonitoring(), getHistory()])
        setMonitoring(mon)
        setHistory(hist)
      } catch (error) {
        console.error(error)
        setMonitoring(null)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const monitoringData = monitoring
  const historyData = history

  const predictionsPerDay = useMemo(() => {
    const map = new Map<string, { date: string; predictions: number }>()
    const perDay = monitoringData?.predictions_per_day ?? {}
    Object.entries(perDay).forEach(([date, count]) => {
      map.set(date, { date, predictions: count })
    })
    if (map.size === 0) {
      historyData.forEach((item) => {
        const date = item.timestamp.slice(0, 10)
        const entry = map.get(date) ?? { date, predictions: 0 }
        entry.predictions += 1
        map.set(date, entry)
      })
    }
    return Array.from(map.values()).sort((a, b) =>
      a.date > b.date ? 1 : -1
    )
  }, [monitoringData, historyData])

  const distribution = useMemo(() => {
    const rate = monitoringData?.class_rate ?? {}
    const survie = Number(rate["1"] ?? 0)
    const deces = Number(rate["0"] ?? 0)
    const total = survie + deces
    const surviePercent =
      total > 0 && Number.isFinite(total)
        ? Math.round((survie / total) * 100)
        : 0
    const decesPercent =
      total > 0 && Number.isFinite(total)
        ? Math.round((deces / total) * 100)
        : 0
    return [
      {
        name: "Survie",
        value: survie,
        percent: surviePercent,
      },
      {
        name: "Décès",
        value: deces,
        percent: decesPercent,
      },
    ]
  }, [monitoringData])

  const variableStats = useMemo(
    () =>
      Object.entries(monitoringData?.feature_stats_live ?? {}).map(
        ([feature, stat]) => ({
          feature,
          mean: stat.mean ?? 0,
          std: stat.std ?? 0,
        })
      ),
    [monitoringData]
  )

  const formatNumber = (value?: number | null, fraction?: number) => {
    if (value == null || Number.isNaN(value)) return "NaN"
    if (!Number.isFinite(value)) return "NaN"
    return fraction != null ? value.toFixed(fraction) : value
  }

  const rolling14 = predictionsPerDay.length
    ? predictionsPerDay
        .slice(-14)
        .reduce((acc, item) => acc + item.predictions, 0)
    : 0

  const driftValue = useMemo(() => {
    const values = Object.values(monitoringData?.feature_drift_psi ?? {}).filter(
      (val): val is number => val !== null && Number.isFinite(val)
    )
    if (!values.length) return 0
    return values.reduce((acc, val) => acc + val, 0) / values.length
  }, [monitoringData])

  const driftPercentage = Number.isFinite(driftValue) ? driftValue * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Volume total"
          value={formatNumber(monitoringData?.n_predictions ?? 0)}
          description="Prédictions cumulées"
        />
        <StatCard
          title="Drift score"
          value={formatNumber(driftValue, 2)}
          description="PSI moyen feature"
        />
        <StatCard
          title="Classe majoritaire"
          value={
            Number.isFinite(distribution[0].value) &&
            Number.isFinite(distribution[1].value)
              ? distribution[0].value > distribution[1].value
                ? "Survie"
                : "Décès"
              : "N/A"
          }
          description={`${distribution[0].percent}% / ${distribution[1].percent}%`}
        />
        <StatCard
          title="Fenêtre rolling 14j"
          value={`${formatNumber(rolling14)} préd.`}
          description="Charges quotidiennes"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Prédictions par jour</CardTitle>
            <CardDescription>
              Courbe lissée pour détecter les pics de charge
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <AreaChart data={predictionsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="predictions"
                    stroke="#22c55e"
                    fill="url(#predictionsGradient)"
                    strokeWidth={2.2}
                  />
                  <defs>
                    <linearGradient
                      id="predictionsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drift en production</CardTitle>
            <CardDescription>
              Alertes seuils 0.3 / 0.6 / 0.8
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Score global</span>
              <span>{formatNumber(driftPercentage)}%</span>
            </div>
            <Progress
              value={Number.isFinite(driftPercentage) ? driftPercentage : 0}
              className="h-3"
            />
            <div className="text-xs text-muted-foreground">
              En dessous de 30% : drift faible. Au-delà de 60% : surveiller. À
              partir de 80% : recalibrage recommandé.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des classes</CardTitle>
            <CardDescription>
              Répartition des sorties modèle depuis le déploiement
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[10, 10, 4, 4]}
                    fill="#a855f7"
                    name="Volume"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables monitorées</CardTitle>
            <CardDescription>Moyenne + écart-type</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={variableStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mean" fill="#22d3ee" radius={[10, 10, 0, 0]} />
                  <Bar
                    dataKey="std"
                    fill="#fb7185"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
