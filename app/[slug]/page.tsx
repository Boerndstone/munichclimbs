import { notFound } from "next/navigation"
import { fetchAreaBySlug, fetchRocksForArea, fetchRoutesForArea } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { RockListCard } from "@/components/rock-list-card"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

function extractRockId(rockIri: string): string {
  const parts = rockIri.split("/")
  return parts[parts.length - 1] ?? ""
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Area not found" }
  return {
    title: area.name,
    description: `Klettergebiet ${area.name} – Felsen und Routen`,
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)

  if (!area) {
    notFound()
  }

  const areaId = typeof area.id === "number" || typeof area.id === "string"
    ? area.id
    : extractRockId(String(area["@id"] ?? ""))
  const [rocks, routes] = await Promise.all([
    fetchRocksForArea(areaId),
    fetchRoutesForArea(areaId),
  ])
  const routesByRock = new Map<string, typeof routes>()
  for (const route of routes) {
    const rockId = route.rock?.id?.toString() ?? extractRockId(route.rock?.["@id"] ?? "")
    if (!rockId) continue
    const rockRoutes = routesByRock.get(rockId) ?? []
    rockRoutes.push(route)
    routesByRock.set(rockId, rockRoutes)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-medium">{area.name}</h1>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Felsen</h2>
        <ul className="space-y-2">
          {rocks.map((rock) => (
            <RockListCard
              key={rock.id}
              areaName={area.name}
              areaSlug={slug}
              rock={rock}
              routes={routesByRock.get(String(rock.id)) ?? []}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}
