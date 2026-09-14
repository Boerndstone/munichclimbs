export interface Rock {
  id: string | number
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
  lat?: string | number | null
  lng?: string | number | null
  description?: string | null
  rockDescription?: string | null
  access?: string | null
  rockAccess?: string | null
  nature?: string | null
  rockNature?: string | null
  flowers?: string | null
  rockFlowers?: string | null
  online?: boolean | number
  [key: string]: unknown // Allow for additional properties from API
}

export interface RocksResponse {
  rocks?: Rock[]
  data?: Rock[]
  'hydra:member'?: Rock[] // API Platform Hydra format
  [key: string]: unknown // Allow for additional properties from API
}
