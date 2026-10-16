import type { Coordinate } from "@/types/area"

export type GradeChartCounts = [number, number, number, number, number, number, number, number, number, number]

export type HomeArea = {
  areaId: number
  name: string
  slug: string
  image?: string | null
  lat?: Coordinate | null
  lng?: Coordinate | null
  travelTimeMinutes?: number | null
  routes: number
  rocks: number
  rocksWithCoordinates: number
  amountProjects: number
  grade_chart_3: number
  grade_chart_4: number
  grade_chart_5: number
  grade_chart_6: number
  grade_chart_7: number
  grade_chart_8: number
  grade_chart_9: number
  grade_chart_10: number
  grade_chart_11: number
}

export type HomeRock = {
  rockId: number
  rockName: string
  rockSlug: string
  areaName: string
  areaSlug: string
  lat: Coordinate
  lng: Coordinate
  travelTimeMinutes?: number | null
  previewImage?: string | null
  amountRoutes: number
  amountProjects: number
  grade_chart_3: number
  grade_chart_4: number
  grade_chart_5: number
  grade_chart_6: number
  grade_chart_7: number
  grade_chart_8: number
  grade_chart_9: number
  grade_chart_10: number
  grade_chart_11: number
}

export type HomeLatestRoute = {
  id: number
  name: string
  grade?: string | null
  rockName: string
  rockSlug: string
  areaSlug: string
}

export type HomeBannedRock = {
  id: number
  name: string
  slug: string
  areaName: string
  areaSlug: string
  banned?: number | null
}

export type HomeData = {
  areas: HomeArea[]
  rocks: HomeRock[]
  latestRoutes: HomeLatestRoute[]
  bannedRocks: HomeBannedRock[]
}

export type LatestRoutesPageRoute = HomeLatestRoute & {
  firstAscent?: string | null
  yearFirstAscent?: number | null
  rating?: number | null
  protection?: number | null
}
