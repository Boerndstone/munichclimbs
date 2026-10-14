import type { Metadata } from "next"

import GermanHome from "@/app/page"
import { englishCanonicalPath, localizedAlternates } from "@/lib/seo"

export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: "Munichclimbs" },
  description: "Climbing around Munich. Climbing areas, crags and routes at a glance.",
  alternates: {
    ...localizedAlternates("/"),
    canonical: englishCanonicalPath("/"),
  },
  openGraph: {
    title: "Munichclimbs",
    description: "Climbing around Munich. Climbing areas, crags and routes at a glance.",
    url: englishCanonicalPath("/"),
    locale: "en_US",
  },
}

export default GermanHome
