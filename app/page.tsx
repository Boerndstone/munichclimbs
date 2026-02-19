import Link from "next/link"
import { fetchAreas, fetchRocks } from "@/lib/api"
import { getAreaSlug } from "@/lib/slugify"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AreaChart } from "@/components/area-chart"

function getAreaHref(area: { name: string; slug?: string }): string {
  return `/${getAreaSlug(area)}`
}

// Helper function to count routes by grade ranges
function getRouteStats(routes: unknown[]) {
  if (!Array.isArray(routes)) {
    return { easy: 0, medium: 0, hard: 0, project: 0 }
  }

  let easy = 0    // 1-5
  let medium = 0  // 6-7
  let hard = 0    // 8-11
  let project = 0 // Proj.

  routes.forEach((route) => {
    const routeObj = route as { grade?: string | number; [key: string]: unknown }
    const grade = routeObj.grade
    
    if (!grade) return

    // Handle string grades like "5a", "6b", "8a", etc.
    const gradeStr = String(grade).toLowerCase()
    const gradeNum = parseInt(gradeStr)
    
    if (gradeStr.includes('proj') || gradeStr === 'project') {
      project++
    } else if (!isNaN(gradeNum)) {
      if (gradeNum >= 1 && gradeNum <= 5) {
        easy++
      } else if (gradeNum >= 6 && gradeNum <= 7) {
        medium++
      } else if (gradeNum >= 8 && gradeNum <= 11) {
        hard++
      }
    }
  })

  return { easy, medium, hard, project }
}

export default async function Home() {
  const areas = await fetchAreas().catch((error) => {
    console.error("Failed to load areas:", error)
    return []
  })

  console.log(areas)

  // Filter only online areas
  const onlineAreas = areas.filter((area) => area.online === 1)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Klettergebiete um München</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {onlineAreas.map((area) => (
          <Link key={area.id} href={getAreaHref(area)}>
            <Card className="overflow-hidden transition-shadow hover:shadow-md pt-0">
              <div className="relative aspect-video w-full">
                <picture>
                  <source
                    srcSet={`https://www.munichclimbs.de/uploads/areas/${area.image}@1x.webp, https://www.munichclimbs.de/uploads/areas/${area.image}@2x.webp 2x, https://www.munichclimbs.de/uploads/areas/${area.image}@3x.webp 3x`}
                  />
                  <img
                    src={`https://www.munichclimbs.de/uploads/areas/${area.image}.webp`}
                    alt={area.name}
                    className="relative z-20 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <CardHeader>
                <CardTitle>{area.name}</CardTitle>
                <CardAction>
                  <Badge variant="outline">{Array.isArray(area.rocks) ? area.rocks.length : 0} Felsen</Badge>
                  <Badge variant="outline">{Array.isArray(area.routes) ? area.routes.length : 0} Routen</Badge>
                </CardAction>
              </CardHeader>
              <CardHeader>
                <CardDescription>
                  <div className="mb-5"><AreaChart /></div>
                
                  {/* {Array.isArray(area.routes) && area.routes.length > 0 && (() => {
                    const stats = getRouteStats(area.routes)
                    return (
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <div className="text-center px-2 py-1 text-xs text-white bg-green-500">1 - 5</div>
                          <div className="text-center text-white bg-gray-400 mt-1 text-xs">
                            <div className="px-2 py-1 bg-green-500">
                              {stats.easy}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-center px-2 py-1 text-xs text-white bg-amber-500">6 - 7</div>
                          <div className="text-center text-white bg-gray-400 mt-1 text-xs">
                            <div className="px-2 py-1 bg-amber-500">
                              {stats.medium}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-center px-2 py-1 text-xs text-white bg-red-500">8 - 11</div>
                          <div className="text-center text-white bg-gray-400 mt-1 text-xs">
                            <div className="px-2 py-1 bg-red-500">
                              {stats.hard}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-center px-2 py-1 text-xs text-white bg-black">Proj.</div>
                          <div className="text-center text-white bg-gray-400 mt-1 text-xs">
                            <div className="px-2 py-1 bg-black">
                              {stats.project}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()} */}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">{area.name}</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
