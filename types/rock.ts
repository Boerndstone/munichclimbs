export interface Rock {
  id: string | number
  name: string
  slug?: string
  url?: string
  image?: string
  online?: number
  [key: string]: unknown // Allow for additional properties from API
}

export interface RocksResponse {
  rocks?: Rock[]
  data?: Rock[]
  'hydra:member'?: Rock[] // API Platform Hydra format
  [key: string]: unknown // Allow for additional properties from API
}
