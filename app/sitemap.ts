import type { MetadataRoute } from "next"

import { fetchAreas, fetchRocks } from "@/lib/api"
import { getAreaSlug } from "@/lib/slugify"
import type { Area } from "@/types/area"
import type { Rock } from "@/types/rock"

export const revalidate = 300

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.munichclimbs.de"

function resourceId(value: unknown): string | undefined {
  if (typeof value === "string") return value.split("/").filter(Boolean).at(-1)
  if (value && typeof value === "object" && "id" in value) {
    const id = value.id
    return typeof id === "string" || typeof id === "number" ? String(id) : undefined
  }
  return undefined
}

function online(resource: Area | Rock): boolean {
  return Number(resource.online) === 1
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, rocks] = await Promise.all([fetchAreas(), fetchRocks()])
  const onlineAreas = areas.filter(online)
  const areaById = new Map(onlineAreas.map((area) => [String(area.id), area]))

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: new URL("/datenschutz", siteUrl).toString(), changeFrequency: "yearly", priority: 0.2 },
    { url: new URL("/impressum", siteUrl).toString(), changeFrequency: "yearly", priority: 0.2 },
  ]
  const areaEntries = onlineAreas.map((area) => ({
    url: new URL(`/${getAreaSlug(area)}`, siteUrl).toString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  const rockEntries = rocks.flatMap((rock) => {
    if (!online(rock) || !rock.slug) return []
    const areaId = resourceId(rock.area)
    if (!areaId) return []
    const area = areaById.get(areaId)
    if (!area) return []
    return [{
      url: new URL(`/${getAreaSlug(area)}/${rock.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }]
  })

  return [...staticEntries, ...areaEntries, ...rockEntries]
}
