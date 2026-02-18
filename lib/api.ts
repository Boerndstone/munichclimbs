import type { Area, AreasResponse } from "@/types/area"
import type { Rock, RocksResponse } from "@/types/rock"

const API_BASE_URL = "https://munichclimbs.com/api"

/**
 * Fetches areas from the API
 * @returns Promise<Area[]> Array of area objects
 * @throws Error if the fetch fails or response is invalid
 */
export async function fetchAreas(): Promise<Area[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      cache: 'no-store',
    })

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
    const response = await fetch(`${API_BASE_URL}/rocks`, {
      cache: 'no-store',
    })

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