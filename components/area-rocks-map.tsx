"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet"
import Link from "next/link"

import { localizedPath, type HomeLocale } from "@/lib/home-copy"
import type { Coordinate } from "@/types/area"
import type { Rock } from "@/types/rock"

function coordinate(value: Coordinate | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

const rockIcon = L.divIcon({
  className: "areas-map-marker",
  html: "<span></span>",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function FitRocks({ rocks, fallback }: { rocks: Rock[]; fallback: L.LatLngExpression }) {
  const map = useMap()

  useEffect(() => {
    const points = rocks.flatMap((rock) => {
      const lat = coordinate(rock.lat)
      const lng = coordinate(rock.lng)
      return lat === null || lng === null ? [] : [[lat, lng] as L.LatLngExpression]
    })

    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 })
    else if (points.length === 1) map.setView(points[0], 14)
    else map.setView(fallback, 10)

    const timer = window.setTimeout(() => map.invalidateSize(), 100)
    return () => window.clearTimeout(timer)
  }, [fallback, map, rocks])

  return null
}

export function AreaRocksMap({
  areaName,
  areaSlug,
  areaLat,
  areaLng,
  rocks,
  locale,
}: {
  areaName: string
  areaSlug: string
  areaLat?: Coordinate | null
  areaLng?: Coordinate | null
  rocks: Rock[]
  locale: HomeLocale
}) {
  const latitude = coordinate(areaLat) ?? 48.4
  const longitude = coordinate(areaLng) ?? 11.2
  const mappedRocks = rocks.filter((rock) => coordinate(rock.lat) !== null && coordinate(rock.lng) !== null)

  return (
    <MapContainer
      className="areas-map"
      style={{ width: "100%", height: "100%" }}
      center={[latitude, longitude]}
      zoom={10}
      zoomControl={false}
      scrollWheelZoom
    >
      <FitRocks rocks={mappedRocks} fallback={[latitude, longitude]} />
      <ZoomControl position="topleft" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappedRocks.map((rock) => {
        const slug = rock.slug ?? String(rock.id)
        return (
          <Marker key={rock.id} position={[coordinate(rock.lat)!, coordinate(rock.lng)!]} icon={rockIcon}>
            <Popup>
              <Link href={localizedPath(`/${areaSlug}/${slug}`, locale)} className="text-sm font-medium text-foreground no-underline hover:underline">
                {rock.name}
              </Link>
            </Popup>
          </Marker>
        )
      })}
      <span className="sr-only">{areaName}</span>
    </MapContainer>
  )
}
