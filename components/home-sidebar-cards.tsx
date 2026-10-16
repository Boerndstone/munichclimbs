import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { homeCopy, localizedPath, type HomeLocale } from "@/lib/home-copy"
import type { HomeBannedRock, HomeLatestRoute } from "@/types/home"

function dayOfYear(date: Date): number { return Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / 86_400_000) }

export function BannedRocksCard({ rocks, locale = "de" }: { rocks: HomeBannedRock[]; locale?: HomeLocale }) {
  const labels = homeCopy(locale)
  const today = dayOfYear(new Date())
  const activeRocks = rocks.filter((rock) => (rock.banned === 1 && today < 181) || (rock.banned === 2 && today < 212))
  if (!activeRocks.length) return null
  return <section className="overflow-hidden rounded-lg border border-red-700 bg-card shadow-md dark:border-red-800" aria-labelledby="banned-rocks-heading"><h2 id="banned-rocks-heading" className="bg-red-700 px-3 py-2 text-lg font-light leading-normal text-white dark:bg-red-800">{labels.closures}</h2><ul className="my-2 list-none px-0">{activeRocks.map((rock) => <li key={rock.id}><Link href={localizedPath(`/${rock.areaSlug}/${rock.slug}`, locale)} className="flex items-start gap-x-2 px-2 py-1 leading-[1.3rem] hover:bg-muted"><span className="w-4 shrink-0 select-none pt-0.5 pe-1 text-center text-sm leading-none text-red-700 dark:text-red-500" aria-hidden="true">•</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-normal">{rock.name}</span><span className="block truncate text-sm font-light">{rock.areaName}</span></span></Link></li>)}</ul></section>
}

export function LatestRoutesCard({ routes, locale = "de" }: { routes: HomeLatestRoute[]; locale?: HomeLocale }) {
  const labels = homeCopy(locale)
  return <section className="overflow-hidden rounded-lg border border-sky-800 bg-card shadow-md dark:border-sky-700" aria-labelledby="latest-routes-heading"><h2 id="latest-routes-heading" className="bg-sky-800 px-3 py-2 text-lg font-light leading-normal text-white dark:bg-sky-900">{labels.latestRoutes}</h2><ul className="my-2 list-none px-0">{routes.map((route) => <li key={route.id} className="mb-2"><Link href={localizedPath(`/${route.areaSlug}/${route.rockSlug}`, locale)} className="flex items-start gap-x-2 px-2 py-1 leading-[1.3rem] hover:bg-muted"><span className="w-4 shrink-0 select-none pt-0.5 pe-1 text-center text-base leading-none text-sky-800 dark:text-sky-400" aria-hidden="true">•</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-normal">{route.name}{route.grade ? ` ${route.grade}` : ""}</span><span className="block truncate text-sm font-light">{route.rockName}</span></span></Link></li>)}</ul><hr className="my-2 border-0 border-t border-dotted border-border" /><Link href={localizedPath("/neuesteRouten", locale === "en" ? "en" : "de").replace("/en/neuesteRouten", "/en/latest-routes")} className="flex items-center px-2 pb-2 text-sm font-semibold text-sky-800 hover:underline dark:text-sky-400"><ChevronRight className="size-4" aria-hidden="true" />{labels.moreLatestRoutes}</Link></section>
}

export function SupportProjectCard({ locale = "de" }: { locale?: HomeLocale }) {
  const labels = homeCopy(locale)
  return <section className="overflow-hidden rounded-lg border border-green-700 bg-card shadow-md dark:border-green-800" aria-labelledby="support-project-heading"><h2 id="support-project-heading" className="bg-green-700 px-3 py-2 text-lg font-light leading-normal text-white dark:bg-green-800">{labels.support}</h2><div className="space-y-3 px-3 py-2 text-sm leading-relaxed"><p>{locale === "en" ? "On updated topos, clicking a route number opens its route information." : "Bei den aktualisierten Topos ist es ab sofort möglich, durch Klick auf die Nummerierung im Topo Informationen zur Route zu bekommen."}</p><hr className="border-border" /><p className="font-semibold">{locale === "en" ? "Would you like to support the project?" : "Du möchtest unser Projekt unterstützen?"}</p><p>{locale === "en" ? "Share photos, topos and information about crags and routes. Your contribution helps other climbers." : "Dann teile Bilder, Topos und Informationen zu Felsen und Routen mit uns! Dein Beitrag wird anderen Kletterern einen Mehrwert bieten."}</p><p>{locale === "en" ? "We appreciate every contribution. Contact us at:" : "Wir sind dankbar für jede Unterstützung, schick uns einfach eine E-Mail an:"}</p><p className="font-medium"><a className="text-sky-800 underline dark:text-sky-400" href="mailto:admin@munichclimbs.de">admin@munichclimbs.de</a></p></div></section>
}
