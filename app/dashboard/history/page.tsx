"use client"

import { useEffect, useState } from "react"
import { Filter } from "lucide-react"

import { HistoryTable } from "@/components/history-table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getHistory } from "@/lib/api"
import { type HistoryItem } from "@/lib/types"

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const data = history

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historique des prédictions</CardTitle>
            <CardDescription>
              DataTable shadcn + @tanstack/react-table (sortable, pagination)
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Filter className="size-4" />
            24h rolling
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : data.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aucune prédiction disponible.
            </div>
          ) : (
            <HistoryTable data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
