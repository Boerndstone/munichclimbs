import type { Coordinate } from "@/types/area"
import type { ApiReference } from "@/types/public-content"

export type PathCoordinate =
  | { type: "Point"; coordinates: [number, number] }
  | { type: "LineString"; coordinates: Array<[number, number]> }

export interface Rock {
  id: string | number
  "@id"?: string
  "@type"?: string
  area?: string | ApiReference | null
  name: string
  slug?: string
  url?: string
  image?: string
  previewImage?: string
  childFriendly?: boolean | null
  sunny?: boolean | null
  rain?: boolean | null
  train?: boolean | null
  bike?: boolean | null
  height?: number | null
  orientation?: string | null
  season?: string | null
  zone?: string | number | null
  lat?: Coordinate | null
  lng?: Coordinate | null
  zoom?: number | null
  nr?: number | null
  banned?: number | null
  pathCoordinates?: PathCoordinate[] | null
  description?: string | null
  rockDescription?: string | null
  access?: string | null
  rockAccess?: string | null
  nature?: string | null
  rockNature?: string | null
  flowers?: string | null
  rockFlowers?: string | null
  online?: boolean | number | null
}

export interface RocksResponse {
  rocks?: Rock[]
  data?: Rock[]
  'hydra:member'?: Rock[] // API Platform Hydra format
}
