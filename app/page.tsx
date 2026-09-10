import { AreaCard } from "@/components/area-card"
import { LatestTopoCard } from "@/components/latest-topo-card"
import { fetchAreas, fetchLatestTopo, fetchRoutesForArea, type TopoSummary } from "@/lib/api"
import { getAreaSlug } from "@/lib/slugify"
import type { Area } from "@/types/area"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Munichclimbs" },
  description: "Klettern rund um München. Klettergebiete, Felsen und Touren im Überblick.",
}

type TopoLocation = {
  areaSlug: string
  areaName: string
  rockSlug: string
  rockName: string
}

function findTopoLocation(topo: TopoSummary | null, areas: Area[]): TopoLocation | undefined {
  if (!topo) return undefined

  const rockReference = typeof topo.rocks === "string" ? topo.rocks : topo.rocks?.["@id"]

  for (const area of areas) {
    const rocks = Array.isArray(area.rocks) ? area.rocks as Array<{ "@id"?: string; name?: string; slug?: string }> : []
    const rock = rocks.find((candidate) => candidate["@id"] === rockReference)
    if (rock?.slug) {
      return {
        areaSlug: getAreaSlug(area),
        areaName: area.name,
        rockSlug: rock.slug,
        rockName: rock.name ?? "",
      }
    }
  }

  return undefined
}

export default async function Home() {
  const areas = await fetchAreas().catch((error) => {
    console.error("Failed to load areas:", error)
    return []
  })
  const onlineAreas = areas.filter((area) => Number(area.online) === 1)
  const [areasWithRoutes, latestTopo] = await Promise.all([
    Promise.all(
      onlineAreas.map(async (area) => ({
        area,
        routes: await fetchRoutesForArea(area.id),
      }))
    ),
    fetchLatestTopo(),
  ])
  const latestTopoLocation = findTopoLocation(latestTopo, onlineAreas)

  return (
    <section className="home-page flex flex-col gap-6" aria-labelledby="index-page-heading">
      <div className="mb-3 flex items-center justify-between gap-3 py-3">
        <h1 id="index-page-heading" className="text-2xl font-medium leading-tight sm:text-3xl">
          Klettergebiete um München
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <section className="min-w-0 lg:col-span-8" aria-label="Klettergebiete">
          <div className="flex flex-col gap-4">
            {areasWithRoutes.map(({ area, routes }) => (
              <AreaCard key={area.id} area={area} routes={routes} />
            ))}
          </div>
        </section>
        <aside className="grid min-w-0 auto-rows-auto grid-cols-1 items-start gap-6 self-start lg:col-span-4" aria-label="Neueste Topos">
          <LatestTopoCard topo={latestTopo} {...latestTopoLocation} />
        </aside>
      </div>
    </section>
  )
}
