import type { ApiReference } from "@/types/public-content"

export type Coordinate = string | number

export interface RailwayStation {
  name?: string | null
  lat?: Coordinate | null
  lng?: Coordinate | null
}

export interface RailwayStationGroup {
  trainStations?: RailwayStation[]
}

export type RailwayStationData = RailwayStation | RailwayStationGroup | RailwayStation[]

export interface AreaRock {
  "@id"?: string
  "@type"?: string
  id?: string | number
  name: string
  slug?: string
  url?: string
  routeCount?: number
}

export interface Area {
  "@id"?: string
  "@type"?: string
  id: string | number
  name: string
  slug?: string
  url?: string
  image?: string
  headerImage?: string | null
  orientation?: string | null
  lat?: Coordinate | null
  lng?: Coordinate | null
  zoom?: number | null
  online?: boolean | number | null
  sequence?: number | null
  rocks?: AreaRock[]
  routes?: Array<string | ApiReference>
  travelTimeMinutes?: number | null
  rockResponsibility?: string | null
  railwayStation?: RailwayStationData | null
  kletterkonzeption?: string | null
}

export interface AreasResponse {
  areas?: Area[]
  data?: Area[]
  'hydra:member'?: Area[] // API Platform Hydra format
  '@context'?: string
  '@id'?: string
  '@type'?: string
}
