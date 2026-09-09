import Image from "next/image"

type Props = {
  name: string
  headerImage?: string | null
}

export function AreaHero({ name, headerImage }: Props) {
  return (
    <section className="relative w-full">
      <div className="max-h-[300px] w-full overflow-hidden bg-muted">
        {headerImage ? (
          <Image
            src={`https://www.munichclimbs.de/uploads/header/${headerImage}-large-@1x.webp`}
            alt={`Klettergebiet ${name}`}
            width={1600}
            height={500}
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="block h-auto w-full object-contain"
          />
        ) : (
          <div className="h-[100px] bg-gradient-to-br from-muted to-secondary" />
        )}
      </div>

      <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
        <div className="rounded-md bg-white/60 p-3 shadow-md ring-1 ring-black/5 dark:bg-white/50 dark:ring-white/10">
          <h1 className="text-2xl font-medium text-black sm:text-3xl">{name}</h1>
        </div>
      </div>
    </section>
  )
}
