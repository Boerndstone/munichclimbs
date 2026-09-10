import Image from "next/image"
import Link from "next/link"
import { fetchAreas } from "@/lib/api"
import { getAreaSlug } from "@/lib/slugify"

export async function SiteFooter() {
  const areas = await fetchAreas().catch((error) => {
    console.error("Failed to load footer areas:", error)
    return []
  })
  const onlineAreas = areas.filter((area) => Number(area.online) === 1)
  const year = new Date().getFullYear()

  return (
    <footer className="mt-4 border-t border-border pt-4">
      <section className="mx-auto w-full max-w-[1024px] px-2 sm:px-4">
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          <div className="mb-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide">Gebiete um München</h2>
            <div className="flex flex-wrap">
              {onlineAreas.map((area) => (
                <p key={area.id} className="w-1/2 shrink-0 py-1">
                  <Link className="text-sm hover:underline" href={`/${getAreaSlug(area)}`} title={`Klettergebiet ${area.name}`}>
                    {area.name}
                  </Link>
                </p>
              ))}
            </div>
          </div>

          <div className="mb-4 md:mx-auto md:max-w-md lg:mx-0 lg:max-w-none">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide">munichclimbs</h2>
            <p className="py-1"><Link className="text-sm hover:underline" href="/datenschutz">Datenschutz</Link></p>
            <p className="py-1"><Link className="text-sm hover:underline" href="/impressum">Impressum</Link></p>
            <a href="https://www.treedom.net/de/" target="_blank" rel="noopener noreferrer" className="mt-12 block w-fit text-2xl font-semibold tracking-tight text-[#3dd368]">
              Treedom
              <span className="ml-2 text-sm font-normal">Let&apos;s green the planet!</span>
            </a>
            <a href="https://www.ecopoint-frankenjura.de/" target="_blank" rel="noopener noreferrer" className="mt-12 block text-sm">
              <Image
                src="https://www.munichclimbs.de/build/images/advertisement/ecopoint.webp"
                className="h-14 w-[212px] max-w-full object-contain"
                width={212}
                height={56}
                alt="Von München zum Klettern ins Nördliche Frankenjura? Infos wie das mit ÖPNV geht, bietet Ecopoint Frankenjura."
              />
              <p className="mt-2 italic">Von München zum Klettern ins Nördliche Frankenjura? Infos wie das mit ÖPNV geht, bietet Ecopoint Frankenjura.</p>
            </a>
          </div>
        </div>
      </section>
      <hr className="border-0 border-t border-border" />
      <p className="p-4 text-center text-sm text-muted-foreground">Copyright © {year} munichclimbs. Alle Rechte vorbehalten.</p>
    </footer>
  )
}
