"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { MapPinned } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { homeCopy, localizedPath, type HomeLocale } from "@/lib/home-copy"
import type { HomeArea, HomeRock } from "@/types/home"
import type { TravelRange } from "@/components/areas-cluster-map"

const AreasClusterMap = dynamic(() => import("@/components/areas-cluster-map").then((module) => module.AreasClusterMap), { ssr: false })

export function AreasMapDialog({ areas, rocks, locale = "de" }: { areas: HomeArea[]; rocks: HomeRock[]; locale?: HomeLocale }) {
  const labels = homeCopy(locale)
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<TravelRange>("all")
  const filters: Array<[TravelRange, string]> = [["all", labels.all], ["0-60", labels.underHour], ["60-90", labels.oneToOneHalf], ["120-9999", labels.overTwoHours]]
  if (!rocks.length && !areas.length) return null
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline" size="icon" className="size-8" aria-label={labels.mapOpen}><MapPinned className="size-4" aria-hidden="true" /></Button></DialogTrigger><DialogContent className="inset-0 h-dvh w-screen max-h-none max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0"><div className="flex items-start justify-between gap-4 border-b px-4 py-3 pr-12 text-left"><div><DialogTitle>{labels.mapTitle}</DialogTitle><DialogDescription>{labels.mapDescription}</DialogDescription></div><DialogCloseButton /></div><div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b px-3 py-2" role="group" aria-label={labels.distance}><span className="mr-1 shrink-0 text-xs text-muted-foreground">{labels.distance}</span>{filters.map(([value, label]) => <Button key={value} type="button" variant={range === value ? "secondary" : "ghost"} size="sm" aria-pressed={range === value} onClick={() => setRange(value)}>{label}</Button>)}</div>{open && <div className="min-h-0 flex-1" role="region" aria-label={labels.mapTitle}><AreasClusterMap areas={areas} rocks={rocks} range={range} locale={locale} /></div>}<nav className="sr-only" aria-label={labels.mapList}><ul>{rocks.map((rock) => <li key={rock.rockId}><a href={localizedPath(`/${rock.areaSlug}/${rock.rockSlug}`, locale)}>{rock.rockName} in {rock.areaName}</a></li>)}</ul></nav></DialogContent></Dialog>
}
