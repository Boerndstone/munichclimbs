import type { Area, AreasResponse } from "@/types/area"
import type { Rock, RocksResponse } from "@/types/rock"
import { getAreaSlug, slugifyAreaName } from "@/lib/slugify"

const API_BASE_URL = "https://www.munichclimbs.de/api/v1"
// Public climbing data changes infrequently. Revalidate in the background instead
// of blocking every page transition on a round trip to the Symfony API.
const API_FETCH_OPTIONS = { next: { revalidate: 300 } } as const

/**
 * Fetches areas from the API
 * @returns Promise<Area[]> Array of area objects
 * @throws Error if the fetch fails or response is invalid
 */
export async function fetchAreas(): Promise<Area[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/areas`, API_FETCH_OPTIONS)

    if (!response.ok) {
      throw new Error(`Failed to fetch areas: ${response.status} ${response.statusText}`)
    }

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
      throw new Error("Invalid API response format")
    }

    // Transform areas to match the expected format
    return areas.map((area) => {
      return {
        ...area,
        name: area.name || String(area.id),
        url: area.url || area.slug ? `/areas/${area.slug || area.id}` : "#",
      }
    })
  } catch (error) {
    console.error("Error fetching areas:", error)
    throw error
  }
}

export async function fetchRocks(): Promise<Rock[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rocks`, API_FETCH_OPTIONS)

    if (!response.ok) {
      throw new Error(`Failed to fetch rocks: ${response.status} ${response.statusText}`)
    }

    const data: RocksResponse = await response.json()

    // Handle different response formats
    let rocks: Rock[] = []
    
    if (Array.isArray(data)) {
      rocks = data
    } else if (Array.isArray(data['hydra:member'])) {
      rocks = data['hydra:member']
    } else if (Array.isArray(data.rocks)) {
      rocks = data.rocks
    } else if (Array.isArray(data.data)) {
      rocks = data.data
    } else {
      throw new Error("Invalid API response format")
    }

    return rocks.map((rock) => {
      return {
        ...rock,
        name: rock.name || String(rock.id),
        url: rock.url || rock.slug ? `/rocks/${rock.slug || rock.id}` : "#",
      }
    })
  } catch (error) {
    console.error("Error fetching rocks:", error)
    throw error
  }
}

/** API area item with rocks as returned from /api/areas (hydra) */
export interface AreaWithRocks extends Area {
  rocks?: Array<{ "@id": string; name: string; slug?: string; routeCount?: number }>
  [key: string]: unknown
}

export interface RouteSummary {
  id: number
  name?: string
  nr?: number | null
  grade?: string | null
  gradeNo?: number | null
  scale?: string | null
  firstAscent?: string | null
  yearFirstAscent?: number | null
  rating?: number | null
  protection?: number | null
  rockQuality?: boolean | null
  climbingStyle?: string[] | null
  topoId?: number | null
  rock?: { "@id"?: string; id?: number; name?: string } | string
}

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

type ApiReference = { "@id"?: string; id?: number; name?: string }

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

interface HydraCollection<T> {
  "hydra:member"?: T[]
  "hydra:view"?: { "hydra:next"?: string }
}

async function fetchHydraCollection<T>(url: string): Promise<T[]> {
  const items: T[] = []
  let nextUrl: string | undefined = url

  // Follow API Platform's pagination links so a busy area does not lose routes.
  while (nextUrl) {
    const response = await fetch(nextUrl, API_FETCH_OPTIONS)
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.status}`)
    }

    const data = (await response.json()) as HydraCollection<T>
    items.push(...(data["hydra:member"] ?? []))
    const next = data["hydra:view"]?.["hydra:next"]
    nextUrl = next ? new URL(next, API_BASE_URL).toString() : undefined
  }

  return items
}

/** Returns the most recently updated public topo with a usable drawing and image. */
export async function fetchLatestTopo(): Promise<TopoSummary | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/topos?order[updatedAt]=desc&itemsPerPage=1`,
      API_FETCH_OPTIONS
    )
    if (!response.ok) return null

    const data = (await response.json()) as HydraCollection<TopoSummary>
    return data["hydra:member"]?.[0] ?? null
  } catch (error) {
    console.error("Error fetching latest topo:", error)
    return null
  }
}

/** Fetches every public topo belonging to one rock, ordered by its route topo number. */
export async function fetchToposForRock(rockId: string | number): Promise<TopoSummary[]> {
  try {
    return await fetchHydraCollection<TopoSummary>(
      `${API_BASE_URL}/topos?rocks.id=${encodeURIComponent(String(rockId))}&order[number]=asc`
    )
  } catch (error) {
    console.error("Error fetching rock topos:", error)
    return []
  }
}

/** Returns the five newest public routes, ordered like the Munich homepage. */
export async function fetchLatestRoutes(): Promise<LatestRouteSummary[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/routes?order[yearFirstAscent]=desc&itemsPerPage=5`,
      API_FETCH_OPTIONS
    )
    if (!response.ok) return []

    const data = (await response.json()) as HydraCollection<LatestRouteSummary>
    return (data["hydra:member"] ?? []).slice(0, 5)
  } catch (error) {
    console.error("Error fetching latest routes:", error)
    return []
  }
}

/** Returns publicly visible rocks that have a seasonal closure. */
export async function fetchBannedRocks(): Promise<BannedRockSummary[]> {
  try {
    const [spring, summer] = await Promise.all([
      fetchHydraCollection<BannedRockSummary>(`${API_BASE_URL}/rocks?banned=1`),
      fetchHydraCollection<BannedRockSummary>(`${API_BASE_URL}/rocks?banned=2`),
    ])
    return [...spring, ...summer]
  } catch (error) {
    console.error("Error fetching seasonal closures:", error)
    return []
  }
}

/**
 * Fetches a single area by slug from the API (e.g. Konstein, Altmuehltal).
 * Uses shared slugifyAreaName/getAreaSlug so URL and lookup stay consistent.
 */
export async function fetchAreaBySlug(slug: string): Promise<AreaWithRocks | null> {
  try {
    const areas = await fetchAreas()
    const normalized = slugifyAreaName(slug.trim())
    const area = areas.find((a) => getAreaSlug(a) === normalized)
    if (!area) return null
    // Fetch full area with rocks from /api/areas/{id}
    const id = typeof area.id === "string" ? parseInt(area.id, 10) : area.id
    if (Number.isNaN(id)) return null
    const res = await fetch(`${API_BASE_URL}/areas/${id}`, API_FETCH_OPTIONS)
    if (!res.ok) return null
    const data = (await res.json()) as AreaWithRocks
    return data
  } catch (error) {
    console.error("Error fetching area by slug:", error)
    return null
  }
}

/**
 * Returns the total number of routes for a rock (from GET /api/v1/routes?rock.id={id}).
 */
export async function fetchRouteCountForRock(rockId: string | number): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/routes?rock.id=${rockId}`, API_FETCH_OPTIONS)
    if (!res.ok) return 0
    const data = (await res.json()) as { "hydra:totalItems"?: number }
    return data["hydra:totalItems"] ?? 0
  } catch {
    return 0
  }
}

/** Fetches the published rocks belonging to an area, including their display metadata. */
export async function fetchRocksForArea(areaId: string | number): Promise<Rock[]> {
  try {
    return await fetchHydraCollection<Rock>(
      `${API_BASE_URL}/rocks?area.id=${encodeURIComponent(String(areaId))}`
    )
  } catch (error) {
    console.error("Error fetching rocks for area:", error)
    return []
  }
}

/** Fetches all published routes for an area so the rock list can show grade distributions. */
export async function fetchRoutesForArea(areaId: string | number): Promise<RouteSummary[]> {
  try {
    return await fetchHydraCollection<RouteSummary>(
      `${API_BASE_URL}/routes?area.id=${encodeURIComponent(String(areaId))}&itemsPerPage=100`
    )
  } catch (error) {
    console.error("Error fetching routes for area:", error)
    return []
  }
}
