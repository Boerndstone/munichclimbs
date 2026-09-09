import { AreaCard } from "@/components/area-card"
import { fetchAreas, fetchRoutesForArea } from "@/lib/api"

export default async function Home() {
  const areas = await fetchAreas().catch((error) => {
    console.error("Failed to load areas:", error)
    return []
  })
  const onlineAreas = areas.filter((area) => Number(area.online) === 1)
  const areasWithRoutes = await Promise.all(
    onlineAreas.map(async (area) => ({
      area,
      routes: await fetchRoutesForArea(area.id),
    }))
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Klettergebiete um München</h1>
      <section className="flex flex-col gap-4 lg:max-w-[42rem]" aria-label="Klettergebiete">
        {areasWithRoutes.map(({ area, routes }) => (
          <AreaCard key={area.id} area={area} routes={routes} />
        ))}
      </section>
    </div>
  )
}
