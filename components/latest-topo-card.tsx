import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { TopoSummary } from "@/lib/api"

type Props = {
  topo: TopoSummary | null
  areaSlug?: string
  areaName?: string
  rockSlug?: string
  rockName?: string
}

function topoAnchor(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase()
}

export function LatestTopoCard({ topo, areaSlug, areaName, rockSlug, rockName }: Props) {
  if (!topo || !areaSlug || !rockSlug) return null

  const href = `/${areaSlug}/${rockSlug}#${topoAnchor(topo.name)}`

  return (
    <section className="overflow-hidden rounded-lg border border-[#dc2626] bg-card shadow-md dark:border-[#dc2626]/70" aria-labelledby="latest-topo-heading">
      <h2 id="latest-topo-heading" className="bg-[#dc2626] px-3 py-2 text-lg font-light leading-normal text-white">
        Neueste Topos
      </h2>
      <div className="space-y-3 px-3 py-3 text-sm leading-relaxed">
        <Link href={href} className="group block overflow-hidden rounded-lg">
          {topo.image && (
            <Image
              src={`https://www.munichclimbs.de/build/images/topos/${topo.image}.webp`}
              alt={`Topo ${topo.name}, Fels ${rockName ?? ""}, Klettergebiet ${areaName ?? ""}`}
              width={800}
              height={500}
              sizes="(min-width: 1024px) 320px, 100vw"
              className="aspect-[16/10] w-full rounded-lg object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          )}
        </Link>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{topo.name}</p>
          {(rockName || areaName) && (
            <p className="text-sm text-muted-foreground">
              {rockName}{rockName && areaName ? " · " : ""}{areaName}
            </p>
          )}
        </div>
        <hr className="border-0 border-t border-dotted border-border" />
        <Link href={href} className="inline-flex items-center text-sm font-semibold text-foreground hover:underline">
          <ChevronRight className="size-4" aria-hidden="true" />
          Mehr erfahren
        </Link>
      </div>
    </section>
  )
}
