import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von munichclimbs",
}

export default function DatenschutzPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Impressum</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">1. Verantwortliche Stelle</h2>
        <p className="text-muted-foreground">
          Verantwortlich für die Datenverarbeitung auf dieser Website ist [Name/Anschrift einfügen].
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p className="text-muted-foreground">
          Beim Aufruf unserer Website werden durch den Browser automatisch Informationen an den Server
          gesendet. Diese umfassen u. a. Datum und Uhrzeit des Zugriffs, IP-Adresse und angeforderte
          Seiten. Eine Zuordnung zu einer bestimmten Person ist ohne zusätzliche Daten nicht möglich.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">3. Cookies</h2>
        <p className="text-muted-foreground">
          Sofern wir Cookies einsetzen, werden Sie an entsprechender Stelle darauf hingewiesen.
          Sie können Ihren Browser so einstellen, dass Sie über die Speicherung von Cookies
          informiert werden und diese einzeln erlauben oder ablehnen können.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">4. Ihre Rechte</h2>
        <p className="text-muted-foreground">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten. Bei Fragen wenden Sie sich bitte an die
          verantwortliche Stelle.
        </p>
      </section>

      <p className="text-sm text-muted-foreground pt-4">
        Stand: {new Date().toLocaleDateString("de-DE")}
      </p>
    </div>
  )
}
