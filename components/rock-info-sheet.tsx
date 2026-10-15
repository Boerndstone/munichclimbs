"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Info,
  AlertTriangle,
  ArrowUp10,
  BookText,
  Camera,
  ExternalLink,
  Flower,
  HandFist,
  HardHat,
  MapPin,
  NotepadText,
  PencilLine,
  Signpost,
  Skull,
  Star,
  Trash2,
  TriangleAlert,
  TvMinimalPlay,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RouteGradeHistogram } from "@/components/route-grade-histogram"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { RouteSummary } from "@/lib/api"
import type { PublicPhoto, PublicVideo } from "@/types/public-content"
import type { Rock } from "@/types/rock"
import { galleryImageUrl } from "@/lib/media"

type Props = {
  rock: Rock
  railwayStation?: unknown
  routes: RouteSummary[]
  photos: PublicPhoto[]
  videos: PublicVideo[]
}

type RailwayAccess = { stationName: string; minutes: number; mode: "walk" | "bike" }

function textFrom(...values: Array<string | null | undefined>) {
  for (const value of values) {
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

export function RockInfoSheet({ rock, railwayStation, routes, photos, videos }: Props) {
  const description = textFrom(rock.description, rock.rockDescription)
  const access = textFrom(rock.access, rock.rockAccess)
  const nature = textFrom(rock.nature, rock.rockNature)
  const flowers = textFrom(rock.flowers, rock.rockFlowers)
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
          <SheetDescription className="sr-only">Informationen, Anfahrt, Karte, Bilder und Hinweise für den Fels {rock.name}.</SheetDescription>
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
                      <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2 align-top">Auf Karte zeigen:</td><td className="px-3 py-2"><Link href={googleMapUrl!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-black/70"><ExternalLink className="size-4" aria-hidden="true" />Google Maps</Link><br /><Link href={mapUrl!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-black/70"><ExternalLink className="size-4" aria-hidden="true" />OpenStreetMap</Link></td></tr>
                    </>}
                    {rock.season && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Saison:</td><td className="px-3 py-2">{rock.season}</td></tr>}
                    {rock.zone !== null && rock.zone !== undefined && <tr className="border-b border-[var(--theme-border)] odd:bg-[var(--theme-bg-lighter)]/50"><td className="px-3 py-2">Zone:</td><td className="px-3 py-2">{rock.zone}</td></tr>}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>

            {description && <AccordionItem value="description">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={BookText}>Beschreibung</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{description}</p></AccordionContent>
            </AccordionItem>}

            {(access || accessEstimates.length > 0) && <AccordionItem value="access">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Signpost}>Anfahrt &amp; Zustieg</SectionTitle></AccordionTrigger>
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
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={MapPin}>Karte</SectionTitle></AccordionTrigger>
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
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={TriangleAlert}>Kletterregelung &amp; Naturschutz</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{nature}</p></AccordionContent>
            </AccordionItem>}

            {flowers && <AccordionItem value="flowers">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Flower}>Pflanzen</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><p className="whitespace-pre-line leading-relaxed">{flowers}</p></AccordionContent>
            </AccordionItem>}

            <AccordionItem value="images">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={Camera}>Bilder</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black">
                {photos.length > 0 ? <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo) => (
                    <a key={photo.id} href={galleryImageUrl(photo.name)} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-md border border-border">
                      <Image
                        src={galleryImageUrl(photo.name)}
                        alt={photo.description?.trim() || `Foto vom Fels ${rock.name}`}
                        width={480}
                        height={480}
                        sizes="(max-width: 640px) 50vw, 12rem"
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      />
                      {(photo.description || photo.photgrapher) && <span className="block p-2 text-xs text-muted-foreground">{photo.description}{photo.description && photo.photgrapher ? " · " : ""}{photo.photgrapher}</span>}
                    </a>
                  ))}
                </div> : <p>Für diesen Fels sind noch keine veröffentlichten Bilder vorhanden.</p>}
              </AccordionContent>
            </AccordionItem>

            {videos.length > 0 && <AccordionItem value="videos">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={TvMinimalPlay}>Videos</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black px-5 pb-3 pt-2 text-black"><ul className="space-y-2">{videos.filter((video) => video.videoLink).map((video) => <li key={video.id}><a className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2" href={video.videoLink!} target="_blank" rel="noopener noreferrer"><TvMinimalPlay className="size-4" aria-hidden="true" />{video.videoRoutes?.name ? `Video: ${video.videoRoutes.name}` : "Video öffnen"}</a></li>)}</ul></AccordionContent>
            </AccordionItem>}

            <AccordionItem value="symbols">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={NotepadText}>Zeichenerklärung</SectionTitle></AccordionTrigger>
              <AccordionContent className="border-t border-black text-black">
                <table className="w-full border-collapse text-sm [&>tbody>tr:last-child]:border-b-0"><tbody>
                  <tr className="border-b border-black"><td className="px-3 py-2"><Star className="size-4" /></td><td className="px-3 py-2">Empfehlenswerte Route</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><span className="flex"><Star className="size-4" /><Star className="size-4" /></span></td><td className="px-3 py-2">Sehr empfehlenswerte Route</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><span className="flex"><Star className="size-4" /><Star className="size-4" /><Star className="size-4" /></span></td><td className="px-3 py-2">Traumroute</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><Trash2 className="size-4" /></td><td className="px-3 py-2">Nicht empfehlenswerte Route</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><AlertTriangle className="size-4 text-red-700" /></td><td className="px-3 py-2">Besondere Vorsicht bei der Absicherung</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><Skull className="size-4" /></td><td className="px-3 py-2">Gefährliche Absicherung</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><HardHat className="size-4" /></td><td className="px-3 py-2">Felsqualität beachten</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><ArrowUp10 className="size-4" /></td><td className="px-3 py-2">Mehrseillängentour</td></tr>
                  <tr className="border-b border-black"><td className="px-3 py-2"><HandFist className="size-4" /></td><td className="px-3 py-2">Rissklettern</td></tr>
                </tbody></table>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help">
              <AccordionTrigger className="rounded-none border-0 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-bg-lighter)] hover:no-underline **:data-[slot=accordion-trigger-icon]:text-[var(--theme-text)]"><SectionTitle icon={PencilLine}>Mithelfen</SectionTitle></AccordionTrigger>
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
