import Link from "next/link"

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-4 py-16" aria-labelledby="not-found-title">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 id="not-found-title" className="text-3xl font-semibold tracking-tight">Seite nicht gefunden</h1>
      <p className="max-w-prose text-muted-foreground">Die angeforderte Seite oder der Fels ist nicht verfügbar.</p>
      <Link href="/" className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80">Zur Startseite</Link>
    </section>
  )
}
