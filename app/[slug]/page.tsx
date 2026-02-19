import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchAreaBySlug, fetchRouteCountForRock } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

function extractRockId(rockIri: string): string {
  const parts = rockIri.split("/")
  return parts[parts.length - 1] ?? ""
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Area not found" }
  return {
    title: area.name,
    description: `Klettergebiet ${area.name} – Felsen und Routen`,
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)

  if (!area) {
    notFound()
  }

  const rocks = Array.isArray(area.rocks) ? area.rocks : []
  const rocksWithCounts = await Promise.all(
    rocks.map(async (rock) => {
      const rockId = extractRockId(rock["@id"])
      const rockRouteCount = typeof rock.routeCount === "number" ? rock.routeCount : null
      const routeCount =
        rockRouteCount !== null
          ? rockRouteCount
          : rockId
            ? await fetchRouteCountForRock(rockId)
            : 0
      return {
        id: rockId,
        name: rock.name,
        slug: rock.slug,
        routeCount,
      }
    })
  )

  const totalRoutes = rocksWithCounts.reduce((sum, r) => sum + r.routeCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-medium">{area.name}</h1>
        <Badge variant="secondary">{rocks.length} Felsen</Badge>
        <Badge variant="secondary">{totalRoutes} Routen</Badge>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Felsen</h2>
        <ul className="space-y-2">
          {rocksWithCounts.map((rock) => (
            <li key={rock.id}>
              <Link
                href={rock.slug ? `/${slug}/${rock.slug}` : `/${slug}/${rock.id}`}
                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm hover:bg-muted/50 hover:border-border"
              >
                <span>{rock.name}</span>
                <Badge variant="outline">{rock.routeCount} Routen</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
