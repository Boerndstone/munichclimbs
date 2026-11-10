import Link from "next/link"
import { Home } from "lucide-react"
import { notFound } from "next/navigation"

import {
  fetchAreaBySlug,
  fetchCommentsForRock,
  fetchPhotosForRock,
  fetchRailwayAccessesForRock,
  fetchRocksForArea,
  fetchRockTranslation,
  fetchRoutesForArea,
  fetchToposForRock,
  fetchVideosForRock,
} from "@/lib/api"
import { RockInfoSheet } from "@/components/rock-info-sheet"
import { RockTopoSections } from "@/components/rock-topo-sections"
import type { Rock } from "@/types/rock"
import type { ApiReference } from "@/types/public-content"
import type { Metadata } from "next"
import { localizedAlternates } from "@/lib/seo"
import { localizedPath } from "@/lib/home-copy"

type Props = { params: Promise<{ slug: string; rockSlug: string }> }

export const revalidate = 300

function extractId(iri: string) {
  return iri.split("/").filter(Boolean).at(-1) ?? ""
}

function rockMatchesSlug(rock: Rock, rockSlug: string) {
  const normalized = rockSlug.replace(/_/g, "-").toLowerCase()
  const slug = rock.slug?.replace(/_/g, "-").toLowerCase()
  const iri = typeof rock["@id"] === "string" ? rock["@id"] : ""

  return slug === normalized || String(rock.id) === rockSlug || extractId(iri) === rockSlug
}

function routeRockId(route: { rock?: ApiReference | string | null }) {
  if (typeof route.rock === "string") return extractId(route.rock)
  return route.rock?.id?.toString() ?? extractId(route.rock?.["@id"] ?? "")
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
    alternates: localizedAlternates(`/${slug}/${rockSlug}`),
    openGraph: {
      title: `${rock.name} im Klettergebiet ${area.name} | Munichclimbs`,
      description: `Felsen ${rock.name} im Klettergebiet ${area.name} – Routen, Grad und Erstbegeher.`,
      url: `/${slug}/${rockSlug}`,
      locale: "de_DE",
      alternateLocale: "en_US",
    },
  }
}

export async function RockPageContent({ params, locale = "de" }: Props & { locale?: "de" | "en" }) {
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
    // Route numbers are the established topo reading order. Names are only a
    // deterministic fallback for legacy rows without a number.
    .sort((left, right) => {
      const topoOrder = (left.topoId ?? Number.MAX_SAFE_INTEGER) - (right.topoId ?? Number.MAX_SAFE_INTEGER)
      if (topoOrder !== 0) return topoOrder

      const numberOrder = (left.nr ?? Number.MAX_SAFE_INTEGER) - (right.nr ?? Number.MAX_SAFE_INTEGER)
      if (numberOrder !== 0) return numberOrder

      return (left.name ?? "").localeCompare(right.name ?? "", locale)
    })
  const [topos, translationResult, comments, photos, videos, railwayAccesses] = await Promise.all([
    fetchToposForRock(rock.id),
    fetchRockTranslation(rock.id, locale),
    fetchCommentsForRock(rock.id),
    fetchPhotosForRock(rock.id),
    fetchVideosForRock(rock.id),
    fetchRailwayAccessesForRock(rock.id),
  ])
  // Translation fields must be all-or-nothing at the locale boundary. In
  // particular, do not let a missing English field inherit a legacy German
  // field from the base rock response and appear translated.
  const rockWithTranslation = translationResult.translation
    ? {
        ...rock,
        description: translationResult.translation.description ?? null,
        access: translationResult.translation.access ?? null,
        nature: translationResult.translation.nature ?? null,
        flowers: translationResult.translation.flowers ?? null,
        rockDescription: null,
        rockAccess: null,
        rockNature: null,
        rockFlowers: null,
      }
    : locale === "en"
      ? {
          ...rock,
          description: null,
          access: null,
          nature: null,
          flowers: null,
          rockDescription: null,
          rockAccess: null,
          rockNature: null,
          rockFlowers: null,
        }
      : rock
  return (
    <div className="rock-page">
      <section className="mx-auto w-full max-w-[1024px] p-2 text-[var(--theme-text)] sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between gap-2">
              <h1 className="m-0 min-w-0 truncate text-xl font-medium text-[var(--theme-text)] md:text-2xl">
                {rock.name}
              </h1>
              <RockInfoSheet
                rock={rockWithTranslation}
                railwayAccesses={railwayAccesses}
                routes={routes}
                photos={photos}
                videos={videos}
                contentLocale={translationResult.contentLocale}
                translationStatus={locale === "en" ? translationResult.status : undefined}
              />
            </div>
            <nav aria-label="Breadcrumb" className="mt-1 text-[var(--theme-text)]">
              <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-xs font-normal">
                <li>
                  <Link href={localizedPath("/", locale)} className="inline-flex shrink-0 items-center transition-colors hover:underline">
                    <Home className="size-4" aria-hidden="true" />
                    <span className="sr-only">Startseite</span>
                  </Link>
                </li>
                <li role="presentation" aria-hidden="true" className="text-gray-600">/</li>
                <li>
                  <Link href={localizedPath(`/${slug}`, locale)} className="transition-colors hover:underline">
                    {area.name}
                  </Link>
                </li>
                <li role="presentation" aria-hidden="true" className="text-gray-600">/</li>
                <li aria-current="page" className="min-w-0 truncate">{rock.name}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1024px] px-2 pb-4 sm:px-4">
        <div className="min-w-0 md:w-3/4">
          <RockTopoSections topos={topos} routes={routes} comments={comments} />
        </div>
      </div>
    </div>
  )
}

export default RockPageContent
