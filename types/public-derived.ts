/** One row from the legacy area's Top-100 selection. */
export interface AreaTopRoute {
  id: number
  name: string
  grade?: string | null
  gradeNo?: number | null
  firstAscent?: string | null
  yearFirstAscent?: number | null
  rating?: number | null
  protection?: number | null
  rockQuality?: boolean | null
  climbingStyle?: string[] | null
  rockName?: string | null
  rockSlug?: string | null
  areaSlug?: string | null
}

export interface AreaTopRoutesResponse {
  routes: AreaTopRoute[]
  total: number
  order: { gradeNo: "DESC"; name: "ASC" }
  limit: 100
}

/** Approximate final-leg journey from the nearest configured rail station. */
export interface RailwayAccess {
  stationName: string
  minutes: number
  mode: "walk" | "bike"
}

export interface RailwayAccessResponse {
  accesses: RailwayAccess[]
}
