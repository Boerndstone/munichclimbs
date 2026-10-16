import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { homeCopy, localizedPath, type HomeLocale } from "@/lib/home-copy"
import type { HomeArea } from "@/types/home"

type Props = { area: HomeArea; locale?: HomeLocale; priority?: boolean }

const chartColors = ["#059669", "#16a34a", "#65a30d", "#d97706", "#ea580c", "#c2410c", "#dc2626", "#e11d48", "#4338ca", "#334155"]

export function gradeChartCounts(source: Pick<HomeArea, "amountProjects" | "grade_chart_3" | "grade_chart_4" | "grade_chart_5" | "grade_chart_6" | "grade_chart_7" | "grade_chart_8" | "grade_chart_9" | "grade_chart_10" | "grade_chart_11">) {
  return [source.grade_chart_3, source.grade_chart_4, source.grade_chart_5, source.grade_chart_6, source.grade_chart_7, source.grade_chart_8, source.grade_chart_9, source.grade_chart_10, source.grade_chart_11, source.amountProjects].map(Number)
}

export function GradeHistogram({ area, compact = false, locale = "de" }: { area: Pick<HomeArea, "name" | "routes" | "rocks" | "amountProjects" | "grade_chart_3" | "grade_chart_4" | "grade_chart_5" | "grade_chart_6" | "grade_chart_7" | "grade_chart_8" | "grade_chart_9" | "grade_chart_10" | "grade_chart_11">; compact?: boolean; locale?: HomeLocale }) {
  const labels = homeCopy(locale)
  const counts = gradeChartCounts(area)
  const scaleMax = Math.max(...counts, 1)
  const bars = counts.map((count, index) => ({ count, index, label: index === 9 ? "Proj." : String(index + 3) })).filter((bar) => bar.count > 0)
  if (area.routes < 1) return null
  return <div className={compact ? "flex min-h-0 flex-1 flex-col" : "mt-auto"}>
    {!compact && <><p className="mb-2 text-left text-xs font-medium tabular-nums text-foreground">{area.routes} {labels.routes} · {area.rocks} {labels.rocks}</p><div className="flex justify-between text-[10px] leading-tight text-muted-foreground"><span>{labels.countAxis}</span><span>{labels.gradeAxis}</span></div></>}
    <div className={`${compact ? "mt-1 h-16" : "mt-1 h-28"} grid grid-cols-[1.75rem_minmax(0,1fr)]`} role="img" aria-label={`${labels.area} ${area.name}. ${area.routes} ${labels.routes}, ${area.rocks} ${labels.rocks}.`}>
      <div className="flex flex-col justify-between border-r border-border pr-1 text-right text-[8px] leading-none text-muted-foreground" aria-hidden="true"><span>{scaleMax}</span><span>{Math.round(scaleMax / 2)}</span><span>0</span></div>
      <div className="flex min-w-0 flex-col pl-1"><div className="flex min-h-0 flex-1 items-end gap-1">{bars.map(({ count, index, label }) => <div key={label} className="relative flex h-full min-w-0 flex-1 items-end"><span className="absolute inset-x-0 text-center text-[9px] leading-none text-muted-foreground" style={{ bottom: `calc(${(count / scaleMax) * 100}% + 2px)` }}>{count}</span><span className="w-full rounded-t-sm" style={{ height: `${Math.max(6, (count / scaleMax) * 100)}%`, backgroundColor: chartColors[index] }} /></div>)}</div><div className="flex shrink-0 gap-1 pt-1 text-center text-[9px] leading-none text-foreground" aria-hidden="true">{bars.map(({ label }) => <span key={label} className="min-w-0 flex-1 truncate">{label}</span>)}</div></div>
    </div>
  </div>
}

export function AreaCard({ area, locale = "de", priority = false }: Props) {
  const labels = homeCopy(locale)
  return <Link href={localizedPath(`/${area.slug}`, locale)} className="block text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
    <Card className="mb-0 gap-0 overflow-hidden rounded-lg border-border py-0 shadow-md"><div className="grid grid-cols-1 gap-0 md:grid-cols-2">
      <div className="relative min-h-[196px] min-w-0 bg-muted md:min-h-[216px]">{area.image ? <Image src={`https://www.munichclimbs.de/uploads/areas/${area.image}.webp`} alt={`${labels.area} ${area.name}`} fill priority={priority} sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition-transform duration-300 hover:scale-[1.02]" /> : <div className="min-h-[196px]" />}<div className="absolute inset-x-0 top-0 z-10 px-3 py-2 md:hidden"><span className="inline-block max-w-[calc(100%-3rem)] truncate rounded bg-background/90 px-2 py-1 text-base font-semibold text-foreground shadow-sm">{area.name}</span></div></div>
      <CardContent className="flex min-w-0 flex-col justify-center p-3"><CardTitle className="hidden text-lg font-medium md:block">{area.name}</CardTitle><GradeHistogram area={area} locale={locale} /></CardContent>
    </div></Card>
  </Link>
}
