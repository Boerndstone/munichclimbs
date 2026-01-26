import type { Area, AreasResponse } from "@/types/area"

const API_BASE_URL = "https://munichclimbs.com/api"

/**
 * Fetches areas from the API
 * @returns Promise<Area[]> Array of area objects
 * @throws Error if the fetch fails or response is invalid
 */
export async function fetchAreas(): Promise<Area[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      // Add cache revalidation for Next.js
      next: { revalidate: 3600 }, // Revalidate every hour
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
      // Try to find image from various possible property names
      let imageUrl = 
        area.image || 
        area.imageUrl || 
        area.image_url || 
        area.thumbnail || 
        area.photo ||
        area.picture ||
        (typeof area.media === 'object' && area.media && 'image' in area.media ? (area.media as { image?: string }).image : undefined) ||
        (Array.isArray(area.files) && area.files[0]?.url) ||
        undefined

      // If no image URL found, construct it from area name/slug
      // Pattern: https://www.munichclimbs.de/build/images/navigationThumbs/{name}.webp
      if (!imageUrl) {
        const areaName = (area.slug || area.name || String(area.id))
          .toLowerCase()
          .replace(/\s+/g, '') // Remove spaces
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
        imageUrl = `https://www.munichclimbs.de/build/images/navigationThumbs/${areaName}.webp`
      }

      return {
        ...area,
        name: area.name || String(area.id),
        url: area.url || area.slug ? `/areas/${area.slug || area.id}` : "#",
        image: imageUrl,
      }
    })
  } catch (error) {
    console.error("Error fetching areas:", error)
    throw error
  }
}
