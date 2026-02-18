"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts"

const chartConfig = {
    "1-5": {
        label: "1-5",
        color: "#22c55e", // green-500
    },
    "6-7": {
        label: "6-7",
        color: "#f59e0b", // amber-500
    },
    "8-9": {
        label: "8-9",
        color: "#ef4444", // red-500
    },
    "10-11": {
        label: "10-11",
        color: "#000000", // black
    },
    "Proj.": {
        label: "Proj.",
        color: "#000000", // black
    },
} satisfies ChartConfig

const chartData = [
  { grade: "1-5", valueLow: 186, valueHigh: '', fillValueLow: chartConfig["1-5"].color },
  { grade: "6-7", valueLow: 305, valueHigh: 350, fill: chartConfig["6-7"].color },
  { grade: "8-9", valueLow: 237, valueHigh: 280, fill: chartConfig["8-9"].color },
  { grade: "10-11", valueLow: 237, valueHigh: 280, fill: chartConfig["10-11"].color },
  { grade: "Proj.", valueLow: 73, valueHigh: null, fill: chartConfig["Proj."].color },
]

export function AreaChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="grade"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="valueLow" fill="var(--color-valueLow)" radius={4} />
        <Bar dataKey="valueHigh" fill="var(--color-valueHigh)"  radius={4} />

      </BarChart>
    </ChartContainer>
  )
}
