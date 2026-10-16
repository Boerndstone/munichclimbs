"use client"

import Link from "next/link"
import { Database, HardHat, Skull, Star, Trash2, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { AreaTopRoute } from "@/types/public-derived"

type Props = {
  areaName: string
  locale: "de" | "en"
  routes: AreaTopRoute[]
}

function routePath(route: AreaTopRoute, locale: "de" | "en") {
  if (!route.areaSlug || !route.rockSlug) return null

  return `${locale === "en" ? "/en" : ""}/${route.areaSlug}/${route.rockSlug}`
}

function RouteIndicators({ route }: { route: AreaTopRoute }) {
  if (route.rating !== -1 && !(route.rating && route.rating > 0) && route.protection !== 2 && route.protection !== 3 && !route.rockQuality) {
    return null
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-px" aria-label="Routenhinweise">
      {route.rating === -1 && <Trash2 className="size-4" aria-label="Nicht empfehlenswert" />}
      {route.rating && route.rating > 0 && Array.from({ length: route.rating }, (_, index) => <Star key={index} className="size-4 fill-yellow-600 text-yellow-700" aria-label="Empfehlenswert" />)}
      {route.protection === 2 && <TriangleAlert className="size-4 text-red-700" aria-label="Besondere Vorsicht bei der Absicherung" />}
      {route.protection === 3 && <Skull className="size-4" aria-label="Gefährliche Absicherung" />}
      {route.rockQuality && <HardHat className="size-4 text-red-700" aria-label="Felsqualität beachten" />}
    </span>
  )
}

export function AreaTopRoutesDialog({ areaName, locale, routes }: Props) {
  if (routes.length === 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
          <Database className="size-4" aria-hidden="true" />
          Top 100
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="area-top-routes-description" className="max-w-5xl p-0">
        <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3 pr-12">
          <DialogTitle className="min-w-0 flex-1 text-base font-semibold leading-tight sm:text-lg">
            Top 100 — {areaName}
          </DialogTitle>
          <DialogDescription id="area-top-routes-description" className="sr-only">
            Die 100 schwierigsten Routen im Klettergebiet {areaName}, absteigend nach Schwierigkeit sortiert.
          </DialogDescription>
        </header>
        <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
          <table className="w-full min-w-[36rem] border-collapse text-sm font-medium">
            <thead className="border-b">
              <tr>
                <th scope="col" className="w-10 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">#</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Route</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Grad</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Fels</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">Erstbegeher</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => {
                const href = routePath(route, locale)

                return (
                  <tr key={route.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 align-top tabular-nums">{index + 1}</td>
                    <td className="px-3 py-2 align-top">
                      <span className="flex items-center gap-1">
                        {href ? <Link href={href} className="text-sky-800 hover:underline dark:text-sky-300">{route.name}</Link> : route.name}
                        <RouteIndicators route={route} />
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">{route.grade ?? "–"}</td>
                    <td className="px-3 py-2 align-top">{href ? <Link href={href} className="text-sky-800 hover:underline dark:text-sky-300">{route.rockName ?? "–"}</Link> : route.rockName ?? "–"}</td>
                    <td className="px-3 py-2 align-top">{route.firstAscent ? <>{route.firstAscent}{route.yearFirstAscent ? ` (${route.yearFirstAscent})` : ""}</> : "–"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
