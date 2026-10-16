"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, ZoomControl } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

import { GradeHistogram } from "@/components/area-card"
import { homeCopy, localizedPath, type HomeLocale } from "@/lib/home-copy"
import type { HomeArea, HomeRock } from "@/types/home"

export type TravelRange = "all" | "0-60" | "60-90" | "120-9999"

const rockIcon = L.divIcon({ className: "areas-map-marker", html: "<span></span>", iconSize: [18, 18], iconAnchor: [9, 9] })
function areaIcon(count: number) { return L.divIcon({ className: "areas-map-cluster", html: `<span>${count}</span>`, iconSize: [40, 40], iconAnchor: [20, 20] }) }
function clusterIcon(cluster: L.MarkerCluster) { return L.divIcon({ html: `<span>${cluster.getChildCount()}</span>`, className: "areas-map-cluster", iconSize: L.point(48, 48, true) }) }

function coordinate(value: unknown): number | null { return typeof value === "number" && Number.isFinite(value) ? value : typeof value === "string" && value.trim() && Number.isFinite(Number(value)) ? Number(value) : null }
function matchesRange(minutes: number | null | undefined, range: TravelRange) {
  if (range === "all") return true
  if (minutes == null) return false
  if (range === "0-60") return minutes >= 0 && minutes < 60
  if (range === "60-90") return minutes >= 60 && minutes < 90
  return minutes >= 120
}

function FitPoints({ areas }: { areas: HomeArea[] }) {
  const map = useMap()
  useEffect(() => {
    const points = areas.flatMap((point) => { const lat = coordinate(point.lat); const lng = coordinate(point.lng); return lat === null || lng === null ? [] : [[lat, lng] as L.LatLngExpression] })
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 10 })
    const timer = window.setTimeout(() => map.invalidateSize(), 100)
    return () => window.clearTimeout(timer)
  }, [areas, map])
  return null
}

function ZoomState({ onChange }: { onChange: (zoom: number) => void }) {
  const map = useMapEvents({ zoomend: () => onChange(map.getZoom()) })
  useEffect(() => onChange(map.getZoom()), [map, onChange])
  return null
}

function AreaPopup({ area, locale }: { area: HomeArea; locale: HomeLocale }) {
  const labels = homeCopy(locale)
  return <Link href={localizedPath(`/${area.slug}`, locale)} className="block w-[220px] overflow-hidden text-foreground no-underline"><strong className="block px-2 pb-1 pt-2 text-sm">{area.name}</strong>{area.image && <Image src={`https://www.munichclimbs.de/uploads/areas/${area.image}.webp`} alt="" width={440} height={224} className="h-28 w-full object-cover" />}<div className="p-2"><GradeHistogram area={area} compact locale={locale} /><p className="mt-2 text-xs text-sky-700">{labels.area}</p></div></Link>
}

function RockPopup({ rock, locale }: { rock: HomeRock; locale: HomeLocale }) {
  const labels = homeCopy(locale)
  const chartArea: HomeArea = { areaId: rock.rockId, name: rock.rockName, slug: rock.rockSlug, routes: rock.amountRoutes, rocks: 1, rocksWithCoordinates: 1, amountProjects: rock.amountProjects, grade_chart_3: rock.grade_chart_3, grade_chart_4: rock.grade_chart_4, grade_chart_5: rock.grade_chart_5, grade_chart_6: rock.grade_chart_6, grade_chart_7: rock.grade_chart_7, grade_chart_8: rock.grade_chart_8, grade_chart_9: rock.grade_chart_9, grade_chart_10: rock.grade_chart_10, grade_chart_11: rock.grade_chart_11 }
  return <Link href={localizedPath(`/${rock.areaSlug}/${rock.rockSlug}`, locale)} className="block w-[200px] overflow-hidden text-foreground no-underline"><div className="relative">{rock.previewImage ? <Image src={`https://www.munichclimbs.de/build/images/rock/${rock.previewImage}.webp`} alt="" width={400} height={200} className="h-28 w-full object-cover" /> : <div className="h-16 bg-muted" />}<strong className="absolute inset-x-2 top-2 truncate rounded bg-background/95 px-2 py-1 text-sm shadow-sm">{rock.rockName}</strong></div><div className="p-2"><GradeHistogram area={chartArea} compact locale={locale} /><p className="mt-2 truncate text-xs text-muted-foreground">{rock.areaName}</p></div></Link>
}

export function AreasClusterMap({ areas, rocks, range, locale }: { areas: HomeArea[]; rocks: HomeRock[]; range: TravelRange; locale: HomeLocale }) {
  const [zoom, setZoom] = useState(7)
  const filteredAreas = useMemo(() => areas.filter((area) => matchesRange(area.travelTimeMinutes, range) && coordinate(area.lat) !== null && coordinate(area.lng) !== null), [areas, range])
  const filteredRocks = useMemo(() => rocks.filter((rock) => matchesRange(rock.travelTimeMinutes, range) && coordinate(rock.lat) !== null && coordinate(rock.lng) !== null), [rocks, range])
  const areaMarkers = filteredAreas.map((area) => <Marker key={area.areaId} position={[coordinate(area.lat)!, coordinate(area.lng)!]} icon={areaIcon(area.rocksWithCoordinates)}><Popup><AreaPopup area={area} locale={locale} /></Popup></Marker>)
  const rockMarkers = filteredRocks.map((rock) => <Marker key={rock.rockId} position={[coordinate(rock.lat)!, coordinate(rock.lng)!]} icon={rockIcon}><Popup><RockPopup rock={rock} locale={locale} /></Popup></Marker>)
  return <MapContainer className="areas-map" style={{ width: "100%", height: "calc(100dvh - 9.5rem)" }} center={[48.4, 11.2]} zoom={7} zoomControl={false} scrollWheelZoom><ZoomState onChange={setZoom} /><FitPoints areas={filteredAreas} /><ZoomControl position="topleft" /><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{zoom < 10 ? <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={72} showCoverageOnHover={false}>{areaMarkers}</MarkerClusterGroup> : zoom < 12 ? <>{areaMarkers}</> : <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={58} showCoverageOnHover={false}>{rockMarkers}</MarkerClusterGroup>}</MapContainer>
}
