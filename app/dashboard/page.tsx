"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getHistory, getMonitoring, healthcheck } from "@/lib/api"
import {
  type HealthcheckResponse,
  type HistoryItem,
  type MonitoringData,
} from "@/lib/types"

export default function DashboardPage() {
  const [monitoring, setMonitoring] = useState<MonitoringData | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [health, setHealth] = useState<HealthcheckResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [mon, hist, healthStatus] = await Promise.all([
          getMonitoring(),
          getHistory(),
          healthcheck(),
        ])
        setMonitoring(mon)
        setHistory(hist)
        setHealth(healthStatus)
      } catch (error) {
        console.error(error)
        setMonitoring(null)
        setHistory([])
        setHealth(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const monitoringData = monitoring
  const historyData = history

  const classDistributionData = useMemo(() => {
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
        fill: "#34d399",
      },
      {
        name: "Décès",
        value: deces,
        percent: decesPercent,
        fill: "#f43f5e",
      },
    ]
  }, [monitoringData])

  const lineHistory = useMemo(() => {
    const map = new Map<string, { date: string; count: number }>()
    const perDay = monitoringData?.predictions_per_day ?? {}
    Object.entries(perDay).forEach(([date, count]) => {
      map.set(date, { date, count })
    })
    if (map.size === 0) {
      historyData.forEach((item) => {
        const date = item.timestamp.slice(0, 10)
        const existing = map.get(date) ?? { date, count: 0 }
        existing.count += 1
        map.set(date, existing)
      })
    }
    return Array.from(map.values())
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(-14)
  }, [monitoringData, historyData])

  const variableMeans = useMemo(() => {
    return Object.entries(monitoringData?.feature_stats_live ?? {})
      .map(([feature, stats]) => ({ feature, mean: stats.mean ?? NaN }))
      .sort((a, b) => (Number.isFinite(b.mean) ? b.mean : -Infinity) - (Number.isFinite(a.mean) ? a.mean : -Infinity))
      .slice(0, 6)
  }, [monitoringData])

  const driftScore = useMemo(() => {
    const values = Object.values(monitoringData?.feature_drift_psi ?? {}).filter(
      (val): val is number => val !== null && Number.isFinite(val)
    )
    if (!values.length) return NaN
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length
    return avg
  }, [monitoringData])

  const formatNumber = (value?: number | null, fraction?: number) => {
    if (value == null || Number.isNaN(value)) return "NaN"
    if (!Number.isFinite(value)) return "NaN"
    return fraction != null ? value.toFixed(fraction) : value
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Nombre total de prédictions"
          value={formatNumber(monitoringData?.n_predictions)}
          description="Activité cumulée du modèle"
        />
        <StatCard
          title="% Survie vs % Décès"
          value={`${classDistributionData[0].percent}% / ${classDistributionData[1].percent}%`}
          description="Répartition actuelle"
        />
        <StatCard
          title="Drift score"
          value={formatNumber(driftScore, 2)}
          description="PSI moyen (si disponible)"
        />
        <StatCard
          title="Temps de réponse du modèle"
          value={`${formatNumber(health?.latency_ms)} ms`}
          description={health?.status ?? "NaN"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Répartition des classes</CardTitle>
          </CardHeader>
          <CardContent className="flex h-72 items-center justify-center">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip
                    formatter={(value: number, name, payload) =>
                      `${payload?.payload.percent}%`
                    }
                  />
                  <Pie
                    dataKey="value"
                    data={classDistributionData}
                    cx="50%"
                    cy="50%"
                    label={(entry) => `${entry.name} ${entry.percent}%`}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Historique journalier</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <LineChart data={lineHistory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="none"
                    fill="url(#colorCount)"
                  />
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variables clés (moyenne)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer>
              <BarChart data={variableMeans}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mean" radius={[8, 8, 0, 0]} fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
