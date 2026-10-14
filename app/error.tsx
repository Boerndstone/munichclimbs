"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Failed to render Munichclimbs page", error)
  }, [error])

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-4 py-16" aria-labelledby="page-error-title">
      <p className="text-sm font-medium text-muted-foreground">Vorübergehendes Problem</p>
      <h1 id="page-error-title" className="text-3xl font-semibold tracking-tight">Diese Seite konnte nicht geladen werden</h1>
      <p className="max-w-prose text-muted-foreground">Bitte versuchen Sie es erneut. Wenn das Problem bestehen bleibt, kehren Sie zur Startseite zurück.</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={reset}>Erneut versuchen</Button>
        <Button asChild variant="outline"><Link href="/">Zur Startseite</Link></Button>
      </div>
    </section>
  )
}
