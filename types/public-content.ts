/** A compact embedded API Platform resource returned by public relations. */
export interface ApiReference {
  "@id"?: string
  "@type"?: string
  id?: string | number
  name?: string
  slug?: string
  grade?: string | null
}

export interface PublicUser {
  "@id"?: string
  "@type"?: string
  id?: string | number
  username?: string | null
  avatar?: string | null
  avatarUrl?: string | null
}

/** A published route comment, including its author and route relationship. */
export interface PublicComment {
  "@id"?: string
  "@type"?: string
  id: number
  comment: string
  datetime?: string | null
  createdAt?: string | null
  route?: ApiReference | null
  user?: PublicUser | null
}

/** A published gallery image and the area, rock, and optional route it depicts. */
export interface PublicPhoto {
  "@id"?: string
  "@type"?: string
  id: number
  name: string
  description?: string | null
  /** API field name intentionally matches the existing public response. */
  photgrapher?: string | null
  belongsToArea?: ApiReference | null
  belongsToRock?: ApiReference | null
  belongsToRoute?: ApiReference | null
}

/** A published external video and the area, rock, and optional route it belongs to. */
export interface PublicVideo {
  "@id"?: string
  "@type"?: string
  id: number
  videoLink?: string | null
  videoArea?: ApiReference | null
  videoRocks?: ApiReference | null
  videoRoutes?: ApiReference | null
}
