"use client"

import dynamic from "next/dynamic"

import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { Coordinate } from "@/types/area"
import type { HomeLocale } from "@/lib/home-copy"
import type { Rock } from "@/types/rock"

const AreaRocksMap = dynamic(
  () => import("@/components/area-rocks-map").then((module) => module.AreaRocksMap),
  { ssr: false }
)

export function AreaMapDialog({
  open,
  onOpenChange,
  areaName,
  areaSlug,
  areaLat,
  areaLng,
  rocks,
  locale,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  areaName: string
  areaSlug: string
  areaLat?: Coordinate | null
  areaLng?: Coordinate | null
  rocks: Rock[]
  locale: HomeLocale
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="area-map-description" className="inset-0 h-dvh w-screen max-h-none max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0">
        <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3 pr-12 text-left">
          <DialogTitle className="min-w-0 flex-1 text-base font-semibold leading-tight sm:text-lg">
            Übersichtskarte — {areaName}
          </DialogTitle>
          <DialogDescription id="area-map-description" className="sr-only">
            Karte mit allen Felsen im Klettergebiet {areaName}.
          </DialogDescription>
          <DialogCloseButton />
        </header>
        <div className="min-h-0 flex-1">
          <AreaRocksMap areaName={areaName} areaSlug={areaSlug} areaLat={areaLat} areaLng={areaLng} rocks={rocks} locale={locale} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
