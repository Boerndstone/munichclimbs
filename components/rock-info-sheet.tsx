"use client"

import Link from "next/link"
import {
  Info,
  AlertTriangle,
  Bike,
  FileText,
  HandHeart,
  Images,
  Leaf,
  MapPinned,
  Mountain,
  Route,
  ShieldAlert,
  Star,
  Train,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RouteGradeHistogram } from "@/components/route-grade-histogram"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { RouteSummary } from "@/lib/api"
import type { Rock } from "@/types/rock"

type Props = {
  rock: Rock
  areaName: string
  railwayStation?: unknown
  routeCount: number
  routes: RouteSummary[]
}

type RailwayAccess = { stationName: string; minutes: number; mode: "walk" | "bike" }

function textFrom(rock: Rock, keys: string[]) {
  for (const key of keys) {
    const value = rock[key]
    if (typeof value === "string" && value.trim()) {
      return value
        .replace(/<\/p>\s*<p>/gi, "\n\n")
        .replace(/<br\s*\/?\s*>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim()
    }
  }
  return null
}

function coordinate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

function stations(value: unknown): Array<Record<string, unknown>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return []
  const record = value as Record<string, unknown>
  if ("lat" in record || "lng" in record) return [record]
  if (Array.isArray(record.trainStations)) return record.trainStations.filter((station): station is Record<string, unknown> => Boolean(station) && typeof station === "object" && !Array.isArray(station))
  return Object.values(record).filter((station): station is Record<string, unknown> => Boolean(station) && typeof station === "object" && !Array.isArray(station))
}

function railwayAccesses(rock: Rock, railwayStation: unknown): RailwayAccess[] {
  if (!rock.train && !rock.bike) return []
  const latitude = coordinate(rock.lat)
  const longitude = coordinate(rock.lng)
  if (latitude === null || longitude === null) return []

  let nearest: Record<string, unknown> | null = null
  let nearestDistance: number | null = null
  for (const station of stations(railwayStation)) {
    const stationLat = coordinate(station.lat)
    const stationLng = coordinate(station.lng)
    if (stationLat === null || stationLng === null) continue
    const latDelta = ((latitude - stationLat) * Math.PI) / 180
    const lngDelta = ((longitude - stationLng) * Math.PI) / 180
    const a = Math.sin(latDelta / 2) ** 2 + Math.cos((stationLat * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180) * Math.sin(lngDelta / 2) ** 2
    const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    if (nearestDistance === null || distance < nearestDistance) {
      nearest = station
      nearestDistance = distance
    }
  }
  if (!nearest || nearestDistance === null) return []

  const stationName = typeof nearest.name === "string" && nearest.name.trim() ? nearest.name.trim() : "Bahnhof"
  const estimate = (speedKmh: number) => Math.max(5, Math.ceil(((nearestDistance * 1.3) / speedKmh) * 60 / 5) * 5)
  return [
    ...(rock.train ? [{ stationName, minutes: estimate(4.5), mode: "walk" as const }] : []),
    ...(rock.bike ? [{ stationName, minutes: estimate(13), mode: "bike" as const }] : []),
  ]
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Info; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-black">
      <Icon className="size-4 " aria-hidden="true" />
      {children}
    </span>
  )
}

function BooleanValue({ value, label }: { value: boolean | null | undefined; label: string }) {
  if (value === null || value === undefined) return "–"
  return value ? label : "Nein"
}

export function RockInfoSheet({ rock, areaName, railwayStation, routeCount, routes }: Props) {
  const description = textFrom(rock, ["description", "rockDescription"])
  const access = textFrom(rock, ["access", "rockAccess"])
  const nature = textFrom(rock, ["nature", "rockNature"])
  const flowers = textFrom(rock, ["flowers", "rockFlowers"])
  const latitude = coordinate(rock.lat)
  const longitude = coordinate(rock.lng)
  const hasMap = latitude !== null && longitude !== null
  const mapBounds = hasMap
    ? `${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}`
    : null
  const mapUrl = hasMap ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}` : null
  const googleMapUrl = hasMap ? `https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}` : null
  const accessEstimates = railwayAccesses(rock, railwayStation)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" className="shrink-0 bg-white/90 text-black hover:bg-white">
          <Info className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Fels</span>
          <span className="sr-only sm:hidden">Fels-Infos öffnen</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto border-l border-black bg-white p-0 text-black sm:max-w-[24rem]">
        <SheetHeader className="shrink-0 border-b border-black px-3 py-2 pr-12 text-black">
          <SheetTitle className="text-black">{rock.name}</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1">
          <Accordion type="multiple" defaultValue={["general"]}>
            <AccordionItem value="general">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Info}>Allgemein</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black text-black">
                <div className="border-b border-black px-3 py-3">
                  <RouteGradeHistogram routes={routes} />
                </div>
                <table className="w-full border-collapse text-sm font-medium text-[var(--theme-text)] [&>tbody>tr:last-child]:border-b-0">
                  <tbody>
                    {typeof rock.height === "number" && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Höhe:</td><td className="px-3 py-2">{rock.height} m</td></tr>}
                    {rock.orientation && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Ausrichtung:</td><td className="px-3 py-2">{rock.orientation}</td></tr>}
                    <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Sonnig:</td><td className="px-3 py-2"><BooleanValue value={rock.sunny} label="Sonnig" /></td></tr>
                    <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Kinderfreundlich:</td><td className="px-3 py-2"><BooleanValue value={rock.childFriendly} label="Ja" /></td></tr>
                    <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Regenschutz:</td><td className="px-3 py-2"><BooleanValue value={rock.rain} label="Ja" /></td></tr>
                    {hasMap && <>
                      <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">GPS:</td><td className="px-3 py-2">{latitude}, {longitude}</td></tr>
                      <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2 align-top">Auf Karte zeigen:</td><td className="px-3 py-2"><Link href={googleMapUrl!} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black/70">↗ Google Maps</Link><br /><Link href={mapUrl!} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black/70">↗ OpenStreetMap</Link></td></tr>
                    </>}
                    {rock.season && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Saison:</td><td className="px-3 py-2">{rock.season}</td></tr>}
                    {rock.zone !== null && rock.zone !== undefined && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Zone:</td><td className="px-3 py-2">{rock.zone}</td></tr>}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>

            {description && <AccordionItem value="description">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={FileText}>Beschreibung</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{description}</p></AccordionContent>
            </AccordionItem>}

            {(access || accessEstimates.length > 0) && <AccordionItem value="access">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Route}>Anfahrt &amp; Zustieg</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black">
                {accessEstimates.length > 0 && <div className="mb-3 space-y-2">
                  {accessEstimates.map((estimate) => (
                    <div key={estimate.mode} className="border border-black bg-transparent p-2.5">
                      <div className="font-semibold leading-snug">{estimate.mode === "bike" ? "Mit der Bahn und Fahrrad" : "Vom Bahnhof zu Fuß"}</div>
                      <div className="text-xs leading-snug opacity-80">ca. {estimate.minutes} Min. ab {estimate.stationName}</div>
                    </div>
                  ))}
                </div>}
                {access && <p className="whitespace-pre-line leading-relaxed">{access}</p>}
              </AccordionContent>
            </AccordionItem>}

            <AccordionItem value="map">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={MapPinned}>Karte</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black text-black">
                {hasMap && mapBounds && mapUrl && googleMapUrl ? <>
                  <iframe
                    title={`Karte zu ${rock.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                    className="h-64 w-full border-0"
                    loading="lazy"
                  />
                  <div className="flex flex-wrap gap-2 px-3 py-3">
                    <Button asChild variant="outline" size="sm"><Link href={mapUrl} target="_blank" rel="noreferrer">OpenStreetMap</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={googleMapUrl} target="_blank" rel="noreferrer">Google Maps</Link></Button>
                  </div>
                </> : <p className="px-5 py-3">Für diesen Fels sind noch keine Koordinaten hinterlegt.</p>}
              </AccordionContent>
            </AccordionItem>

            {nature && <AccordionItem value="nature">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={ShieldAlert}>Kletterregelung &amp; Naturschutz</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{nature}</p></AccordionContent>
            </AccordionItem>}

            {flowers && <AccordionItem value="flowers">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Leaf}>Pflanzen</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{flowers}</p></AccordionContent>
            </AccordionItem>}

            <AccordionItem value="images">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Images}>Bilder</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p>Bilder zu diesem Fels erscheinen hier, sobald sie über die Bild-API verfügbar sind.</p></AccordionContent>
            </AccordionItem>

            <AccordionItem value="symbols">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Mountain}>Zeichenerklärung</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black text-black">
                <table className="w-full border-collapse text-sm [&>tbody>tr:last-child]:border-b-0"><tbody>
                  <tr className="border-b border-black"><td className="px-3 py-2"><Star className="size-4" /></td><td className="px-3 py-2">Empfehlenswerte Route</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><span className="flex"><Star className="size-4" /><Star className="size-4" /></span></td><td className="px-3 py-2">Sehr empfehlenswerte Route</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><span className="flex"><Star className="size-4" /><Star className="size-4" /><Star className="size-4" /></span></td><td className="px-3 py-2">Traumroute</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><AlertTriangle className="size-4" /></td><td className="px-3 py-2">Besondere Vorsicht bei der Absicherung</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><ShieldAlert className="size-4" /></td><td className="px-3 py-2">Sperrung oder wichtige Regelung beachten</td></tr>
                </tbody></table>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={HandHeart}>Mithelfen</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-3 pb-4 pt-2 text-black">
                <p className="leading-relaxed">Kennst du neue Routen, Änderungen oder wichtige Hinweise zu diesem Fels? Schreib uns, damit die Informationen aktuell bleiben.</p>
                <Button asChild variant="outline" size="sm" className="mt-3"><a href="mailto:admin@munichclimbs.de">Information senden</a></Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
