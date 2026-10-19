import "server-only"

import type { Area, AreasResponse } from "@/types/area"
import type { ApiReference, PublicComment, PublicPhoto, PublicVideo } from "@/types/public-content"
import type { AreaTopRoutesResponse, RailwayAccess, RailwayAccessResponse } from "@/types/public-derived"
import type { Rock } from "@/types/rock"
import type { Route } from "@/types/route"
import type { HomeData, LatestRoutesPageRoute } from "@/types/home"
import { getAreaSlug, slugifyAreaName } from "@/lib/slugify"

const API_BASE_URL = process.env.MUNICHCLIMBS_API_URL ?? (
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8083/api/v1"
    : "https://www.munichclimbs.de/api/v1"
)

/** Public climbing data changes infrequently; stale data is served while Next refreshes it. */
export const DATA_REVALIDATE_SECONDS = 300

type CacheTag = string

function apiUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`
}

/**
 * The only fetch boundary for server-rendered climbing data. Next deduplicates
 * identical requests within a render and persists these tagged responses between
 * requests for the configured revalidation window.
 */
async function fetchApi(path: string, tags: CacheTag[]): Promise<Response> {
  return fetch(apiUrl(path), {
    cache: "force-cache",
    next: {
      revalidate: DATA_REVALIDATE_SECONDS,
      tags,
    },
  })
}

function requireSuccessfulResponse(response: Response, resource: string): Response {
  if (response.ok) return response

  throw new Error(`Public API request for ${resource} failed: ${response.status} ${response.statusText}`)
}

/**
 * Fetches areas from the API
 * @returns Promise<Area[]> Array of area objects
 * @throws Error if the fetch fails or response is invalid
 */
export async function fetchAreas(): Promise<Area[]> {
  const response = requireSuccessfulResponse(await fetchApi("/areas", ["areas"]), "areas")
  const data: AreasResponse = await response.json()

  // Handle different response formats
  // API Platform returns data in hydra format with @context, @id, @type, member
  let areas: Area[] = []

  if (Array.isArray(data)) {
    areas = data
  } else if (Array.isArray(data['hydra:member'])) {
    areas = data['hydra:member']
  } else if (Array.isArray(data.areas)) {
    areas = data.areas
  } else if (Array.isArray(data.data)) {
    areas = data.data
  } else {
    throw new Error("Invalid public API response format for areas")
  }

  // Transform areas to match the expected format
  return areas.map((area) => ({
    ...area,
    name: area.name || String(area.id),
    url: area.url || area.slug ? `/areas/${area.slug || area.id}` : "#",
  }))
}

export async function fetchRocks(): Promise<Rock[]> {
  const rocks = await fetchHydraCollection<Rock>("/rocks?itemsPerPage=100", ["rocks"])
  return rocks.map((rock) => ({
    ...rock,
    name: rock.name || String(rock.id),
    url: rock.url || rock.slug ? `/rocks/${rock.slug || rock.id}` : "#",
  }))
}

/**
 * Server-owned home-page read model. It uses the same aggregate queries and
 * cache as Symfony, preserving chart buckets, project counts, and map travel
 * times without recreating those rules in React.
 */
export async function fetchHomeData(): Promise<HomeData> {
  const response = requireSuccessfulResponse(await fetchApi("/home", ["home"]), "home")
  const data = await response.json() as Partial<HomeData>
  if (!Array.isArray(data.areas) || !Array.isArray(data.rocks) || !Array.isArray(data.latestRoutes) || !Array.isArray(data.bannedRocks)) {
    throw new Error("Invalid public API response format for home")
  }
  return data as HomeData
}

/** The legacy latest-routes page, exposed as an explicit public read model. */
export async function fetchLatestRoutesPage(): Promise<LatestRoutesPageRoute[]> {
  const response = requireSuccessfulResponse(await fetchApi("/latest-routes", ["latest-routes"]), "latest routes page")
  const data = await response.json() as { routes?: LatestRoutesPageRoute[] }
  if (!Array.isArray(data.routes)) throw new Error("Invalid public API response format for latest routes page")
  return data.routes
}

/** API area item with rocks as returned from /api/areas/{id}. */
export type AreaWithRocks = Area

export type { Route as RouteSummary } from "@/types/route"

export interface TopoSummary {
  id: number
  name: string
  image?: string | null
  number?: number | null
  pathCollection?: string | null
  withSector?: boolean | null
  updatedAt?: string | null
  rocks?: string | { "@id"?: string; id?: number; name?: string; slug?: string }
}

export interface LatestRouteSummary {
  id: number
  name: string
  grade?: string | null
  yearFirstAscent?: number | null
  rock?: string | ApiReference
  area?: string | ApiReference
}

export interface BannedRockSummary {
  id: number
  name: string
  slug?: string
  banned?: number | null
  area?: string | ApiReference
}

export interface RockTranslationSummary {
  id: number
  locale: string
  description?: string | null
  access?: string | null
  nature?: string | null
  flowers?: string | null
}

/** Locales for which the public rock-translation endpoint has a defined policy. */
export type RockTranslationLocale = "de" | "en"

/**
 * A localized rock record plus the outcome of the locale selection.
 *
 * English is allowed to fall back to the German source record. A missing record
 * is kept distinct from that fallback so the UI can say that content is not
 * available instead of pretending it is translated.
 */
export interface RockTranslationResult {
  translation: RockTranslationSummary | null
  contentLocale: RockTranslationLocale | null
  status: "exact" | "fallback" | "missing"
}

interface HydraCollection<T> {
  "hydra:member"?: T[]
  "hydra:view"?: { "hydra:next"?: string }
}

async function fetchHydraCollection<T>(path: string, tags: CacheTag[]): Promise<T[]> {
  const items: T[] = []
  let nextUrl: string | undefined = apiUrl(path)

  // Follow API Platform's pagination links so a busy area does not lose routes.
  while (nextUrl) {
    const response = requireSuccessfulResponse(await fetchApi(nextUrl, tags), "collection")

    const data = (await response.json()) as HydraCollection<T>
    items.push(...(data["hydra:member"] ?? []))
    const next = data["hydra:view"]?.["hydra:next"]
    nextUrl = next ? new URL(next, API_BASE_URL).toString() : undefined
  }

  return items
}

/** Returns the most recently updated public topo with a usable drawing and image. */
export async function fetchLatestTopo(): Promise<TopoSummary | null> {
  const response = requireSuccessfulResponse(
    await fetchApi("/topos?order[updatedAt]=desc&itemsPerPage=1", ["topos"]),
    "latest topo"
  )
  const data = (await response.json()) as HydraCollection<TopoSummary>
  return data["hydra:member"]?.[0] ?? null
}

/** Fetches every public topo belonging to one rock, ordered by its route topo number. */
export async function fetchToposForRock(rockId: string | number): Promise<TopoSummary[]> {
  return fetchHydraCollection<TopoSummary>(
    `/topos?rocks.id=${encodeURIComponent(String(rockId))}&order[number]=asc&itemsPerPage=100`,
    ["topos", `rock-${rockId}`]
  )
}

/** Fetches one locale-specific rock-translation record. */
async function fetchRockTranslationForLocale(
  rockId: string | number,
  locale: RockTranslationLocale
): Promise<RockTranslationSummary | null> {
  const translations = await fetchHydraCollection<RockTranslationSummary>(
    `/rock_translations?rock.id=${encodeURIComponent(String(rockId))}&locale=${encodeURIComponent(locale)}`,
    ["rock-translations", `rock-${rockId}`]
  )

  return translations[0] ?? null
}

/**
 * Returns one rock's localized long-form content from the public API.
 *
 * German is the source locale. English pages use English when present, then
 * deliberately show the German record with `status: "fallback"`. No record in
 * either language returns `status: "missing"`, allowing callers to render an
 * explicit unavailable state instead of silently substituting content.
 */
export async function fetchRockTranslation(
  rockId: string | number,
  locale: RockTranslationLocale = "de"
): Promise<RockTranslationResult> {
  const requestedTranslation = await fetchRockTranslationForLocale(rockId, locale)
  if (requestedTranslation) {
    return { translation: requestedTranslation, contentLocale: locale, status: "exact" }
  }

  if (locale === "en") {
    const germanTranslation = await fetchRockTranslationForLocale(rockId, "de")
    if (germanTranslation) {
      return { translation: germanTranslation, contentLocale: "de", status: "fallback" }
    }
  }

  return { translation: null, contentLocale: null, status: "missing" }
}

/** Returns every published route comment for one rock in a single API request. */
export async function fetchCommentsForRock(rockId: string | number): Promise<PublicComment[]> {
  return fetchHydraCollection<PublicComment>(
    `/comments?route.rock.id=${encodeURIComponent(String(rockId))}&itemsPerPage=100`,
    ["comments", `rock-${rockId}`]
  )
}

/** Returns approved gallery records for one rock. Image URLs are built by lib/media.ts. */
export async function fetchPhotosForRock(rockId: string | number): Promise<PublicPhoto[]> {
  return fetchHydraCollection<PublicPhoto>(
    `/photos?belongsToRock.id=${encodeURIComponent(String(rockId))}&itemsPerPage=100`,
    ["photos", `rock-${rockId}`]
  )
}

/** Returns public video links assigned to one rock. */
export async function fetchVideosForRock(rockId: string | number): Promise<PublicVideo[]> {
  return fetchHydraCollection<PublicVideo>(
    `/videos?videoRocks.id=${encodeURIComponent(String(rockId))}&itemsPerPage=100`,
    ["videos", `rock-${rockId}`]
  )
}

/** Returns the five newest public routes, ordered like the Munich homepage. */
export async function fetchLatestRoutes(): Promise<LatestRouteSummary[]> {
  const response = requireSuccessfulResponse(
    await fetchApi("/routes?order[yearFirstAscent]=desc&itemsPerPage=5", ["routes"]),
    "latest routes"
  )
  const data = (await response.json()) as HydraCollection<LatestRouteSummary>
  return (data["hydra:member"] ?? []).slice(0, 5)
}

/** Returns publicly visible rocks that have a seasonal closure. */
export async function fetchBannedRocks(): Promise<BannedRockSummary[]> {
  const [spring, summer] = await Promise.all([
    fetchHydraCollection<BannedRockSummary>("/rocks?banned=1", ["rocks"]),
    fetchHydraCollection<BannedRockSummary>("/rocks?banned=2", ["rocks"]),
  ])
  return [...spring, ...summer]
}

/**
 * Fetches a single area by slug from the API (e.g. Konstein, Altmuehltal).
 * Uses shared slugifyAreaName/getAreaSlug so URL and lookup stay consistent.
 */
export async function fetchAreaBySlug(slug: string): Promise<AreaWithRocks | null> {
  const areas = await fetchAreas()
  const normalized = slugifyAreaName(slug.trim())
  const area = areas.find((candidate) => getAreaSlug(candidate) === normalized)
  if (!area) return null

  // Fetch full area with rocks from /api/areas/{id}.
  const id = typeof area.id === "string" ? parseInt(area.id, 10) : area.id
  if (Number.isNaN(id)) return null
  const response = requireSuccessfulResponse(
    await fetchApi(`/areas/${id}`, ["areas", `area-${id}`]),
    `area ${id}`
  )
  return (await response.json()) as AreaWithRocks
}

/**
 * Returns the total number of routes for a rock (from GET /api/v1/routes?rock.id={id}).
 */
export async function fetchRouteCountForRock(rockId: string | number): Promise<number> {
  const response = requireSuccessfulResponse(
    await fetchApi(`/routes?rock.id=${rockId}`, ["routes", `rock-${rockId}`]),
    `routes for rock ${rockId}`
  )
  const data = (await response.json()) as { "hydra:totalItems"?: number }
  return data["hydra:totalItems"] ?? 0
}

/** Fetches the published rocks belonging to an area, including their display metadata. */
export async function fetchRocksForArea(areaId: string | number): Promise<Rock[]> {
  return fetchHydraCollection<Rock>(
    `/rocks?area.id=${encodeURIComponent(String(areaId))}`,
    ["rocks", `area-${areaId}`]
  )
}

/** Fetches all published routes for an area so the rock list can show grade distributions. */
export async function fetchRoutesForArea(areaId: string | number): Promise<Route[]> {
  return fetchHydraCollection<Route>(
    `/routes?area.id=${encodeURIComponent(String(areaId))}&itemsPerPage=100`,
    ["routes", `area-${areaId}`]
  )
}

/**
 * Returns the legacy area's Top-100 list from its server-owned contract:
 * published-rock routes with a grade, grade number descending, name ascending,
 * and at most 100 rows.
 */
export async function fetchTopRoutesForArea(areaId: string | number): Promise<AreaTopRoutesResponse> {
  const response = await fetchApi(
    `/areas/${encodeURIComponent(String(areaId))}/top-routes`,
    ["top-routes", `area-${areaId}`]
  )

  // The dedicated endpoint is part of the migration contract, but some
  // production Symfony deployments can temporarily predate it. Top-100 is an
  // enhancement of the area page, so a missing endpoint must not make the
  // entire area unavailable. Other failures remain visible to the route error
  // boundary instead of being mistaken for an intentionally empty result.
  if (response.status === 404) {
    return { routes: [], total: 0, order: { gradeNo: "DESC", name: "ASC" }, limit: 100 }
  }

  requireSuccessfulResponse(response, `top routes for area ${areaId}`)
  const data = (await response.json()) as AreaTopRoutesResponse

  if (!Array.isArray(data.routes) || data.limit !== 100 || data.order?.gradeNo !== "DESC" || data.order?.name !== "ASC") {
    throw new Error(`Invalid public API response format for top routes in area ${areaId}`)
  }

  return data
}

/**
 * Returns the server-calculated final-leg rail estimates for a published rock.
 * The calculation remains shared with the legacy Symfony frontend.
 */
export async function fetchRailwayAccessesForRock(rockId: string | number): Promise<RailwayAccess[]> {
  const response = await fetchApi(
    `/rocks/${encodeURIComponent(String(rockId))}/railway-access`,
    ["railway-access", `rock-${rockId}`]
  )

  // Railway estimates are supplementary data. Until the corresponding
  // Symfony endpoint is deployed, retain the core rock page and omit only
  // this optional section. Do not suppress real upstream failures.
  if (response.status === 404) return []

  requireSuccessfulResponse(response, `railway access for rock ${rockId}`)
  const data = (await response.json()) as RailwayAccessResponse

  if (!Array.isArray(data.accesses)) {
    throw new Error(`Invalid public API response format for railway access of rock ${rockId}`)
  }

  return data.accesses
}
