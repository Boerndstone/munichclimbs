"use client"

import { useRef, useState } from "react"
import { Database, Info, Map } from "lucide-react"

import { AreaMapDialog } from "@/components/area-map-dialog"
import { AreaTopRoutesDialog } from "@/components/area-top-routes-dialog"
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { Coordinate } from "@/types/area"
import type { Rock } from "@/types/rock"
import type { AreaTopRoute } from "@/types/public-derived"

type DialogName = "concept" | "map" | "top-routes" | null

const copy = {
  de: {
    more: "Weitere Informationen",
    concept: "Kletterkonzeption",
    map: "Übersichtskarte",
    topRoutes: "Top 100",
    conceptDescription: "Kletterkonzeption für das Klettergebiet.",
  },
  en: {
    more: "More information",
    concept: "Climbing concept",
    map: "Area map",
    topRoutes: "Top 100",
    conceptDescription: "Climbing concept for this climbing area.",
  },
} as const

export function AreaHeroMoreMenu({
  areaName,
  areaSlug,
  locale,
  kletterkonzeption,
  topRoutes,
  areaLat,
  areaLng,
  rocks,
}: {
  areaName: string
  areaSlug: string
  locale: "de" | "en"
  kletterkonzeption?: string | null
  topRoutes: AreaTopRoute[]
  areaLat?: Coordinate | null
  areaLng?: Coordinate | null
  rocks: Rock[]
}) {
  const [dialog, setDialog] = useState<DialogName>(null)
  const menuRef = useRef<HTMLDetailsElement>(null)
  const labels = copy[locale]

  function openDialog(name: Exclude<DialogName, null>) {
    menuRef.current?.removeAttribute("open")
    setDialog(name)
  }

  const menuItemClass = "flex w-full cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"

  return (
    <>
      <details ref={menuRef} className="group relative">
        <summary className="inline-flex list-none cursor-pointer items-center rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground shadow-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden" aria-label={labels.more}>
          <Info className="size-4 shrink-0 text-black" aria-hidden="true" />
        </summary>
        <div className="absolute end-0 z-[1080] mt-1 min-w-[12rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none" role="menu" aria-orientation="vertical">
          <ul className="m-0 list-none p-0">
            {kletterkonzeption && <li role="none"><button type="button" className={menuItemClass} role="menuitem" onClick={() => openDialog("concept")}><Info className="size-4 shrink-0" aria-hidden="true" />{labels.concept}</button></li>}
            {topRoutes.length > 0 && <li role="none"><button type="button" className={menuItemClass} role="menuitem" onClick={() => openDialog("top-routes")}><Database className="size-4 shrink-0" aria-hidden="true" />{labels.topRoutes}</button></li>}
            <li role="none"><button type="button" className={menuItemClass} role="menuitem" onClick={() => openDialog("map")}><Map className="size-4 shrink-0" aria-hidden="true" />{labels.map}</button></li>
          </ul>
        </div>
      </details>

      {kletterkonzeption && <Dialog open={dialog === "concept"} onOpenChange={(open) => setDialog(open ? "concept" : null)}>
        <DialogContent aria-describedby="climbing-concept-description" className="max-w-4xl p-0">
          <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3 pr-12 text-left">
            <DialogTitle className="min-w-0 flex-1 text-base font-semibold leading-tight sm:text-lg">{labels.concept} — {areaName}</DialogTitle>
            <DialogDescription id="climbing-concept-description" className="sr-only">{labels.conceptDescription}</DialogDescription>
            <DialogCloseButton />
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <div className="text-sm leading-relaxed [&_a]:text-sky-800 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_ol]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-2 [&_ul]:my-2" dangerouslySetInnerHTML={{ __html: kletterkonzeption }} />
          </div>
        </DialogContent>
      </Dialog>}

      <AreaTopRoutesDialog areaName={areaName} locale={locale} routes={topRoutes} open={dialog === "top-routes"} onOpenChange={(open) => setDialog(open ? "top-routes" : null)} />
      <AreaMapDialog open={dialog === "map"} onOpenChange={(open) => setDialog(open ? "map" : null)} areaName={areaName} areaSlug={areaSlug} areaLat={areaLat} areaLng={areaLng} rocks={rocks} locale={locale} />
    </>
  )
}
