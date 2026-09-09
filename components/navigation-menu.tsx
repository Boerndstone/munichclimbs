"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChartNoAxesCombined, ChevronRight, Menu, Moon, Search, Settings, Sun, X } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getAreaSlug } from "@/lib/slugify"
import type { Area } from "@/types/area"

type NavigationRock = {
  id?: string | number
  name?: string
  slug?: string
}

function isOnline(area: Area) {
  return Number(area.online) === 1
}

function NavigationArea({ area }: { area: Area }) {
  const pathname = usePathname()
  const areaSlug = getAreaSlug(area)
  const areaPath = `/${areaSlug}`
  const rocks = Array.isArray(area.rocks) ? (area.rocks as NavigationRock[]) : []
  const isCurrentArea = pathname === areaPath || pathname.startsWith(`${areaPath}/`)

  return (
    <li>
      <details className="group" open={isCurrentArea}>
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent [&::-webkit-details-marker]:hidden">
          {area.image ? (
            <img
              src={`https://www.munichclimbs.de/build/images/navigationThumbs/${area.image}.webp`}
              alt=""
              className="size-[18px] shrink-0 rounded object-cover"
            />
          ) : (
            <span className="size-[18px] shrink-0 rounded bg-muted" aria-hidden="true" />
          )}
          <span className="min-w-0 flex-1 truncate">{area.name}</span>
          <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-90" aria-hidden="true" />
        </summary>
        <div className="pb-1 pl-7 pr-2">
          <Link
            href={areaPath}
            className={`block rounded-md px-2 py-1.5 text-sm ${pathname === areaPath ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
          >
            Übersicht
          </Link>
          {rocks.map((rock) => {
            const rockSlug = rock.slug ?? rock.id
            if (!rockSlug) return null

            const rockPath = `${areaPath}/${rockSlug}`
            return (
              <Link
                key={String(rock.id ?? rockSlug)}
                href={rockPath}
                aria-current={pathname === rockPath ? "page" : undefined}
                className={`block truncate rounded-md px-2 py-1.5 text-sm ${pathname === rockPath ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                {rock.name ?? String(rockSlug)}
              </Link>
            )
          })}
        </div>
      </details>
    </li>
  )
}

export function NavigationMenu({ areas }: { areas: Area[] }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false

    const savedTheme = window.localStorage.getItem("theme")
    return savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  function toggleTheme() {
    const nextDark = !dark
    setDark(nextDark)
    document.documentElement.classList.toggle("dark", nextDark)
    window.localStorage.setItem("theme", nextDark ? "dark" : "light")
  }

  const visibleAreas = areas.filter(isOnline)

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[50px] border-b border-border bg-background text-foreground">
      <nav className="mx-auto flex h-full max-w-[1024px] items-center gap-2 px-2" aria-label="Hauptnavigation">
        <div className="flex shrink-0 items-center gap-2 md:w-1/4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Navigation öffnen">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw,20rem)] gap-0 p-0 sm:max-w-none">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full min-h-0 flex-col bg-background">
                <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
                  <Link href="/" className="chelsea-market-regular text-lg no-underline">
                    munichclimbs
                  </Link>
                  <SheetClose asChild>
                    <button className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Navigation schließen">
                      <X className="size-5" />
                    </button>
                  </SheetClose>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
                  <ul className="m-0 list-none p-0">
                    {visibleAreas.map((area) => <NavigationArea key={area.id} area={area} />)}
                  </ul>
                  <hr className="my-2 border-border" />
                  <p className="px-2 py-2 text-sm text-muted-foreground">Kontakt</p>
                  <div className="space-y-1 px-1 pb-4">
                    <SheetClose asChild><Link className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent" href="/datenschutz"><ChartNoAxesCombined className="size-4" />Datenschutz</Link></SheetClose>
                    <SheetClose asChild><Link className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent" href="/impressum"><ChartNoAxesCombined className="size-4" />Impressum</Link></SheetClose>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="chelsea-market-regular hidden text-xl leading-tight no-underline md:inline">munichclimbs</Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center rounded-md border border-border bg-muted px-2 py-1.5 text-sm text-muted-foreground" aria-label="Suche">
          <Search className="mr-2 size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Suche</span>
        </div>

        <div className="relative shrink-0">
          <button onClick={() => setSettingsOpen((open) => !open)} className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-expanded={settingsOpen} aria-label="Einstellungen öffnen">
            <Settings className="size-[18px]" />
          </button>
          {settingsOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-50 rounded-lg border border-border bg-background p-1 shadow-lg">
              <button onClick={toggleTheme} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {dark ? "Helles Design" : "Dunkles Design"}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
