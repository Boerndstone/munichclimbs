"use client"

import { useMemo, useState } from "react"
import { Baby, Bike, Sun, TrainFront, Umbrella } from "lucide-react"

import type { RouteSummary } from "@/lib/api"
import type { Rock } from "@/types/rock"
import { RockListCard } from "@/components/rock-list-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
        <TrainFront className="size-4 shrink-0" />
        <span className="text-xs leading-none text-muted-foreground">+</span>
        <Bike className="size-4 shrink-0" />
      </span>
    )
  }

  const Icon = {
    childFriendly: Baby,
    sunny: Sun,
    rain: Umbrella,
    train: TrainFront,
  }[filter]

  return Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null
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

  return (
    <div className="min-w-0">
      <Card className="mb-2 gap-0 py-0 lg:sticky lg:top-[55px] lg:z-[50]">
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="text-base font-medium">
            {visibleRows.length} {visibleRows.length === 1 ? "Fels" : "Felsen"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ToggleGroup
            value={activeFilters}
            onValueChange={(value) => setActiveFilters(value as Filter[])}
            aria-label="Felsen filtern"
          >
            {filters.map(({ id, label }) => (
              <ToggleGroupItem key={id} value={id} aria-label={label} title={label}>
                <FilterIcon filter={id} />
                <span className="sr-only">{label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>
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
  )
}
