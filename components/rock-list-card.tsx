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
        className="rock-item-card mb-2 flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-[box-shadow,border-color,background-color] duration-200 ease-out group-hover:border-gray-300 group-hover:bg-neutral-50 group-hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-black dark:group-hover:border-gray-600 dark:group-hover:bg-neutral-950/80"
      >
        <div className="relative w-[75px] shrink-0 self-stretch bg-gray-200 dark:bg-gray-800">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={`Klettergebiet ${areaName}, Fels ${rock.name}`}
              fill
              sizes="75px"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full min-h-[92px] items-center justify-center text-muted-foreground" aria-label="Kein Bild verfügbar">
              ▲
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2">
          <div className="min-w-0 flex items-center justify-between">
            <h2 className="mb-0 min-w-0 max-w-[150px] truncate text-base font-normal leading-tight lg:max-w-none">{rock.name}</h2>
            <div className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-gray-800 dark:text-gray-200">
              {(height !== null || orientation) && (
                <>
                  <p className="mb-0">{height !== null && `${height} m`}</p>
                  {height !== null && orientation && <span className="h-3.5 w-px shrink-0 bg-gray-400 dark:bg-gray-600" aria-hidden="true" />}
                  {orientation && <p className="mb-0">{orientation}</p>}
                </>
              )}
            </div>
          </div>

          {segments.length > 0 && (
            <div className="mt-1 flex min-w-0 gap-2" aria-label={`${routes.length} Routen nach Schwierigkeitsgrad`}>
              <span className="w-6 shrink-0 self-end text-sm leading-none tabular-nums">{routes.length}</span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex text-center text-[11px] leading-none tabular-nums text-black">
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
