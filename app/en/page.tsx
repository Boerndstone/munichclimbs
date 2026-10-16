import type { Metadata } from "next"
import { connection } from "next/server"

import GermanHome from "@/app/page"
import { fetchHomeData } from "@/lib/api"
import { englishCanonicalPath, localizedAlternates } from "@/lib/seo"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const { areas } = await fetchHomeData()
  const description = `Climbing areas around Munich: ${areas.map((area) => area.name).join(", ")}.`
  return { title: { absolute: "Munichclimbs" }, description, alternates: { ...localizedAlternates("/"), canonical: englishCanonicalPath("/") }, robots: { index: true, follow: true }, openGraph: { title: "Munichclimbs", description, url: englishCanonicalPath("/"), locale: "en_US", alternateLocale: "de_DE" } }
}

export default function EnglishHome() {
  return <GermanHome locale="en" />
}
