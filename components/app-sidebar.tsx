import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { fetchAreas } from "@/lib/api"
import type { Area } from "@/types/area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export async function AppSidebar() {
  const areas: Area[] = await fetchAreas().catch((error) => {
    console.error("Failed to load areas:", error)
    return [] as Area[]
  })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <Link href="/" className="chelsea-market-regular text-[20px] mb-4">
              munichclimbs
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {areas.length > 0 ? (
                areas.map((area) => {
                  const imageUrl = area.image
                  return (
                    <SidebarMenuItem key={area.id}>
                      <SidebarMenuButton asChild>
                        <a href={area.url || "#"}>
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={area.name}
                              width={16}
                              height={16}
                              className="size-4 shrink-0 rounded"
                            />
                          ) : (
                            <MapPin />
                          )}
                          <span>{area.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              ) : (
                <SidebarMenuItem>
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No areas available
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}