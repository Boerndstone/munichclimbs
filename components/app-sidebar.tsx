import Link from "next/link"
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
                areas.map((area) => (
                  <SidebarMenuItem key={area.id}>
                    <SidebarMenuButton asChild>
                      <a href={area.url || "#"}>
                        <MapPin />
                        <span>{area.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
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