import type { ApiReference } from "@/types/public-content"

/** A published climbing route as returned by the public API. */
export interface Route {
  "@id"?: string
  "@type"?: string
  id: number
  name: string
  nr?: number | null
  area?: string | ApiReference | null
  rock?: string | ApiReference | null
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
  videoLink?: string | null
}
