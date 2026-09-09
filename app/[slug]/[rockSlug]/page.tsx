import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchAreaBySlug, fetchRouteCountForRock } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string; rockSlug: string }> }

function extractRockId(rockIri: string): string {
  const parts = rockIri.split("/")
  return parts[parts.length - 1] ?? ""
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rockSlug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Not found" }
  const rocks = Array.isArray(area.rocks) ? area.rocks : []
  const rock = rocks.find(
    (r) =>
      r.slug === rockSlug ||
      r.slug?.replace(/_/g, "-") === rockSlug?.replace(/_/g, "-") ||
      extractRockId(r["@id"]) === rockSlug
  )
  if (!rock) return { title: "Rock not found" }
  return {
    title: { absolute: `Munichclimbs | Klettergebiet ${area.name} | Fels ${rock.name}` },
    description: `Felsen ${rock.name} im Klettergebiet ${area.name}`,
  }
}

export default async function RockPage({ params }: Props) {
  const { slug, rockSlug } = await params
  const area = await fetchAreaBySlug(slug)

  if (!area) {
    notFound()
  }

  const rocks = Array.isArray(area.rocks) ? area.rocks : []
  const rock = rocks.find(
    (r) =>
      r.slug === rockSlug ||
      r.slug?.replace(/_/g, "-") === rockSlug?.replace(/_/g, "-") ||
      extractRockId(r["@id"]) === rockSlug
  )

  if (!rock) {
    notFound()
  }

  const rockId = extractRockId(rock["@id"])
  const routeCount = rockId ? await fetchRouteCountForRock(rockId) : 0

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href={`/${slug}`} className="hover:text-foreground">
          {area.name}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{rock.name}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-medium">{rock.name}</h1>
        <Badge variant="secondary">{routeCount} Routen</Badge>
      </div>

      <p className="text-muted-foreground">
        Felsen im Klettergebiet{" "}
        <Link href={`/${slug}`} className="text-primary underline underline-offset-4 hover:no-underline">
          {area.name}
        </Link>
        .
      </p>
    </div>
  )
}
