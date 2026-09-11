"use client"

import { useMemo, useState } from "react"

import type { RouteSummary } from "@/lib/api"
import type { Rock } from "@/types/rock"
import { AreaFilterIcon, type AreaFilterIconName } from "@/components/area-filter-icon"
import { RockListCard } from "@/components/rock-list-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type RockRow = {
  rock: Rock
  routes: RouteSummary[]
}

type Filter = "childFriendly" | "sunny" | "rain" | "train" | "trainAndBike"

type FilterDefinition = {
  id: Filter
  label: string
}

const filters: FilterDefinition[] = [
  { id: "childFriendly", label: "Kinderfreundlich" },
  { id: "sunny", label: "Sonnig" },
  { id: "rain", label: "Regenschutz" },
  { id: "train", label: "Mit Bahn erreichbar" },
  { id: "trainAndBike", label: "Bahn + Fahrrad" },
]

function isEnabled(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true"
}

function FilterIcon({ filter }: { filter: Filter }) {
  if (filter === "trainAndBike") {
    return (
      <span className="flex items-center gap-1" aria-hidden="true">
        <AreaFilterIcon name="train" />
        <span className="text-xs leading-none text-muted-foreground">+</span>
        <AreaFilterIcon name="bike" />
      </span>
    )
  }

  return <AreaFilterIcon name={filter as AreaFilterIconName} className="size-5" />
}

export function AreaRockList({
  areaName,
  areaSlug,
  rows,
}: {
  areaName: string
  areaSlug: string
  rows: RockRow[]
}) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  const visibleRows = useMemo(
    () =>
      rows.filter(({ rock }) =>
        activeFilters.every((filter) => {
          if (filter === "trainAndBike") {
            return isEnabled(rock.train) && isEnabled(rock.bike)
          }

          return isEnabled(rock[filter])
        })
      ),
    [activeFilters, rows]
  )

  function toggleFilter(filter: Filter) {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((value) => value !== filter)
        : [...current, filter]
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
      <div className="order-2 min-w-0 md:col-span-8 lg:order-1">
        <ul className="space-y-2">
          {visibleRows.map(({ rock, routes }) => (
            <RockListCard
              key={rock.id}
              areaName={areaName}
              areaSlug={areaSlug}
              rock={rock}
              routes={routes}
            />
          ))}
        </ul>
        {visibleRows.length === 0 && (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Für diese Filterkombination wurden keine Felsen gefunden.
          </p>
        )}
      </div>

      <aside className="order-1 min-w-0 md:col-span-4 lg:order-2">
        <Card className="gap-0 py-0 lg:sticky lg:top-[74px]">
          <CardHeader className="px-3 py-3">
            <CardTitle className="text-base font-medium">
              {visibleRows.length} {visibleRows.length === 1 ? "Fels" : "Felsen"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-nowrap gap-3 overflow-x-auto px-3 pb-3 md:flex-wrap md:overflow-x-visible">
            {filters.map(({ id, label }) => {
              const active = activeFilters.includes(id)

              return (
                <div key={id} className="inline-flex shrink-0 items-center gap-2">
                  <label
                    htmlFor={`area-filter-${id}`}
                    className="flex cursor-pointer items-center"
                    title={label}
                  >
                    <FilterIcon filter={id} />
                    <span className="sr-only">{label}</span>
                  </label>
                  <Switch
                    id={`area-filter-${id}`}
                    checked={active}
                    onCheckedChange={() => toggleFilter(id)}
                    aria-label={label}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
