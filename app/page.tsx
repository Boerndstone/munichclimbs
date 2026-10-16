import type { Metadata } from "next"
import { connection } from "next/server"

import { AreaCard } from "@/components/area-card"
import { AreasMapDialog } from "@/components/areas-map-dialog"
import { BannedRocksCard, LatestRoutesCard, SupportProjectCard } from "@/components/home-sidebar-cards"
import { LatestTopoCard } from "@/components/latest-topo-card"
import { fetchHomeData, fetchLatestTopo, type TopoSummary } from "@/lib/api"
import { homeCopy, localizedPath, type HomeLocale } from "@/lib/home-copy"
import { localizedAlternates } from "@/lib/seo"
import type { HomeRock } from "@/types/home"

export const revalidate = 300

function referenceId(reference: string | { "@id"?: string } | null | undefined) { return typeof reference === "string" ? reference.split("/").filter(Boolean).at(-1) : reference?.["@id"]?.split("/").filter(Boolean).at(-1) }
function topoLocation(topo: TopoSummary | null, rocks: HomeRock[]) {
  const id = referenceId(topo?.rocks)
  return id ? rocks.find((rock) => String(rock.rockId) === id) : undefined
}

function description(locale: HomeLocale, names: string[]) {
  return locale === "en" ? `Climbing areas around Munich: ${names.join(", ")}.` : `Klettergebiete rund um München: ${names.join(", ")}.`
}

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const { areas } = await fetchHomeData()
  const pageDescription = description("de", areas.map((area) => area.name))
  return { title: { absolute: "Munichclimbs" }, description: pageDescription, alternates: localizedAlternates("/"), robots: { index: true, follow: true }, openGraph: { title: "Munichclimbs", description: pageDescription, url: "/", locale: "de_DE", alternateLocale: "en_US" } }
}

export default async function Home({ locale = "de" }: { locale?: HomeLocale }) {
  await connection()
  const [home, latestTopo] = await Promise.all([fetchHomeData(), fetchLatestTopo()])
  const labels = homeCopy(locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.munichclimbs.de"
  const pageDescription = description(locale, home.areas.map((area) => area.name))
  const homeUrl = new URL(localizedPath("/", locale), siteUrl).toString()
  const latestTopoRock = topoLocation(latestTopo, home.rocks)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Munichclimbs", description: pageDescription, inLanguage: locale === "en" ? "en-US" : "de-DE" },
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Munichclimbs", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/build/images/favicon/android-chrome-512x512.png` } },
      { "@type": "WebPage", "@id": `${homeUrl}#webpage`, url: homeUrl, name: "Munichclimbs", description: pageDescription, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@type": "Thing", name: locale === "en" ? "Climbing" : "Klettern" }, inLanguage: locale === "en" ? "en-US" : "de-DE" },
      { "@type": "ItemList", name: labels.heading, description: pageDescription, numberOfItems: home.areas.length, itemListElement: home.areas.map((area, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "SportsActivityLocation", name: area.name, url: new URL(localizedPath(`/${area.slug}`, locale), siteUrl).toString(), ...(area.image ? { image: `${siteUrl}/uploads/areas/${area.image}.webp` } : {}) } })) },
    ],
  }
  return <section className="home-page flex flex-col gap-6" aria-labelledby="index-page-heading"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><div className="mb-3 flex items-center justify-between gap-3 py-3"><h1 id="index-page-heading" className="text-2xl font-medium leading-tight sm:text-3xl">{labels.heading}</h1><AreasMapDialog areas={home.areas} rocks={home.rocks} locale={locale} /></div><div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"><section className="min-w-0 lg:col-span-8" aria-label={labels.areas}><div className="flex flex-col gap-4">{home.areas.length ? home.areas.map((area, index) => <AreaCard key={area.areaId} area={area} locale={locale} priority={index === 0} />) : <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">{labels.noAreas}</p>}</div></section><aside className="grid min-w-0 auto-rows-auto grid-cols-1 items-start gap-6 self-start lg:col-span-4" aria-label={labels.sidebar}><BannedRocksCard rocks={home.bannedRocks} locale={locale} /><LatestTopoCard topo={latestTopo} areaSlug={latestTopoRock?.areaSlug} areaName={latestTopoRock?.areaName} rockSlug={latestTopoRock?.rockSlug} rockName={latestTopoRock?.rockName} locale={locale} /><LatestRoutesCard routes={home.latestRoutes} locale={locale} /><SupportProjectCard locale={locale} /></aside></div></section>
}
