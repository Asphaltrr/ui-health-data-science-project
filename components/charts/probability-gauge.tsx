import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

type ProbabilityGaugeProps = {
  survival: number
  death: number
}

export function ProbabilityGauge({ survival, death }: ProbabilityGaugeProps) {
  const data = [
    { name: "Survie", value: survival * 100, fill: "#34d399" },
    { name: "Décès", value: death * 100, fill: "#f472b6" },
  ]

  return (
    <div className="flex h-72 items-center justify-center">
      <RadialBarChart
        width={260}
        height={260}
        cx="50%"
        cy="50%"
        innerRadius="45%"
        outerRadius="95%"
        barSize={14}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          label={{
            content: ({ value, name }) =>
              `${name ?? ""} ${Number(value ?? 0).toFixed(0)}%`,
          }}
        />
      </RadialBarChart>
    </div>
  )
}
