"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookAlert, ChevronRight, LayoutList, Menu, Moon, Settings, ShieldAlert, Sun, Table, X } from "lucide-react"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { getAreaSlug } from "@/lib/slugify"
import type { Area } from "@/types/area"
import { SearchModal } from "@/components/search-modal"

function isOnline(area: Area) { return Number(area.online) === 1 }
function isEnglishPath(pathname: string) { return pathname === "/en" || pathname.startsWith("/en/") }
function localizedPath(pathname: string, locale: "de" | "en") { const germanPath = pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, ""); return locale === "de" ? germanPath : germanPath === "/" ? "/en" : `/en${germanPath}` }

const labels = {
  de: { main: "Hauptnavigation", open: "Navigation öffnen", title: "Navigation", description: "Liste der Klettergebiete und Felsen.", overview: "Übersicht", information: "Weitere Informationen", grades: "Tabelle Schwierigkeitsgrade", contact: "Kontakt", privacy: "Datenschutz", imprint: "Impressum", settings: "Einstellungen öffnen", language: "Sprache", light: "Helles Farbschema aktivieren", dark: "Dunkles Farbschema aktivieren", close: "Navigation schließen" },
  en: { main: "Main navigation", open: "Open navigation", title: "Navigation", description: "List of climbing areas and crags.", overview: "Overview", information: "Further information", grades: "Climbing grade comparison", contact: "Contact", privacy: "Privacy policy", imprint: "Legal notice", settings: "Open settings", language: "Language", light: "Use light colour scheme", dark: "Use dark colour scheme", close: "Close navigation" },
} as const

function NavigationArea({ area, locale }: { area: Area; locale: "de" | "en" }) {
  const pathname = usePathname()
  const areaSlug = getAreaSlug(area)
  const areaPath = `${locale === "en" ? "/en" : ""}/${areaSlug}`
  const rocks = area.rocks ?? []
  const isCurrentArea = pathname === areaPath || pathname.startsWith(`${areaPath}/`)
  const [isOpen, setIsOpen] = useState(isCurrentArea)
  const copy = labels[locale]
  return <Collapsible asChild open={isCurrentArea || isOpen} onOpenChange={setIsOpen}><li><CollapsibleTrigger asChild><Button variant="ghost" className="h-auto w-full justify-start gap-2 px-2 py-2 text-left text-sm font-normal text-foreground hover:cursor-pointer">{area.image ? <img src={`https://www.munichclimbs.de/build/images/navigationThumbs/${area.image}.webp`} alt="" className="size-[18px] shrink-0 rounded object-cover" loading="lazy" /> : <span className="size-[18px] shrink-0 rounded bg-muted" aria-hidden="true" />}<span className="min-w-0 flex-1 truncate text-left">{area.name}</span><ChevronRight className={`size-4 shrink-0 transition-transform duration-200 ${(isCurrentArea || isOpen) ? "rotate-90" : ""}`} aria-hidden="true" /></Button></CollapsibleTrigger><CollapsibleContent className="pb-1 pl-7 pr-2"><SheetClose asChild><Link href={areaPath} aria-current={pathname === areaPath ? "page" : undefined} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${pathname === areaPath ? "bg-accent font-medium text-foreground" : "text-foreground hover:bg-accent"}`}><LayoutList className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">{copy.overview}</span></Link></SheetClose>{rocks.map((rock) => { const rockSlug = rock.slug ?? rock.id; if (!rockSlug) return null; const rockPath = `${areaPath}/${rockSlug}`; return <SheetClose asChild key={String(rock.id ?? rockSlug)}><Link href={rockPath} aria-current={pathname === rockPath ? "page" : undefined} className={`block truncate rounded-md px-2 py-1.5 text-sm ${pathname === rockPath ? "bg-accent font-medium text-foreground" : "text-foreground hover:bg-accent"}`}>{rock.name ?? String(rockSlug)}</Link></SheetClose> })}</CollapsibleContent></li></Collapsible>
}

export function NavigationMenu({ areas }: { areas: Area[] }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsTriggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const english = isEnglishPath(pathname)
  const locale = english ? "en" : "de"
  const copy = labels[locale]
  const germanPath = localizedPath(pathname, "de")
  const englishPath = localizedPath(pathname, "en")
  const [dark, setDark] = useState(() => typeof window !== "undefined" && (window.localStorage.getItem("theme") === "dark" || (!window.localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)))
  useEffect(() => { document.documentElement.classList.toggle("dark", dark) }, [dark])
  function toggleTheme() { const nextDark = !dark; setDark(nextDark); document.documentElement.classList.toggle("dark", nextDark); window.localStorage.setItem("theme", nextDark ? "dark" : "light") }
  function closeSettings() { setSettingsOpen(false); window.requestAnimationFrame(() => settingsTriggerRef.current?.focus()) }
  const visibleAreas = areas.filter(isOnline)
  const gradePath = locale === "en" ? "/en/free-climbing-grade-comparison" : "/Gradvergleich-Freiklettern"
  const privacyPath = locale === "en" ? "/en/datenschutz" : "/datenschutz"
  const imprintPath = locale === "en" ? "/en/impressum" : "/impressum"
  return <header className="fixed inset-x-0 top-0 z-40 h-[50px] border-b border-border bg-background text-foreground"><nav className="mx-auto flex h-full max-w-[1024px] items-center gap-2 px-2" aria-label={copy.main}><div className="flex shrink-0 items-center gap-2 md:w-1/4"><Sheet><SheetTrigger asChild><Button type="button" variant="ghost" size="icon-sm" aria-label={copy.open}><Menu className="size-5" aria-hidden="true" /></Button></SheetTrigger><SheetContent side="left" showCloseButton={false} className="w-[min(100vw,20rem)] gap-0 p-0 sm:max-w-none"><SheetTitle className="sr-only">{copy.title}</SheetTitle><SheetDescription className="sr-only">{copy.description}</SheetDescription><div className="flex h-full min-h-0 flex-col bg-background"><div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2"><SheetClose asChild><Link href={locale === "en" ? "/en" : "/"} className="chelsea-market-regular text-lg no-underline">munichclimbs</Link></SheetClose><SheetClose asChild><Button type="button" variant="ghost" size="icon" aria-label={copy.close}><X className="size-5" aria-hidden="true" /></Button></SheetClose></div><div className="min-h-0 flex-1 overflow-y-auto px-1 py-2"><ul className="m-0 list-none p-0">{visibleAreas.map((area) => <NavigationArea key={area.id} area={area} locale={locale} />)}</ul><hr className="my-2 border-border" /><p className="px-2 py-2 text-sm text-muted-foreground">{copy.information}</p><div className="space-y-1 px-1 pb-3"><SheetClose asChild><Link className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent" href={gradePath}><Table className="size-4" aria-hidden="true" />{copy.grades}</Link></SheetClose></div><hr className="my-2 border-border" /><p className="px-2 py-2 text-sm text-muted-foreground">{copy.contact}</p><div className="space-y-1 px-1 pb-4"><SheetClose asChild><Link className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent" href={privacyPath}><ShieldAlert className="size-4" aria-hidden="true" />{copy.privacy}</Link></SheetClose><SheetClose asChild><Link className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent" href={imprintPath}><BookAlert className="size-4" aria-hidden="true" />{copy.imprint}</Link></SheetClose></div></div></div></SheetContent></Sheet><Link href={locale === "en" ? "/en" : "/"} className="chelsea-market-regular hidden text-xl leading-tight no-underline md:inline">munichclimbs</Link></div><SearchModal areas={visibleAreas} /><div className="relative shrink-0"><Button ref={settingsTriggerRef} type="button" variant="ghost" size="icon" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-controls="navigation-settings" aria-haspopup="menu" aria-label={copy.settings}><Settings className="size-[18px]" aria-hidden="true" /></Button>{settingsOpen && <div id="navigation-settings" role="menu" aria-label={copy.settings} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeSettings() } }} className="absolute end-0 top-[calc(100%+6px)] z-[1070] w-max min-w-0 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] py-1 text-[var(--theme-text)] shadow-lg ring-1 ring-black/5 dark:ring-white/10"><div className="flex flex-wrap items-center gap-3 px-2 py-2"><div className="flex items-center rounded-md border border-border p-0.5" role="group" aria-label={copy.language}><Button asChild variant={english ? "ghost" : "secondary"} size="sm" className="h-7 px-2 text-xs" aria-current={english ? undefined : "page"}><Link href={germanPath}>DE</Link></Button><Button asChild variant={english ? "secondary" : "ghost"} size="sm" className="h-7 px-2 text-xs" aria-current={english ? "page" : undefined}><Link href={englishPath}>EN</Link></Button></div><span className="h-5 w-px bg-border" aria-hidden="true" /><Button type="button" variant="ghost" size="icon-sm" role="menuitem" aria-label={dark ? copy.light : copy.dark} onClick={toggleTheme}>{dark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}</Button></div></div>}</div></nav></header>
}
