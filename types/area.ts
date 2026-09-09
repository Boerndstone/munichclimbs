export interface Area {
  id: string | number
  name: string
  slug?: string
  url?: string
  image?: string
  headerImage?: string | null
  orientation?: string | null
  online?: number
  [key: string]: unknown // Allow for additional properties from API
}

export interface AreasResponse {
  areas?: Area[]
  data?: Area[]
  'hydra:member'?: Area[] // API Platform Hydra format
  '@context'?: string
  '@id'?: string
  '@type'?: string
  // Support different response formats
  [key: string]: unknown
}
