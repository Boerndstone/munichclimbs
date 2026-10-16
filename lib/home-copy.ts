export type HomeLocale = "de" | "en"

const copy = {
  de: {
    heading: "Klettergebiete um München", areas: "Klettergebiete", sidebar: "Aktuelles", noAreas: "Derzeit sind keine Klettergebiete veröffentlicht.",
    mapOpen: "Karte der Klettergebiete öffnen", mapTitle: "Karte der Klettergebiete", mapDescription: "Wählen Sie einen Fels auf der Karte oder nutzen Sie die nachfolgende Liste mit direkten Links.", mapList: "Felsen auf der Karte",
    distance: "Entfernung von München:", all: "Alle", underHour: "< 1 h", oneToOneHalf: "1 – 1,5 h", overTwoHours: "> 2 h",
    routes: "Touren", rocks: "Felsen", rock: "Fels", gradeAxis: "Grad (UIAA)", countAxis: "Anzahl", area: "Klettergebiet",
    closures: "Aktuelle Sperrungen", latestTopos: "Neueste Topos", latestRoutes: "Neueste Routen", moreLatestRoutes: "Mehr aktuelle Touren", toTopo: "Zum Topo", support: "In eigener Sache", latestRoutesPage: "Neueste Routen", route: "Tour", grade: "Schwierigkeit", firstAscent: "Erstbegeher",
  },
  en: {
    heading: "Climbing areas around Munich", areas: "Climbing areas", sidebar: "Latest updates", noAreas: "There are currently no published climbing areas.",
    mapOpen: "Open climbing-area map", mapTitle: "Climbing-area map", mapDescription: "Select a crag on the map or use the following list of direct links.", mapList: "Crags on the map",
    distance: "Travel time from Munich:", all: "All", underHour: "< 1 h", oneToOneHalf: "1 – 1.5 h", overTwoHours: "> 2 h",
    routes: "routes", rocks: "crags", rock: "crag", gradeAxis: "Grade (UIAA)", countAxis: "Count", area: "Climbing area",
    closures: "Current closures", latestTopos: "Latest topos", latestRoutes: "Latest routes", moreLatestRoutes: "More recent routes", toTopo: "View topo", support: "About this project", latestRoutesPage: "Latest routes", route: "Route", grade: "Grade", firstAscent: "First ascent",
  },
} as const

export function homeCopy(locale: HomeLocale) { return copy[locale] }
export function localizedPath(path: string, locale: HomeLocale) { return locale === "en" ? (path === "/" ? "/en" : `/en${path}`) : path }
