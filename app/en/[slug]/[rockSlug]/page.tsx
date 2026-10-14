import type { Metadata } from "next"

import { RockPageContent } from "@/app/[slug]/[rockSlug]/page"
import { fetchAreaBySlug, fetchRocksForArea } from "@/lib/api"
import { englishCanonicalPath, localizedAlternates } from "@/lib/seo"
import type { Rock } from "@/types/rock"

type Props = { params: Promise<{ slug: string; rockSlug: string }> }

function matchesRockSlug(rock: Rock, rockSlug: string) {
  const normalized = rockSlug.replace(/_/g, "-").toLowerCase()
  return rock.slug?.replace(/_/g, "-").toLowerCase() === normalized || String(rock.id) === rockSlug
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, rockSlug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Crag not found" }

  const rock = (await fetchRocksForArea(area.id)).find((item) => matchesRockSlug(item, rockSlug))
  if (!rock) return { title: "Crag not found" }

  const path = `/${slug}/${rockSlug}`
  const description = `Crag ${rock.name} in the climbing area ${area.name} – routes, grades and first ascents.`
  return {
    title: { absolute: `Munichclimbs | Climbing area ${area.name} | Crag ${rock.name}` },
    description,
    alternates: { ...localizedAlternates(path), canonical: englishCanonicalPath(path) },
    openGraph: {
      title: `${rock.name} in the climbing area ${area.name} | Munichclimbs`,
      description,
      url: englishCanonicalPath(path),
      locale: "en_US",
    },
  }
}

export default function EnglishRockPage({ params }: Props) {
  return <RockPageContent params={params} locale="en" />
}
