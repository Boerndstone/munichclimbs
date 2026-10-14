import Image from "next/image"

import { headerImageUrl } from "@/lib/media"

type Props = {
  name: string
  headerImage?: string | null
}

export function AreaHero({ name, headerImage }: Props) {
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
        <div className="rounded-md bg-white/60 p-3 shadow-md ring-1 ring-black/5 dark:bg-white/50 dark:ring-white/10">
          <h1 className="text-2xl font-medium text-black sm:text-3xl">{name}</h1>
        </div>
      </div>
    </section>
  )
}
