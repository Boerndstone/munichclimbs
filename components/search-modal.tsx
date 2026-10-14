"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { LoaderCircle, Search } from "lucide-react"

import { slugifyAreaName } from "@/lib/slugify"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Result = {
  name: string
  grade?: string | null
  rock?: string
  area?: string
  url: string
}

type SearchData = {
  rocks?: Result[]
  routes?: Result[]
  totalCount?: number
  page?: number
  perPage?: number
}

type Mode = "name" | "firstascent" | "grade" | "attributes"

const modes: [Mode, string][] = [
  ["name", "Route/Fels"],
  ["firstascent", "Erstbegeher"],
  ["grade", "Grad"],
  ["attributes", "Eigenschaften"],
]

const attributeFilters = [
  ["childFriendly", "Kinderfreundlich"],
  ["sunny", "Sonnig"],
  ["rainProtected", "Regenschutz"],
  ["train", "Mit Bahn erreichbar"],
  ["bike", "Bahn + Fahrrad"],
] as const

function pageItems(current: number, total: number) {
  const values = new Set([1, current - 1, current, current + 1, total])
  return [...values]
    .filter((value) => value >= 1 && value <= total)
    .sort((first, second) => first - second)
}

/** The legacy search endpoint returns Symfony's mixed-case URLs. Keep results
 * inside Next's canonical URL space so search does not introduce duplicate URLs. */
function canonicalResultHref(url: string) {
  const parts = url.split("/").filter(Boolean)
  if (parts.length === 0) return "/"

  const area = slugifyAreaName(parts[0])
  if (parts.length === 1) return `/${area}`

  const rock = parts.slice(1).join("/").toLowerCase().replace(/_/g, "-")
  return `/${area}/${rock}`
}

export function SearchModal({
  areas,
}: {
  areas: { id: string | number; name: string; slug?: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("name")
  const [query, setQuery] = useState("")
  const [area, setArea] = useState("")
  const [grades, setGrades] = useState<number[]>([])
  const [attributes, setAttributes] = useState<string[]>([])
  const [data, setData] = useState<SearchData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const search = useCallback(async (nextPage = page) => {
    const params = new URLSearchParams({ mode })

    if (mode === "name" || mode === "firstascent") {
      if (query.trim().length < 2) return
      params.set("query", query)
    }

    if (area) params.set("area", area)
    grades.forEach((grade) => params.append("grades[]", String(grade)))
    attributes.forEach((attribute) => params.set(attribute, "true"))

    if (mode === "grade") {
      params.set("page", String(nextPage))
      params.set("perPage", "20")
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?${params}`)
      if (!response.ok) {
        setData({})
        setError("Die Suche konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.")
        return
      }

      const nextData = (await response.json()) as SearchData
      setData(nextData)
      setPage(nextData.page ?? nextPage)
    } catch {
      setData({})
      setError("Die Suche konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }, [area, attributes, grades, mode, page, query])

  useEffect(() => {
    if (mode !== "name" && mode !== "firstascent") return

    const timeout = setTimeout(() => void search(1), 250)
    return () => clearTimeout(timeout)
  }, [mode, query, search])

  const rocks = data.rocks ?? []
  const routes = data.routes ?? []
  const results = [...rocks, ...routes]
  const totalPages = Math.max(
    1,
    Math.ceil((data.totalCount ?? results.length) / (data.perPage ?? 20))
  )
  const visiblePages = pageItems(page, totalPages)

  function selectMode(nextMode: Mode) {
    setMode(nextMode)
    setQuery("")
    setData({})
    setError(null)
    setPage(1)
  }

  function toggleGrade(grade: number) {
    setGrades((selected) =>
      selected.includes(grade)
        ? selected.filter((value) => value !== grade)
        : [...selected, grade]
    )
  }

  function toggleAttribute(attribute: string) {
    setAttributes((selected) =>
      selected.includes(attribute)
        ? selected.filter((value) => value !== attribute)
        : [...selected, attribute]
    )
  }

  function renderList(title: string, items: Result[]) {
    if (!items.length) return null

    return (
      <section className="mb-4">
        <h3 className="mb-1 text-xs font-bold uppercase">{title}</h3>
        <ul className="divide-y rounded-md border">
          {items.map((item, index) => (
            <li key={`${title}-${item.url}-${item.name}-${item.grade ?? ""}-${index}`}>
              <Link
                href={canonicalResultHref(item.url)}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm hover:bg-accent"
              >
                <b>
                  {item.name}
                  {item.grade ? ` ${item.grade}` : ""}
                </b>
                {item.rock && (
                  <span className="block text-muted-foreground">
                    {item.rock}
                    {item.area ? ` · ${item.area}` : ""}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex flex-1 justify-start text-muted-foreground hover:cursor-pointer">
          <Search className="size-4" />
          Suche nach Felsen/Routen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <header className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div>
            <DialogTitle>Suche</DialogTitle>
            <DialogDescription className="sr-only">Durchsuchen Sie Felsen und Routen nach Name, Erstbegeher, Grad oder Eigenschaften.</DialogDescription>
          </div>
          <DialogCloseButton />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex flex-wrap gap-1 rounded-md bg-muted p-1">
            {modes.map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="xs"
                variant={mode === value ? "default" : "ghost"}
                aria-pressed={mode === value}
                onClick={() => selectMode(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          {(mode === "name" || mode === "firstascent") && (
            <div>
              <label className="sr-only" htmlFor="search-query">
                {mode === "name" ? "Suche nach Felsen oder Routen" : "Suche nach Erstbegeher"}
              </label>
              <Input
                id="search-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  mode === "name"
                    ? "Suche nach Felsen oder Routen..."
                    : "Suche nach Erstbegeher..."
                }
              />
            </div>
          )}

          {(mode === "grade" || mode === "attributes") && (
            <div className="space-y-3">
              <label className="sr-only" htmlFor="search-area">Gebiet eingrenzen</label>
              <select
                id="search-area"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Alle Gebiete</option>
                {areas.map((currentArea) => (
                  <option key={currentArea.id} value={currentArea.slug}>
                    {currentArea.name}
                  </option>
                ))}
              </select>

              {mode === "grade" ? (
                <>
                  <div className="flex flex-wrap gap-1" role="group" aria-label="Schwierigkeitsgrade auswählen">
                    {Array.from({ length: 11 }, (_, index) => index + 1).map((grade) => (
                      <Button
                        key={grade}
                        type="button"
                        size="xs"
                        variant={grades.includes(grade) ? "default" : "outline"}
                        className="w-7 px-0"
                        aria-pressed={grades.includes(grade)}
                        onClick={() => toggleGrade(grade)}
                      >
                        {grade}
                      </Button>
                    ))}
                  </div>
                  <Button type="button" size="sm" onClick={() => void search(1)}>
                    Nach Grad suchen
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1" role="group" aria-label="Eigenschaften auswählen">
                    {attributeFilters.map(([value, label]) => (
                      <Button
                        key={value}
                        type="button"
                        size="xs"
                        variant={attributes.includes(value) ? "default" : "outline"}
                        aria-pressed={attributes.includes(value)}
                        onClick={() => toggleAttribute(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <Button type="button" size="sm" onClick={() => void search(1)}>
                    Nach Eigenschaften suchen
                  </Button>
                </>
              )}
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            {loading ? "Suche läuft" : error ?? `${results.length} Ergebnisse`}
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          ) : loading ? (
            <LoaderCircle className="m-6 size-5 animate-spin" />
          ) : results.length > 0 ? (
            <div className="mt-4">
              {mode === "name" ? (
                <>
                  {renderList("Felsen", rocks)}
                  {renderList("Routen", routes)}
                </>
              ) : (
                renderList("Ergebnisse", results)
              )}

              {mode === "grade" && totalPages > 1 && (
                <Pagination className="mt-3">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        type="button"
                        disabled={page <= 1}
                        onClick={() => void search(page - 1)}
                      />
                    </PaginationItem>

                    {visiblePages.map((value, index) => (
                      <Fragment key={value}>
                        {index > 0 && value - visiblePages[index - 1] > 1 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            type="button"
                            isActive={value === page}
                            onClick={() => void search(value)}
                          >
                            {value}
                          </PaginationLink>
                        </PaginationItem>
                      </Fragment>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => void search(page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          ) : (mode === "attributes" || mode === "grade") ? (
            <p className="mt-4 text-sm text-muted-foreground">Wählen Sie mindestens einen Filter und starten Sie die Suche.</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
