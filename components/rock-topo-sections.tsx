import Image from "next/image"

import type { CommentSummary, RouteSummary, TopoSummary } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { topoImageUrl } from "@/lib/media"

function routeId(comment: CommentSummary): number | undefined {
  return typeof comment.route?.id === "number" ? comment.route.id : undefined
}

type TopoPath = { d: string; color: string; dot: boolean; dashed: boolean; startX: number; startY: number }

/** The existing database stores the established Symfony drawing paths as a PHP
 * literal. Read only the public drawing attributes needed for the SVG overlay. */
function topoPaths(pathCollection?: string | null): TopoPath[] {
  if (!pathCollection) return []

  return [...pathCollection.matchAll(/'d'\s*=>\s*'([^']+)'([\s\S]*?)(?=\],\s*\[|\]$)/g)].flatMap((match) => {
    const start = match[1].match(/m([\d.]+),([\d.]+)/i)
    if (!start) return []
    return [{
      d: match[1],
      color: match[2].match(/'color'\s*=>\s*'([^']+)'/)?.[1] ?? "#d97706",
      dot: /'dot'\s*=>\s*true/.test(match[2]),
      dashed: /'dashed'\s*=>\s*true/.test(match[2]),
      startX: Number(start[1]),
      startY: Number(start[2]),
    }]
  })
}

/**
 * Finds the final coordinate of the stored SVG path. The source path payloads
 * use relative commands extensively, so the white finish marker cannot be
 * positioned from the final numbers alone.
 */
function topoPathEndpoint(d: string): [number, number] | undefined {
  let x = 0
  let y = 0

  for (const segment of d.trim().match(/[a-zA-Z][^a-zA-Z]*/g) ?? []) {
    const command = segment[0]
    const values = segment.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
    const relative = command === command.toLowerCase()
    const coordinate = (index: number, axis: "x" | "y") => values[index] ?? (axis === "x" ? x : y)

    switch (command.toLowerCase()) {
      case "m":
      case "l":
      case "t":
        x = relative ? x + (values[0] ?? 0) : coordinate(0, "x")
        y = relative ? y + (values[1] ?? 0) : coordinate(1, "y")
        break
      case "c":
        x = relative ? x + (values[4] ?? 0) : coordinate(4, "x")
        y = relative ? y + (values[5] ?? 0) : coordinate(5, "y")
        break
      case "s":
      case "q":
        x = relative ? x + (values[2] ?? 0) : coordinate(2, "x")
        y = relative ? y + (values[3] ?? 0) : coordinate(3, "y")
        break
      case "a":
        x = relative ? x + (values[5] ?? 0) : coordinate(5, "x")
        y = relative ? y + (values[6] ?? 0) : coordinate(6, "y")
        break
      case "h":
        x = relative ? x + (values[0] ?? 0) : coordinate(0, "x")
        break
      case "v":
        y = relative ? y + (values[0] ?? 0) : coordinate(0, "y")
        break
    }
  }

  return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : undefined
}

function RouteTable({ routes, comments }: { routes: RouteSummary[]; comments: CommentSummary[] }) {
  if (!routes.length) {
    return <p className="p-4 text-sm text-muted-foreground">Für diesen Bereich sind noch keine Routen veröffentlicht.</p>
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom border-collapse border-b border-[var(--theme-border)] text-sm font-medium leading-tight text-[var(--theme-text)]">
        <>
          {routes.map((route, index) => {
            const routeComments = comments.filter((comment) => routeId(comment) === route.id)
            return (
              <tbody key={route.id} className="border-b border-[var(--theme-border)]">
                <tr className="transition-colors hover:bg-[var(--theme-bg)]/50">
                  <td className="px-2 py-1 align-middle lg:px-2.5">{index + 1}</td>
                  <td className="px-2 py-1 align-middle lg:min-w-0 lg:whitespace-nowrap lg:px-2.5">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-1 lg:flex-nowrap lg:gap-y-0">
                      <span className="min-w-0 max-w-full shrink font-medium lg:truncate" title={route.name}>{route.name}</span>
                      {route.climbingStyle?.includes("multi-pitch") && <span className="ml-2 text-xs font-normal text-muted-foreground">Mehrseillänge</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{route.grade ?? "–"}</td>
                  <td className="hidden px-3 py-2 lg:table-cell">{route.firstAscent}{route.yearFirstAscent ? ` (${route.yearFirstAscent})` : ""}</td>
                </tr>
                {routeComments.length > 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 pb-2">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{routeComments.length} {routeComments.length === 1 ? "Kommentar" : "Kommentare"}</summary>
                        <div className="mt-2 space-y-3 border-l-2 border-border pl-3">
                          {routeComments.map((comment) => <div key={comment.id}><p className="whitespace-pre-line font-normal">{comment.comment.replace(/<[^>]*>/g, "")}</p><p className="mt-1 text-xs italic text-muted-foreground">{comment.user?.username ?? "Anonym"}{comment.datetime ? ` · ${new Intl.DateTimeFormat("de-DE").format(new Date(comment.datetime))}` : ""}</p></div>)}
                        </div>
                      </details>
                    </td>
                  </tr>
                )}
              </tbody>
            )
          })}
        </>
      </table>
    </div>
  )
}

export function RockTopoSections({ topos, routes, comments }: { topos: TopoSummary[]; routes: RouteSummary[]; comments: CommentSummary[] }) {
  const orderedTopos = [...topos].sort((left, right) => (left.number ?? 0) - (right.number ?? 0))
  const assignedTopoNumbers = new Set(orderedTopos.map((topo) => topo.number).filter((number): number is number => number !== null && number !== undefined))
  const otherRoutes = routes.filter((route) => route.topoId === null || route.topoId === undefined || !assignedTopoNumbers.has(route.topoId))

  return (
    <section className="min-w-0" aria-label="Routen nach Topo">
      {orderedTopos.length > 0 && (
        <nav className="sticky top-[50px] z-20 mb-3 -ml-2 w-screen overflow-x-auto border-b bg-background sm:-ml-4 md:ml-[calc((1024px-100vw)/2-1rem)]" aria-label="Topo-Navigation">
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
          <section key={topo.id} id={`topo-${topo.id}`} className="mb-4 scroll-mt-28">
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
                {topoPaths(topo.pathCollection).length > 0 && (
                  <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 1024 820" preserveAspectRatio="none" aria-hidden="true">
                    {topoPaths(topo.pathCollection).map((path, index) => {
                      const endpoint = path.dot ? topoPathEndpoint(path.d) : undefined

                      return (
                        <g key={`${topo.id}-${index}`}>
                          <path d={path.d} fill="none" stroke={path.dashed ? "rgba(255,255,255,.96)" : "rgba(15,23,42,.72)"} strokeWidth="5.5" strokeDasharray={path.dashed ? "7 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />
                          <path d={path.d} fill="none" stroke={path.color} strokeWidth="3" strokeDasharray={path.dashed ? "7 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx={path.startX} cy={path.startY - 1} r="18" fill={path.color} stroke={path.dashed ? "rgba(255,255,255,.96)" : "rgba(15,23,42,.62)"} strokeWidth="1.5" />
                          <text x={path.startX} y={path.startY + 5} fill="#fff" fontSize="16" textAnchor="middle">{index + 1}</text>
                          {endpoint && <circle cx={endpoint[0]} cy={endpoint[1]} r="7" fill="#fff" />}
                        </g>
                      )
                    })}
                  </svg>
                )}
              </div>
            )}
            <RouteTable routes={topoRoutes} comments={comments} />
          </section>
        )
      })}

      {(otherRoutes.length > 0 || orderedTopos.length === 0) && (
        <Card id="weitere-routen" className="gap-0 overflow-hidden py-0 scroll-mt-28">
          <CardHeader className="border-b px-3 py-3">
            <CardTitle className="text-base font-medium">
              {orderedTopos.length ? "Weitere Routen" : "Routen"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0"><RouteTable routes={orderedTopos.length ? otherRoutes : routes} comments={comments} /></CardContent>
        </Card>
      )}
    </section>
  )
}
