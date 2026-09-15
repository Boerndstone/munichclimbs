import Image from "next/image"

import type { RouteSummary, TopoSummary } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function topoImageUrl(image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) return image
  const baseName = image.split("/").at(-1)?.replace(/\.(webp|png|jpe?g|avif)$/i, "") ?? image
  return `https://www.munichclimbs.de/build/images/topos/${baseName}.webp`
}

function RouteTable({ routes }: { routes: RouteSummary[] }) {
  if (!routes.length) {
    return <p className="p-4 text-sm text-muted-foreground">Für diesen Bereich sind noch keine Routen veröffentlicht.</p>
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom border-collapse border-b border-[var(--theme-border)] text-sm font-medium leading-tight text-[var(--theme-text)]">
        <tbody className="divide-y">
          {routes.map((route, index) => (
            <tr key={route.id} className="border-b border-[var(--theme-border)] transition-colors hover:bg-[var(--theme-bg)]/50">
              <td className="px-2 py-1 align-middle lg:px-2.5">{index + 1}</td>
              <td className="px-2 py-1 align-middle lg:min-w-0 lg:whitespace-nowrap lg:px-2.5">
                <div className="flex min-w-0 flex-wrap items-center gap-x-1 lg:flex-nowrap lg:gap-y-0">
                  <span className="min-w-0 max-w-full shrink font-medium lg:truncate" title="{{ route.name }}">{route.name}</span>
                  {route.climbingStyle?.includes("multi-pitch") && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Mehrseillänge</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{route.grade ?? "–"}</td>
              <td className="hidden px-3 py-2 lg:table-cell">
                {route.firstAscent}
                {route.yearFirstAscent ? ` (${route.yearFirstAscent})` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RockTopoSections({ topos, routes }: { topos: TopoSummary[]; routes: RouteSummary[] }) {
  const orderedTopos = [...topos].sort((left, right) => (left.number ?? 0) - (right.number ?? 0))
  const assignedTopoNumbers = new Set(orderedTopos.map((topo) => topo.number).filter((number): number is number => number !== null && number !== undefined))
  const otherRoutes = routes.filter((route) => route.topoId === null || route.topoId === undefined || !assignedTopoNumbers.has(route.topoId))

  return (
    <section className="min-w-0" aria-label="Routen nach Topo">
      {orderedTopos.length > 0 && (
        <nav className="sticky top-[50px] z-20 -mx-2 mb-3 overflow-x-auto border-b bg-background px-2 sm:-mx-4 sm:px-4" aria-label="Topo-Navigation">
          <div className="mx-auto flex w-full max-w-[1024px] gap-1">
            {orderedTopos.map((topo) => (
              <a key={topo.id} href={`#topo-${topo.id}`} className="shrink-0 border-b-2 border-transparent px-3 py-2 text-sm hover:border-foreground hover:text-foreground">
                {topo.name}
              </a>
            ))}
            {otherRoutes.length > 0 && (
              <a href="#weitere-routen" className="shrink-0 border-b-2 border-transparent px-3 py-2 text-sm hover:border-foreground hover:text-foreground">Weitere Routen</a>
            )}
          </div>
        </nav>
      )}

      {orderedTopos.map((topo) => {
        const topoRoutes = routes.filter((route) => route.topoId === topo.number)

        return (
          <Card key={topo.id} id={`topo-${topo.id}`} className="mb-4 gap-0 overflow-hidden py-0 scroll-mt-28">
            <CardHeader className="border-b px-3 py-3">
              <CardTitle className="text-base font-medium">{topo.name}</CardTitle>
            </CardHeader>
            {topo.image && (
              <div className="relative bg-muted">
                <Image
                  src={topoImageUrl(topo.image)}
                  alt={`Topo ${topo.name}`}
                  width={1024}
                  height={820}
                  sizes="(min-width: 1024px) 750px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            )}
            <CardContent className="p-0"><RouteTable routes={topoRoutes} /></CardContent>
          </Card>
        )
      })}

      {(otherRoutes.length > 0 || orderedTopos.length === 0) && (
        <Card id="weitere-routen" className="gap-0 overflow-hidden py-0 scroll-mt-28">
          <CardHeader className="border-b px-3 py-3">
            <CardTitle className="text-base font-medium">
              {orderedTopos.length ? "Weitere Routen" : "Routen"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0"><RouteTable routes={orderedTopos.length ? otherRoutes : routes} /></CardContent>
        </Card>
      )}
    </section>
  )
}
