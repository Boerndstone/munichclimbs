import Link from "next/link"
import { fetchAreas } from "@/lib/api"
import type { Area } from "@/types/area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CollapsibleAreaItem } from "@/components/collapsible-area-item"

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
                areas.filter((area) => area.online === 1).map((area) => (
                  <CollapsibleAreaItem key={area.id} area={area} />
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