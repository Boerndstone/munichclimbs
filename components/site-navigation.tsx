import { fetchAreas } from "@/lib/api"
import { NavigationMenu } from "@/components/navigation-menu"
import type { Area } from "@/types/area"

export async function SiteNavigation() {
  const areas: Area[] = await fetchAreas().catch((error) => {
    console.error("Failed to load navigation areas:", error)
    return [] as Area[]
  })

  return <NavigationMenu areas={areas} />
}
