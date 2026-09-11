import { notFound } from "next/navigation"
import { fetchAreaBySlug, fetchRocksForArea, fetchRoutesForArea } from "@/lib/api"
import { AreaRockList } from "@/components/area-rock-list"
import { AreaHero } from "@/components/area-hero"
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
    title: { absolute: `Munichclimbs | Klettergebiet ${area.name}` },
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
    <div className="area-page">
      <div className="mx-auto w-full max-w-[1024px] px-2">
        <AreaHero name={area.name} headerImage={area.headerImage} />

        <section className="my-4">
          <AreaRockList
            areaName={area.name}
            areaSlug={slug}
            rows={rocks.map((rock) => ({
              rock,
              routes: routesByRock.get(String(rock.id)) ?? [],
            }))}
          />
        </section>
      </div>
    </div>
  )
}
