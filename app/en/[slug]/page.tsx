import type { Metadata } from "next"

import GermanAreaPage from "@/app/[slug]/page"
import { fetchAreaBySlug } from "@/lib/api"
import { englishCanonicalPath, localizedAlternates } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await fetchAreaBySlug(slug)
  if (!area) return { title: "Climbing area not found" }

  const path = `/${slug}`
  const description = `Climbing area ${area.name} – crags and routes.`
  return {
    title: { absolute: `Munichclimbs | Climbing area ${area.name}` },
    description,
    alternates: { ...localizedAlternates(path), canonical: englishCanonicalPath(path) },
    openGraph: {
      title: `Climbing area ${area.name} | Munichclimbs`,
      description,
      url: englishCanonicalPath(path),
      locale: "en_US",
      alternateLocale: "de_DE",
    },
  }
}

export default GermanAreaPage
