"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ChevronRight } from "lucide-react"
import type { Area } from "@/types/area"
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface CollapsibleAreaItemProps {
  area: Area
}

export function CollapsibleAreaItem({ area }: CollapsibleAreaItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const imageUrl = area.image
  const rocks = Array.isArray(area.rocks) ? area.rocks : []
  const hasRocks = rocks.length > 0

  return (
    <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {imageUrl ? (
              <Image
                src={`https://www.munichclimbs.de/build/images/navigationThumbs/${area.image}.webp`}
                alt={area.name}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded"
              />
            ) : (
              <MapPin />
            )}
            <span>{area.name}</span>
            {hasRocks && (
              <ChevronRight className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {hasRocks && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {rocks.map((rock: { id?: string | number; name?: string; url?: string; slug?: string; [key: string]: unknown }) => {
                const areaSlug = area.slug ?? area.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "area"
                const rockUrl = rock.slug ? `/${areaSlug}/${rock.slug}` : (rock.id ? `/${areaSlug}/${rock.id}` : "#")
                const rockName = rock.name || String(rock.id || "")
                return (
                  <SidebarMenuSubItem key={rock.id || rockName}>
                    <SidebarMenuSubButton asChild>
                      <Link href={rockUrl}>
                        <span>{rockName}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}
