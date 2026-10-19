import { notFound } from "next/navigation"
import { fetchAreaBySlug, fetchRocksForArea, fetchRoutesForArea, fetchTopRoutesForArea } from "@/lib/api"
import { AreaRockList } from "@/components/area-rock-list"
import { AreaHero } from "@/components/area-hero"
import type { Metadata } from "next"
import { localizedAlternates } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

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
    alternates: localizedAlternates(`/${slug}`),
    openGraph: {
      title: `Klettergebiet ${area.name} | Munichclimbs`,
      description: `Klettergebiet ${area.name} – Felsen und Routen`,
      url: `/${slug}`,
      locale: "de_DE",
      alternateLocale: "en_US",
    },
  }
}

export async function AreaPageContent({ params, locale = "de" }: Props & { locale?: "de" | "en" }) {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)

  if (!area) {
    notFound()
  }

  const areaId = typeof area.id === "number" || typeof area.id === "string"
    ? area.id
    : extractRockId(String(area["@id"] ?? ""))
  const [rocks, routes, topRoutes] = await Promise.all([
    fetchRocksForArea(areaId),
    fetchRoutesForArea(areaId),
    fetchTopRoutesForArea(areaId),
  ])
  const routesByRock = new Map<string, typeof routes>()
  for (const route of routes) {
    const rockId = typeof route.rock === "string"
      ? extractRockId(route.rock)
      : route.rock?.id?.toString() ?? extractRockId(route.rock?.["@id"] ?? "")
    if (!rockId) continue
    const rockRoutes = routesByRock.get(rockId) ?? []
    rockRoutes.push(route)
    routesByRock.set(rockId, rockRoutes)
  }

  return (
    <div className="area-page">
      <AreaHero name={area.name} headerImage={area.headerImage} locale={locale} topRoutes={topRoutes.routes} areaSlug={slug} kletterkonzeption={area.kletterkonzeption} lat={area.lat} lng={area.lng} rocks={rocks} />

      <section className="mx-auto my-4 w-full max-w-[1024px] px-2 sm:px-4">
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
  )
}

export default AreaPageContent
