"use client"

import Link from "next/link"
import { useEffect, useMemo } from "react"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

export type MapPoint = {
  id: string | number
  name: string
  areaName: string
  areaHref: string
  href: string
  latitude: number
  longitude: number
  areaImage?: string
  areaRouteCount: number
  areaRockCount: number
  areaGradeCounts: number[]
  rockPreviewImage?: string
  rockRouteCount: number
  rockGradeCounts: number[]
}

const markerIcon = L.divIcon({
  className: "areas-map-marker",
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function clusterIcon(cluster: L.MarkerCluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "areas-map-cluster",
    iconSize: L.point(48, 48, true),
  })
}

const histogramColors = ["#059669", "#16a34a", "#65a30d", "#d97706", "#ea580c", "#c2410c", "#dc2626", "#e11d48", "#4338ca", "#334155"]

function Histogram({ counts }: { counts: number[] }) {
  const highestCount = Math.max(...counts, 1)
  const bars = counts
    .map((count, index) => ({ count, index, label: index === 9 ? "Proj." : String(index + 3) }))
    .filter((bar) => bar.count > 0)

  return <><div className="flex justify-between text-[9px] text-slate-500"><span>↑ Anzahl</span><span>→ Grad (UIAA)</span></div><div className="mt-1 grid h-20 grid-cols-[1.25rem_minmax(0,1fr)]"><div className="flex flex-col justify-between border-r border-slate-300 pr-1 text-right text-[8px] text-slate-500"><span>{highestCount}</span><span>{Math.round(highestCount / 2)}</span><span>0</span></div><div className="flex min-w-0 flex-col pl-1"><div className="flex min-h-0 flex-1 items-end gap-0.5">{bars.map(({ count, index, label }) => <div key={label} className="relative flex h-full min-w-0 flex-1 items-end"><span className="absolute inset-x-0 text-center text-[8px] leading-none" style={{ bottom: `calc(${(count / highestCount) * 100}% + 1px)` }}>{count}</span><span className="w-full rounded-t-sm" style={{ height: `${Math.max(5, (count / highestCount) * 100)}%`, backgroundColor: histogramColors[index] }} /></div>)}</div><div className="flex gap-0.5 pt-1 text-center text-[8px] leading-none">{bars.map(({ label }) => <span key={label} className="min-w-0 flex-1 truncate">{label}</span>)}</div></div></div></>
}

function RockPopup({ point }: { point: MapPoint }) {
  return <Link href={point.href} className="text-black"><div className="areas-map-popup p-0"><strong className="block text-sm">{point.name}</strong>{point.rockPreviewImage && <img src={`https://www.munichclimbs.de/build/images/rock/${point.rockPreviewImage}.webp`} alt="" className="mt-1 h-28 w-full object-cover" />}<div className="px-2 pb-2 pt-2"><p className="mb-2 text-[11px] font-semibold">{point.rockRouteCount} {point.rockRouteCount === 1 ? "Route" : "Routen"}</p><Histogram counts={point.rockGradeCounts} /></div></div></Link>
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character] ?? character) }
function areaPopupHtml(point: MapPoint) {
  const image = point.areaImage ? `<img src="https://www.munichclimbs.de/uploads/areas/${encodeURIComponent(point.areaImage)}.webp" alt="" style="width:100%;height:112px;object-fit:cover;margin-top:4px">` : ""
  return `<div class="areas-map-popup"><strong style="display:block;padding:8px 8px 0;font-size:14px">${escapeHtml(point.areaName)}</strong>${image}<div style="padding:8px"><p style="margin:0 0 8px;font-size:11px;font-weight:600">${point.areaRouteCount} Touren · ${point.areaRockCount} ${point.areaRockCount === 1 ? "Fels" : "Felsen"}</p><a href="${point.areaHref}" style="font-size:12px;color:#0369a1">Zum Gebiet</a></div></div>`
}

function FitClusteredPoints({ points }: { points: MapPoint[] }) {
  const map = useMap()

  useEffect(() => {
    const resizeAndFit = () => {
      map.invalidateSize()
      const bounds = L.latLngBounds(points.map((point) => [point.latitude, point.longitude] as L.LatLngExpression))
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 })
    }
    const timer = window.setTimeout(resizeAndFit, 150)
    return () => window.clearTimeout(timer)
  }, [map, points])

  return null
}

function ClusteredMarkers({ points }: { points: MapPoint[] }) {
  const map = useMap()
  const pointsById = useMemo(() => new Map(points.map((point) => [String(point.id), point])), [points])
  const onClusterClick = (event: L.LeafletMouseEvent) => {
      const cluster = (event as unknown as { layer: L.MarkerCluster }).layer
      const childPoints = cluster.getAllChildMarkers().flatMap((marker: L.Marker) => {
        const point = pointsById.get(String(marker.options.title))
        return point ? [point] : []
      })
      const areaHrefs = new Set(childPoints.map((point) => point.areaHref))
      if (areaHrefs.size !== 1 || !childPoints[0]) {
        map.fitBounds(cluster.getBounds(), { padding: [48, 48] })
        return
      }
      L.popup({ maxWidth: 220, minWidth: 200 }).setLatLng(cluster.getLatLng()).setContent(areaPopupHtml(childPoints[0])).openOn(map)
  }
  return <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={58} showCoverageOnHover={false} zoomToBoundsOnClick={false} onClick={onClusterClick}>{points.map((point) => <Marker key={point.id} title={String(point.id)} position={[point.latitude, point.longitude]} icon={markerIcon}><Popup><RockPopup point={point} /></Popup></Marker>)}</MarkerClusterGroup>
}

export function AreasClusterMap({ points }: { points: MapPoint[] }) {
  return (
    <MapContainer
      className="areas-map"
      style={{ width: "100%", height: "calc(100dvh - 6.25rem)" }}
      center={[48.4, 11.2]}
      zoom={6}
      zoomControl={false}
      scrollWheelZoom
    >
      <FitClusteredPoints points={points} />
      <ZoomControl position="topleft" />
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClusteredMarkers points={points} />
    </MapContainer>
  )
}
