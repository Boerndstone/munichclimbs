/**
 * Canonical slugification for area (and similar) names.
 * Used for URLs, sidebar links, and fetchAreaBySlug lookup so all stay in sync.
 */
export function slugifyAreaName(name: string): string {
  if (!name || typeof name !== "string") return ""
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/**
 * Returns the canonical URL slug for an area.
 * Prefers area.slug when present (normalized), otherwise slugifies area.name.
 */
export function getAreaSlug(area: { name: string; slug?: string | null }): string {
  const raw = area.slug ?? area.name
  const slug = slugifyAreaName(raw)
  return slug || "area"
}
