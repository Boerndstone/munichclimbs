import Image from "next/image"

import { AreaHeroMoreMenu } from "@/components/area-hero-more-menu"
import { headerImageUrl } from "@/lib/media"
import type { Coordinate } from "@/types/area"
import type { Rock } from "@/types/rock"
import type { AreaTopRoute } from "@/types/public-derived"

type Props = {
  name: string
  headerImage?: string | null
  locale?: "de" | "en"
  topRoutes?: AreaTopRoute[]
  areaSlug: string
  kletterkonzeption?: string | null
  lat?: Coordinate | null
  lng?: Coordinate | null
  rocks: Rock[]
}

export function AreaHero({ name, headerImage, locale = "de", topRoutes = [], areaSlug, kletterkonzeption, lat, lng, rocks }: Props) {
  return (
    <section className="relative w-full">
      <div className="h-[300px] w-full overflow-hidden bg-muted">
        {headerImage ? (
          <Image
            src={headerImageUrl(headerImage)}
            alt={`Klettergebiet ${name}`}
            width={1600}
            height={500}
            priority
            sizes="100vw"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="h-[100px] bg-gradient-to-br from-muted to-secondary" />
        )}
      </div>

      <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-[1024px] px-2 pt-3 sm:px-4 sm:pt-3">
        <div className="flex items-center justify-between gap-3 rounded-md bg-white/60 p-3 shadow-md ring-1 ring-black/5 dark:bg-white/50 dark:ring-white/10">
          <h1 className="min-w-0 truncate text-2xl font-medium text-black sm:text-3xl">{name}</h1>
          <div className="flex shrink-0 items-center">
            <AreaHeroMoreMenu areaName={name} areaSlug={areaSlug} locale={locale} kletterkonzeption={kletterkonzeption} topRoutes={topRoutes} areaLat={lat} areaLng={lng} rocks={rocks} />
          </div>
        </div>
      </div>
    </section>
  )
}
