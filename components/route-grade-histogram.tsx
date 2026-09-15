import type { RouteSummary } from "@/lib/api"

const chartColors = ["#059669", "#16a34a", "#65a30d", "#d97706", "#ea580c", "#c2410c", "#dc2626", "#e11d48", "#4338ca", "#334155"]

function chartIndex(route: RouteSummary): number {
  const grade = route.grade?.trim().toUpperCase()
  if (!grade || route.gradeNo === null || route.gradeNo === 0) return 9

  const number = Number(grade.match(/\d+/)?.[0])
  if (!number) return 9
  if (grade.startsWith("FB")) return Math.min(8, Math.max(2, number + 2))

  return Math.min(8, Math.max(0, number - 3))
}

export function RouteGradeHistogram({ routes }: { routes: RouteSummary[] }) {
  const counts = Array.from({ length: 10 }, () => 0)
  routes.forEach((route) => { counts[chartIndex(route)] += 1 })
  const highestCount = Math.max(...counts, 1)
  const scaleMax = highestCount <= 10
    ? highestCount
    : highestCount <= 20
      ? Math.ceil(highestCount / 5) * 5
      : highestCount <= 50
        ? Math.ceil(highestCount / 10) * 10
        : Math.ceil(highestCount / 50) * 50
  const bars = counts
    .map((count, index) => ({ count, index, label: index === 9 ? "Proj." : String(index + 3) }))
    .filter((bar) => bar.count > 0)

  return (
    <div>
      <p className="mb-2 text-xs font-medium tabular-nums">{routes.length} {routes.length === 1 ? "Route" : "Routen"}</p>
      <div className="flex justify-between text-[10px] leading-tight"><span>Anzahl</span><span>Grad (UIAA)</span></div>
      <div className="mt-1 grid h-28 grid-cols-[1.75rem_minmax(0,1fr)]" role="img" aria-label={`${routes.length} Routen je Gradstufe`}>
        <div className="flex flex-col justify-between border-r border-black pr-1 text-right text-[8px] leading-none" aria-hidden="true">
          <span>{scaleMax}</span><span>{Math.round(scaleMax / 2)}</span><span>0</span>
        </div>
        <div className="flex min-w-0 flex-col pl-1">
          <div className="flex min-h-0 flex-1 items-end gap-1">
            {bars.map(({ count, index, label }) => (
              <div key={label} className="relative flex h-full min-w-0 flex-1 items-end">
                <span className="absolute inset-x-0 text-center text-[9px] leading-none" style={{ bottom: `calc(${(count / scaleMax) * 100}% + 2px)` }}>{count}</span>
                <span className="w-full rounded-t-sm" style={{ height: `${Math.max(6, (count / scaleMax) * 100)}%`, backgroundColor: chartColors[index] }} title={label === "Proj." ? `Projekte: ${count}` : `Grad ${label}: ${count}`} />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-1 pt-1 text-center text-[9px] leading-none" aria-hidden="true">
            {bars.map(({ label }) => <span key={label} className="min-w-0 flex-1 truncate">{label}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
