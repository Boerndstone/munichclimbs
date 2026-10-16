import type { Metadata } from "next"

const rows = [
  ["1", "1", "1", "VB-"], ["2", "2", "1", "VB-"], ["3", "3", "1/2", "VB-"], ["4", "4", "2", "VB-"], ["4+", "4+", "2", "VB-"], ["5-", "5a", "2/3", "VB-/VB"], ["5", "5a/5b", "3", "VB"], ["5+", "5b", "4a", "VB/V0-"], ["6-", "5b/5c", "4a/4b", "V0-"], ["6", "5c", "4b", "V0-/V0"], ["6+", "6a", "4c", "V0"], ["7-", "6a+", "5a", "V0+"], ["7", "6b", "5b", "V1"], ["7+", "6b+", "5c", "V1/V2"], ["7+/8-", "6c", "6a", "V2"], ["8-", "6c+", "6a+", "V2/V3"], ["8", "7a", "6b", "V3"], ["8+", "7a+", "6b+", "V3/V4"], ["8+/9-", "7b", "6b+/6c", "V4"], ["9-", "7b+", "6c", "V4"], ["9", "7c", "6c+", "V4/V5"], ["9+", "7c+", "7a", "V5"], ["9+/10-", "8a", "7a+", "V6"], ["10-", "8a/8a+", "7a+/7b", "V6/V7"], ["10-", "8a+", "7b", "V7"], ["10", "8b", "7b+", "V8"], ["10+", "8b+", "7c", "V9"], ["10+/11-", "8c", "7c+", "V10"], ["11-", "8c+", "7c+/8a", "V10/V11"], ["11", "9a", "8a", "V11"], ["11", "9a/9a+", "8a+", "V12"], ["11/11+", "9a+", "8a+/8b", "V12/V13"], ["11+", "9a+/9b", "8b", "V13"], ["11+/12-", "9b", "8b+", "V14"], ["12-", "9b+", "8c", "V15"], ["12", "9c", "8c+", "V16"],
]

export function gradeComparisonMetadata(locale: "de" | "en"): Metadata {
  const english = locale === "en"
  const title = english ? "Climbing grade comparison" : "Tabelle Schwierigkeitsgrade"
  const description = english ? "Comparison of UIAA, French sport, Fontainebleau and Hueco V climbing grades." : "Vergleich von UIAA, französischer Sport-, Fontainebleau- und Hueco-V-Skala."
  const path = english ? "/en/free-climbing-grade-comparison" : "/Gradvergleich-Freiklettern"
  return { title, description, alternates: { canonical: path, languages: { de: "/Gradvergleich-Freiklettern", en: "/en/free-climbing-grade-comparison" } }, openGraph: { title: `${title} | Munichclimbs`, description, url: path, locale: english ? "en_US" : "de_DE", alternateLocale: english ? "de_DE" : "en_US" } }
}

export function GradeComparisonPage({ locale }: { locale: "de" | "en" }) {
  const english = locale === "en"
  const heading = english ? "Climbing grade comparison" : "Tabelle Schwierigkeitsgrade"
  return <section className="mb-6"><div className="mb-3 flex items-center justify-between py-3"><h1 className="text-3xl font-medium leading-tight">{heading}</h1></div><div className="overflow-x-auto rounded-lg border border-border shadow-sm"><table className="min-w-full border-collapse text-left"><thead className="border-b border-border bg-muted"><tr>{["UIAA", english ? "French sport" : "Franz. Sport", "Fb (Font)", "V (Hueco)"].map((label) => <th key={label} scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide sm:px-4">{label}</th>)}</tr></thead><tbody className="divide-y divide-border font-mono text-xs sm:text-sm">{rows.map((row, index) => <tr key={`${row.join("-")}-${index}`} className="odd:bg-background even:bg-muted/50 hover:bg-muted">{row.map((cell, column) => <td key={`${column}-${cell}`} className="px-3 py-2 sm:px-4">{cell}</td>)}</tr>)}</tbody></table></div></section>
}
