import { AreaCard } from "@/components/area-card"
import { BannedRocksCard, LatestRoutesCard, SupportProjectCard, type SidebarBannedRock, type SidebarRoute } from "@/components/home-sidebar-cards"
import { LatestTopoCard } from "@/components/latest-topo-card"
import {
  fetchAreas,
  fetchBannedRocks,
  fetchLatestRoutes,
  fetchLatestTopo,
  fetchRoutesForArea,
  type BannedRockSummary,
  type LatestRouteSummary,
  type TopoSummary,
} from "@/lib/api"
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

type AreaRock = { "@id"?: string; name?: string; slug?: string }

function referenceId(reference: string | { "@id"?: string } | undefined): string | undefined {
  return typeof reference === "string" ? reference : reference?.["@id"]
}

function findRockLocation(rockReference: string | { "@id"?: string } | undefined, areas: Area[]): TopoLocation | undefined {
  const rockId = referenceId(rockReference)
  if (!rockId) return undefined

  for (const area of areas) {
    const rocks = Array.isArray(area.rocks) ? area.rocks as AreaRock[] : []
    const rock = rocks.find((candidate) => candidate["@id"] === rockId)
    if (rock?.slug) {
      return { areaSlug: getAreaSlug(area), areaName: area.name, rockSlug: rock.slug, rockName: rock.name ?? "" }
    }
  }

  return undefined
}

function findTopoLocation(topo: TopoSummary | null, areas: Area[]): TopoLocation | undefined {
  if (!topo) return undefined
  return findRockLocation(topo.rocks, areas)
}

function latestRouteCards(routes: LatestRouteSummary[], areas: Area[]): SidebarRoute[] {
  return routes.flatMap((route) => {
    const location = findRockLocation(route.rock, areas)
    if (!location) return []
    return [{ id: route.id, name: route.name, grade: route.grade, rockName: location.rockName, href: `/${location.areaSlug}/${location.rockSlug}` }]
  })
}

function bannedRockCards(rocks: BannedRockSummary[], areas: Area[]): SidebarBannedRock[] {
  return rocks.flatMap((rock) => {
    const areaId = referenceId(rock.area)
    const area = areas.find((candidate) => `/api/v1/areas/${candidate.id}` === areaId)
    if (!area || !rock.slug) return []
    return [{ id: rock.id, name: rock.name, areaName: area.name, banned: rock.banned, href: `/${getAreaSlug(area)}/${rock.slug}` }]
  })
}

export default async function Home() {
  const areas = await fetchAreas().catch((error) => {
    console.error("Failed to load areas:", error)
    return []
  })
  const onlineAreas = areas.filter((area) => Number(area.online) === 1)
  const [areasWithRoutes, latestTopo, latestRoutes, bannedRocks] = await Promise.all([
    Promise.all(
      onlineAreas.map(async (area) => ({
        area,
        routes: await fetchRoutesForArea(area.id),
      }))
    ),
    fetchLatestTopo(),
    fetchLatestRoutes(),
    fetchBannedRocks(),
  ])
  const latestTopoLocation = findTopoLocation(latestTopo, onlineAreas)
  const latestRouteCardsData = latestRouteCards(latestRoutes, onlineAreas)
  const bannedRockCardsData = bannedRockCards(bannedRocks, onlineAreas)

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
          <BannedRocksCard rocks={bannedRockCardsData} />
          <LatestTopoCard topo={latestTopo} {...latestTopoLocation} />
          <LatestRoutesCard routes={latestRouteCardsData} />
          <SupportProjectCard />
        </aside>
      </div>
    </section>
  )
}
