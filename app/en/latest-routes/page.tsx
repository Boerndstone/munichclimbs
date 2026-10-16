import { connection } from "next/server"
import { LatestRoutesPage } from "@/components/latest-routes-page"
import { fetchLatestRoutesPage } from "@/lib/api"

export const revalidate = 300
export default async function EnglishLatestRoutesPage() { await connection(); return <LatestRoutesPage routes={await fetchLatestRoutesPage()} locale="en" /> }
