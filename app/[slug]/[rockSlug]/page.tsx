import Image from "next/image"
import Link from "next/link"
import { Home } from "lucide-react"
import { notFound } from "next/navigation"

import {
  fetchAreaBySlug,
  fetchRocksForArea,
  fetchRockTranslation,
  fetchRoutesForArea,
  fetchToposForRock,
} from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { RockInfoSheet } from "@/components/rock-info-sheet"
import { RockTopoSections } from "@/components/rock-topo-sections"
import type { Rock } from "@/types/rock"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string; rockSlug: string }> }

function extractId(iri: string) {
  return iri.split("/").filter(Boolean).at(-1) ?? ""
}

function rockMatchesSlug(rock: Rock, rockSlug: string) {
  const normalized = rockSlug.replace(/_/g, "-").toLowerCase()
  const slug = rock.slug?.replace(/_/g, "-").toLowerCase()
  const iri = typeof rock["@id"] === "string" ? rock["@id"] : ""

  return slug === normalized || String(rock.id) === rockSlug || extractId(iri) === rockSlug
}

function routeRockId(route: { rock?: { "@id"?: string; id?: number; name?: string } | string }) {
  if (typeof route.rock === "string") return extractId(route.rock)
  return route.rock?.id?.toString() ?? extractId(route.rock?.["@id"] ?? "")
}

function rockHeroImage(image: unknown) {
  if (typeof image !== "string" || image.length === 0) return null
  return `https://www.munichclimbs.de/uploads/header/${image}-large-@1x.webp`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rockSlug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Fels nicht gefunden" }

  const rocks = await fetchRocksForArea(area.id)
  const rock = rocks.find((item) => rockMatchesSlug(item, rockSlug))
  if (!rock) return { title: "Fels nicht gefunden" }

  return {
    title: { absolute: `Munichclimbs | Klettergebiet ${area.name} | Fels ${rock.name}` },
    description: `Felsen ${rock.name} im Klettergebiet ${area.name} – Routen, Grad und Erstbegeher.`,
  }
}

export default async function RockPage({ params }: Props) {
  const { slug, rockSlug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) notFound()

  const [rocks, areaRoutes] = await Promise.all([
    fetchRocksForArea(area.id),
    fetchRoutesForArea(area.id),
  ])
  const rock = rocks.find((item) => rockMatchesSlug(item, rockSlug))
  if (!rock) notFound()

  const routes = areaRoutes
    .filter((route) => routeRockId(route) === String(rock.id))
    .sort((left, right) => (left.name ?? "").localeCompare(right.name ?? "", "de"))
  const [topos, translation] = await Promise.all([
    fetchToposForRock(rock.id),
    fetchRockTranslation(rock.id),
  ])
  const rockWithTranslation = { ...rock, ...translation }
  const heroImage = rockHeroImage(rock.image)

  return (
    <main>
      <section className="relative w-full">
        <div className="h-[220px] overflow-hidden bg-muted sm:h-[300px]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={`Kletterfels ${rock.name} im Klettergebiet ${area.name}`}
              width={1600}
              height={500}
              priority
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-600 via-slate-500 to-slate-300" />
          )}
        </div>

        <div className="absolute inset-x-0 top-0 mx-auto mt-3 w-full max-w-[1024px] px-2 sm:px-4">
          <div className="rounded-md bg-white/70 p-3 shadow-md ring-1 ring-black/5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-medium text-black sm:text-2xl">{rock.name}</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center gap-1.5 text-sm text-black/80">
                  <Link href="/" aria-label="Startseite" className="hover:text-black">
                    <Home className="size-4" />
                  </Link>
                  <span aria-hidden="true">/</span>
                  <Link href={`/${slug}`} className="truncate hover:text-black hover:underline">
                    {area.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="truncate text-black">{rock.name}</span>
                </nav>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <RockInfoSheet rock={rockWithTranslation} areaName={area.name} railwayStation={area.railwayStation} routeCount={routes.length} routes={routes} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1024px] px-2 py-4 sm:px-4">
        <div className="min-w-0 md:w-3/4">
          <RockTopoSections topos={topos} routes={routes} />
        </div>
      </div>
    </main>
  )
}
