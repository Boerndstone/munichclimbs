"use client"

import Link from "next/link"
import {
  AlertTriangle,
  Bike,
  CircleHelp,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Rock } from "@/types/rock"

type Props = {
  rock: Rock
  areaName: string
  routeCount: number
}

function textFrom(rock: Rock, keys: string[]) {
  for (const key of keys) {
    const value = rock[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return null
}

function coordinate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

function SectionTitle({ icon: Icon, children }: { icon: typeof CircleHelp; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      {children}
    </span>
  )
}

function BooleanValue({ value, label }: { value: boolean | null | undefined; label: string }) {
  return <span>{label}: {value ? "Ja" : "Nein"}</span>
}

export function RockInfoSheet({ rock, areaName, routeCount }: Props) {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" className="shrink-0 bg-white/90 text-black hover:bg-white">
          <CircleHelp className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Fels-Infos</span>
          <span className="sr-only sm:hidden">Fels-Infos öffnen</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>{rock.name}</SheetTitle>
          <SheetDescription>Informationen zum Fels im Klettergebiet {areaName}.</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          <Accordion type="multiple" defaultValue={["general"]}>
            <AccordionItem value="general">
              <AccordionTrigger><SectionTitle icon={CircleHelp}>Allgemein</SectionTitle></AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground">
                  <span>Routen</span><strong className="text-foreground">{routeCount}</strong>
                  {typeof rock.height === "number" && <><span>Höhe</span><strong className="text-foreground">{rock.height} m</strong></>}
                  {rock.orientation && <><span>Ausrichtung</span><strong className="text-foreground">{rock.orientation}</strong></>}
                  {rock.season && <><span>Saison</span><strong className="text-foreground">{rock.season}</strong></>}
                  {rock.zone !== null && rock.zone !== undefined && <><span>Zone</span><strong className="text-foreground">{rock.zone}</strong></>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rock.sunny !== null && rock.sunny !== undefined && <Badge variant="outline"><BooleanValue value={rock.sunny} label="Sonnig" /></Badge>}
                  {rock.childFriendly !== null && rock.childFriendly !== undefined && <Badge variant="outline"><BooleanValue value={rock.childFriendly} label="Kinderfreundlich" /></Badge>}
                  {rock.rain !== null && rock.rain !== undefined && <Badge variant="outline"><BooleanValue value={rock.rain} label="Regenschutz" /></Badge>}
                  {rock.train && <Badge variant="outline"><Train className="mr-1 size-3" />Bahn</Badge>}
                  {rock.bike && <Badge variant="outline"><Bike className="mr-1 size-3" />Rad</Badge>}
                </div>
              </AccordionContent>
            </AccordionItem>

            {description && <AccordionItem value="description">
              <AccordionTrigger><SectionTitle icon={FileText}>Beschreibung</SectionTitle></AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-6 text-muted-foreground">{description}</p></AccordionContent>
            </AccordionItem>}

            {access && <AccordionItem value="access">
              <AccordionTrigger><SectionTitle icon={Route}>Anfahrt &amp; Zustieg</SectionTitle></AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-6 text-muted-foreground">{access}</p></AccordionContent>
            </AccordionItem>}

            <AccordionItem value="map">
              <AccordionTrigger><SectionTitle icon={MapPinned}>Karte</SectionTitle></AccordionTrigger>
              <AccordionContent>
                {hasMap && mapBounds && mapUrl && googleMapUrl ? <>
                  <iframe
                    title={`Karte zu ${rock.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                    className="h-56 w-full rounded-md border"
                    loading="lazy"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm"><Link href={mapUrl} target="_blank" rel="noreferrer">OpenStreetMap</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={googleMapUrl} target="_blank" rel="noreferrer">Google Maps</Link></Button>
                  </div>
                </> : <p className="text-muted-foreground">Für diesen Fels sind noch keine Koordinaten hinterlegt.</p>}
              </AccordionContent>
            </AccordionItem>

            {nature && <AccordionItem value="nature">
              <AccordionTrigger><SectionTitle icon={ShieldAlert}>Kletterregelung &amp; Naturschutz</SectionTitle></AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-6 text-muted-foreground">{nature}</p></AccordionContent>
            </AccordionItem>}

            {flowers && <AccordionItem value="flowers">
              <AccordionTrigger><SectionTitle icon={Leaf}>Pflanzen</SectionTitle></AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-6 text-muted-foreground">{flowers}</p></AccordionContent>
            </AccordionItem>}

            <AccordionItem value="images">
              <AccordionTrigger><SectionTitle icon={Images}>Bilder</SectionTitle></AccordionTrigger>
              <AccordionContent><p className="text-muted-foreground">Bilder zu diesem Fels erscheinen hier, sobald sie über die Bild-API verfügbar sind.</p></AccordionContent>
            </AccordionItem>

            <AccordionItem value="symbols">
              <AccordionTrigger><SectionTitle icon={Mountain}>Zeichenerklärung</SectionTitle></AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2"><Star className="size-4" /> Empfehlenswerte Route</li>
                  <li className="flex items-center gap-2"><AlertTriangle className="size-4" /> Besondere Vorsicht bei der Absicherung</li>
                  <li className="flex items-center gap-2"><ShieldAlert className="size-4" /> Sperrung oder wichtige Regelung beachten</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="help">
              <AccordionTrigger><SectionTitle icon={HandHeart}>Mithelfen</SectionTitle></AccordionTrigger>
              <AccordionContent>
                <p className="leading-6 text-muted-foreground">Kennst du neue Routen, Änderungen oder wichtige Hinweise zu diesem Fels? Schreib uns, damit die Informationen aktuell bleiben.</p>
                <Button asChild variant="outline" size="sm" className="mt-3"><a href="mailto:admin@munichclimbs.de">Information senden</a></Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
