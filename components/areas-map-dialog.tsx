"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { MapPinned } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAreaSlug } from "@/lib/slugify"
import type { Area } from "@/types/area"
import type { Rock } from "@/types/rock"
import type { MapPoint } from "@/components/areas-cluster-map"

const AreasClusterMap = dynamic(() => import("@/components/areas-cluster-map").then((module) => module.AreasClusterMap), { ssr: false })

export type AreaMapSummary = {
  id: string | number
  routeCount: number
  rockCount: number
  gradeCounts: number[]
}

export type RockMapSummary = {
  id: string | number
  routeCount: number
  gradeCounts: number[]
}

function coordinate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

function areaId(reference: unknown) {
  if (typeof reference === "string") return reference.split("/").filter(Boolean).at(-1)
  if (reference && typeof reference === "object") {
    if ("id" in reference && reference.id !== null && reference.id !== undefined) return String(reference.id)
    if ("@id" in reference && typeof reference["@id"] === "string") return reference["@id"].split("/").filter(Boolean).at(-1) ?? null
  }
  return null
}

function mapPoints(areas: Area[], rocks: Rock[], summaries: AreaMapSummary[], rockSummaries: RockMapSummary[]): MapPoint[] {
  const areasById = new Map(areas.map((area) => [String(area.id), area]))
  const summariesById = new Map(summaries.map((summary) => [String(summary.id), summary]))
  const rockSummariesById = new Map(rockSummaries.map((summary) => [String(summary.id), summary]))
  return rocks.flatMap((rock) => {
    const latitude = coordinate(rock.lat)
    const longitude = coordinate(rock.lng)
    const area = areasById.get(areaId(rock.area) ?? "")
    const summary = area ? summariesById.get(String(area.id)) : null
    const rockSummary = rockSummariesById.get(String(rock.id))
    if (latitude === null || longitude === null || !area || !summary || !rockSummary || !rock.slug) return []
    return [{ id: rock.id, name: rock.name, areaName: area.name, areaHref: `/${getAreaSlug(area)}`, href: `/${getAreaSlug(area)}/${rock.slug}`, latitude, longitude, areaImage: area.image ?? undefined, areaRouteCount: summary.routeCount, areaRockCount: summary.rockCount, areaGradeCounts: summary.gradeCounts, rockPreviewImage: typeof rock.previewImage === "string" ? rock.previewImage : undefined, rockRouteCount: rockSummary.routeCount, rockGradeCounts: rockSummary.gradeCounts }]
  })
}

export function AreasMapDialog({ areas, rocks, summaries, rockSummaries }: { areas: Area[]; rocks: Rock[]; summaries: AreaMapSummary[]; rockSummaries: RockMapSummary[] }) {
  const points = mapPoints(areas, rocks, summaries, rockSummaries)
  const [open, setOpen] = useState(false)
  if (!points.length) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="size-8">
          <MapPinned className="size-4" aria-hidden="true" />
          <span className="sr-only">Karte der Klettergebiete öffnen</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="inset-0 h-dvh w-screen max-h-none max-w-none translate-x-0 translate-y-0 rounded-none border-0">
        <div className="flex items-start justify-between gap-4 border-b px-4 py-3 pr-12">
          <div>
            <DialogTitle>Karte der Klettergebiete</DialogTitle>
            <DialogDescription>Wählen Sie einen Fels auf der Karte oder nutzen Sie die nachfolgende Liste mit direkten Links.</DialogDescription>
          </div>
          <DialogCloseButton />
        </div>
        {open && <div aria-hidden="true"><AreasClusterMap key="areas-map" points={points} /></div>}
        <nav className="sr-only" aria-label="Felsen auf der Karte">
          <ul>
            {points.map((point) => (
              <li key={point.id}>
                <a href={point.href}>{point.name} in {point.areaName}</a>
              </li>
            ))}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  )
}
