import type { Metadata } from "next"

function englishPath(path: string) {
  return path === "/" ? "/en" : `/en${path}`
}

export function localizedAlternates(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    languages: {
      de: path,
      en: englishPath(path),
    },
  }
}

export function englishCanonicalPath(path: string) {
  return englishPath(path)
}
