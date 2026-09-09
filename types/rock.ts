export interface Rock {
  id: string | number
  name: string
  slug?: string
  url?: string
  image?: string
  previewImage?: string
  height?: number | null
  orientation?: string | null
  online?: boolean | number
  [key: string]: unknown // Allow for additional properties from API
}

export interface RocksResponse {
  rocks?: Rock[]
  data?: Rock[]
  'hydra:member'?: Rock[] // API Platform Hydra format
  [key: string]: unknown // Allow for additional properties from API
}
