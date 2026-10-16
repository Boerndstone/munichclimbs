import type { Metadata } from "next"
import { connection } from "next/server"

import GermanHome from "@/app/page"
import { fetchHomeData } from "@/lib/api"
import { englishCanonicalPath, localizedAlternates } from "@/lib/seo"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  let description = "Climbing around Munich. Climbing areas, crags and routes at a glance."
  try {
    const { areas } = await fetchHomeData()
    description = `Climbing areas around Munich: ${areas.map((area) => area.name).join(", ")}.`
  } catch {
    // The page renders its own intentional unavailable state during an outage.
  }
  return { title: { absolute: "Munichclimbs" }, description, alternates: { ...localizedAlternates("/"), canonical: englishCanonicalPath("/") }, robots: { index: true, follow: true }, openGraph: { title: "Munichclimbs", description, url: englishCanonicalPath("/"), locale: "en_US", alternateLocale: "de_DE" } }
}

export default function EnglishHome() {
  return <GermanHome locale="en" />
}
