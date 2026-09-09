import Image from "next/image"
import Link from "next/link"
import { getAreaSlug } from "@/lib/slugify"
import type { RouteSummary } from "@/lib/api"
import type { Area } from "@/types/area"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

type Props = {
  area: Area
  routes: RouteSummary[]
}

const chartColors = ["#059669", "#16a34a", "#65a30d", "#d97706", "#ea580c", "#c2410c", "#dc2626", "#e11d48", "#4338ca", "#334155"]

function chartIndex(route: RouteSummary): number {
  const grade = route.grade?.trim().toUpperCase()
  if (!grade || route.gradeNo === null || route.gradeNo === 0) return 9

  const number = Number(grade.match(/\d+/)?.[0])
  if (!number) return 9
  if (grade.startsWith("FB")) return Math.min(8, Math.max(2, number + 2))

  return Math.min(8, Math.max(0, number - 3))
}

function GradeHistogram({ area, routes }: { area: Area; routes?: RouteSummary[] }) {
  const routeList = Array.isArray(routes) ? routes : []
  const counts = Array.from({ length: 10 }, () => 0)
  routeList.forEach((route) => { counts[chartIndex(route)] += 1 })
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
  const rockCount = Array.isArray(area.rocks) ? area.rocks.length : 0

  return (
    <div className="mt-auto">
      <p className="mb-2 text-left text-xs font-medium tabular-nums text-foreground">
        {routeList.length} Touren · {rockCount} Felsen
      </p>
      <div className="flex justify-between text-[10px] leading-tight text-muted-foreground">
        <span>Anzahl</span>
        <span>Grad (UIAA)</span>
      </div>
      <div
        className="mt-1 grid h-28 grid-cols-[1.75rem_minmax(0,1fr)]"
        role="img"
        aria-label={`Klettergebiet ${area.name}. Insgesamt ${routeList.length} Touren, ${rockCount} Felsen. Routen je Gradstufe.`}
      >
        <div className="flex flex-col justify-between border-r border-border pr-1 text-right text-[8px] leading-none text-muted-foreground" aria-hidden="true">
          <span>{scaleMax}</span>
          <span>{Math.round(scaleMax / 2)}</span>
          <span>0</span>
        </div>
        <div className="flex min-w-0 flex-col pl-1">
          <div className="flex min-h-0 flex-1 items-end gap-1">
            {bars.map(({ count, index, label }) => (
              <div key={label} className="relative flex h-full min-w-0 flex-1 items-end">
                <span className="absolute inset-x-0 text-center text-[9px] leading-none text-muted-foreground" style={{ bottom: `calc(${(count / scaleMax) * 100}% + 2px)` }}>
                  {count}
                </span>
                <span
                  className="w-full rounded-t-sm"
                  style={{ height: `${Math.max(6, (count / scaleMax) * 100)}%`, backgroundColor: chartColors[index] }}
                  title={label === "Proj." ? `Projekte: ${count}` : `Grad ${label}: ${count}`}
                />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-1 pt-1 text-center text-[9px] leading-none text-foreground" aria-hidden="true">
            {bars.map(({ label }) => <span key={label} className="min-w-0 flex-1 truncate">{label}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AreaCard({ area, routes }: Props) {
  const href = `/${getAreaSlug(area)}`

  return (
    <Link href={href} className="block text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="mb-0 gap-0 overflow-hidden rounded-lg border-border py-0 shadow-md">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="relative min-h-[196px] min-w-0 bg-muted">
            {area.image ? (
              <Image
                src={`https://www.munichclimbs.de/uploads/areas/${area.image}.webp`}
                alt={`Klettergebiet ${area.name}`}
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            ) : (
              <div className="min-h-[196px]" />
            )}
            <div className="absolute inset-x-0 top-0 z-10 px-3 py-2 md:hidden">
              <span className="inline-block max-w-[calc(100%-3rem)] truncate rounded bg-background/90 px-2 py-1 text-base font-semibold text-foreground shadow-sm">
                {area.name}
              </span>
            </div>
          </div>

          <CardContent className="flex min-w-0 flex-col p-3">
              <CardTitle className="hidden text-base font-medium md:block">{area.name}</CardTitle>
            <GradeHistogram area={area} routes={routes} />
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
