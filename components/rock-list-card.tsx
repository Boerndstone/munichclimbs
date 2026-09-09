import Image from "next/image"
import Link from "next/link"
import type { Rock } from "@/types/rock"
import type { RouteSummary } from "@/lib/api"

type Props = {
  areaName: string
  areaSlug: string
  rock: Rock
  routes: RouteSummary[]
}

const gradeColors: Record<number, string> = {
  3: "#059669",
  4: "#16a34a",
  5: "#65a30d",
  6: "#d97706",
  7: "#ea580c",
  8: "#c2410c",
  9: "#dc2626",
  10: "#e11d48",
  11: "#4338ca",
}

const fontainebleauBuckets: Record<string, number> = {
  "FB 3": 5,
  "FB 4-": 6,
  "FB 4": 6,
  "FB 4+": 6,
  "FB 5": 7,
  "FB 5+": 7,
  "FB 6A": 7,
  "FB 6A+": 7,
  "FB 6B": 7,
  "FB 6B+": 7,
  "FB 6C": 8,
  "FB 6C+": 8,
  "FB 7A": 8,
  "FB 7A+": 9,
  "FB 7B": 9,
  "FB 7B+": 9,
  "FB 7C": 10,
  "FB 7C+": 10,
  "FB 8A": 10,
  "FB 8A+": 11,
  "FB 8B": 11,
  "FB 8B+": 11,
  "FB 8C": 11,
  "FB 8C+": 11,
  "FB 9A": 11,
}

function gradeBucket(route: RouteSummary): number | "project" | null {
  const grade = route.grade?.trim().toUpperCase()
  if (!grade || route.gradeNo === null || route.gradeNo === 0) return "project"

  if (fontainebleauBuckets[grade]) return fontainebleauBuckets[grade]

  const numbers = [...grade.matchAll(/\d+/g)].map((match) => Number(match[0]))
  if (numbers.length === 0) return "project"

  const highestGrade = Math.max(...numbers)
  if (route.scale?.toUpperCase() === "UIAA") {
    return Math.min(11, Math.max(3, highestGrade))
  }

  // French sport grades sit slightly higher than the UIAA numeral alone suggests.
  const suffix = grade.match(/\d+([ABC])/i)?.[1]?.toUpperCase()
  const frenchOffsets: Record<string, number> = { A: 0, B: 1, C: 2 }
  return Math.min(11, Math.max(3, highestGrade + (suffix ? frenchOffsets[suffix] : 0)))
}

function imageUrl(previewImage: unknown): string | null {
  if (typeof previewImage !== "string" || previewImage.length === 0) return null
  return `https://www.munichclimbs.de/build/images/rock/${previewImage}.webp`
}

export function RockListCard({ areaName, areaSlug, rock, routes }: Props) {
  const distribution = new Map<number | "project", number>()
  for (const route of routes) {
    const bucket = gradeBucket(route)
    if (bucket !== null) distribution.set(bucket, (distribution.get(bucket) ?? 0) + 1)
  }

  const segments = [...distribution.entries()]
    .sort(([left], [right]) => {
      if (left === "project") return 1
      if (right === "project") return -1
      return left - right
    })
    .map(([bucket, count]) => ({ bucket, count }))
  const previewImage = imageUrl(rock.previewImage)
  const height = typeof rock.height === "number" ? rock.height : null
  const orientation = typeof rock.orientation === "string" ? rock.orientation : null
  const href = rock.slug ? `/${areaSlug}/${rock.slug}` : `/${areaSlug}/${rock.id}`

  return (
    <li>
      <Link
        href={href}
        className="group flex overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:border-muted-foreground/30 hover:bg-muted/30 hover:shadow-md"
      >
        <div className="relative w-[75px] shrink-0 bg-muted">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={`Klettergebiet ${areaName}, Fels ${rock.name}`}
              fill
              sizes="75px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[92px] items-center justify-center text-muted-foreground" aria-label="Kein Bild verfügbar">
              ▲
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 px-3 py-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h3 className="truncate text-base font-normal leading-tight">{rock.name}</h3>
            {(height !== null || orientation) && (
              <span className="shrink-0 text-sm text-muted-foreground">
                {height !== null && `${height} m`}
                {height !== null && orientation && <span className="mx-1.5 text-border">|</span>}
                {orientation}
              </span>
            )}
          </div>

          {segments.length > 0 && (
            <div className="mt-3 flex min-w-0 gap-2" aria-label={`${routes.length} Routen nach Schwierigkeitsgrad`}>
              <span className="w-6 shrink-0 self-end text-sm leading-none tabular-nums">{routes.length}</span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex text-center text-[11px] leading-none tabular-nums text-muted-foreground">
                  {segments.map(({ bucket, count }) => (
                    <span key={String(bucket)} className="min-w-0 flex-1">{count}</span>
                  ))}
                </div>
                <div className="flex h-4 overflow-hidden rounded" role="img" aria-label={`${rock.name}: ${segments.map(({ bucket, count }) => `${bucket === "project" ? "Projekte" : `Grad ${bucket}`}: ${count}`).join(", ")}`}>
                  {segments.map(({ bucket }) => (
                    <span
                      key={String(bucket)}
                      className="flex min-w-0 flex-1 items-center justify-center border-l border-white/25 px-px text-[10px] font-light leading-none text-white first:border-l-0"
                      style={{ backgroundColor: bucket === "project" ? "#334155" : gradeColors[bucket] }}
                    >
                      {bucket === "project" ? "Proj." : bucket}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </li>
  )
}
