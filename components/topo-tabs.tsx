'use client'

import { useEffect, useRef, useState, type MouseEvent } from "react"

export type TopoTabItem = { id: string; label: string }

export function TopoTabs({ items }: { items: TopoTabItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const activeIdRef = useRef(activeId)

  useEffect(() => {
    if (!items.length) return

    const headerOffset = 91
    let frame = 0
    const syncActiveTab = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const threshold = window.scrollY + headerOffset + 200
        let current = items[0].id

        for (const item of items) {
          const section = document.getElementById(item.id)
          if (!section) continue
          const top = section.getBoundingClientRect().top + window.scrollY
          if (top <= threshold) current = item.id
          else break
        }

        if (current !== activeIdRef.current) {
          activeIdRef.current = current
          setActiveId(current)
          document.getElementById("topo-tab-" + current)?.scrollIntoView({
            block: "nearest",
            inline: "center",
            behavior: "smooth",
          })
        }
      })
    }

    const hashId = window.location.hash.slice(1)
    if (items.some((item) => item.id === hashId)) {
      activeIdRef.current = hashId
      setActiveId(hashId)
    }
    else syncActiveTab()

    window.addEventListener("scroll", syncActiveTab, { passive: true })
    window.addEventListener("resize", syncActiveTab)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", syncActiveTab)
      window.removeEventListener("resize", syncActiveTab)
    }
  }, [items])

  function navigateTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    activeIdRef.current = id
    setActiveId(id)
    window.history.replaceState(null, "", "#" + id)
    const section = document.getElementById(id)
    if (!section) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const top = section.getBoundingClientRect().top + window.scrollY - 91
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" })
  }

  return (
    <nav
      className="sticky top-[50px] z-[1000] mb-3 -ml-2 w-screen overflow-x-hidden border-b border-black bg-[var(--theme-bg)] sm:-ml-4 md:ml-[calc((1024px-100vw)/2-1rem)]"
      aria-label="Topo-Navigation"
    >
      <div className="relative mx-auto w-full max-w-[1024px] overflow-x-hidden bg-[var(--theme-bg)] px-3">
        <div className="flex h-8 w-full min-w-0 flex-nowrap items-center justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-lg bg-transparent p-[3px] [scrollbar-width:thin] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <a
                key={item.id}
                id={"topo-tab-" + item.id}
                href={"#" + item.id}
                aria-current={active ? "location" : undefined}
                data-state={active ? "active" : "inactive"}
                onClick={(event) => navigateTo(event, item.id)}
                className={[
                  "relative inline-flex h-[calc(100%-1px)] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border-0 px-3 py-2 text-sm font-medium text-[var(--theme-text)] transition-all",
                  "focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active
                    ? "bg-black font-semibold text-white opacity-100 shadow-sm"
                    : "bg-transparent opacity-60 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
