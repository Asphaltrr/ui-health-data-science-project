import { type LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    label: string
    positive?: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </CardDescription>
          <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
        </div>
        {Icon ? (
          <div className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-xl">
            <Icon className="size-5" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{description}</span>
        {trend ? (
          <Badge
            variant="outline"
            className={cn(
              "border-emerald-500/40 text-xs",
              trend.positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trend.label}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  )
}
