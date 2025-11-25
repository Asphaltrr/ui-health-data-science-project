import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FeatureImportanceProps = {
  features: Record<string, number>[]
  className?: string
}

export function FeatureImportance({
  features,
  className,
}: FeatureImportanceProps) {
  const flattened = features
    .flatMap((item) =>
      Object.entries(item).map(([feature, value]) => ({ feature, value }))
    )
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {flattened.map((item) => (
        <div
          key={`${item.feature}-${item.value}`}
          className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
        >
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-foreground">{item.feature}</span>
            <span className="text-muted-foreground text-xs">
              {item.value.toFixed(3)}
            </span>
          </div>
          <Progress
            value={Math.min(Math.abs(item.value) * 100, 100)}
            className="h-2"
          />
        </div>
      ))}
    </div>
  )
}
