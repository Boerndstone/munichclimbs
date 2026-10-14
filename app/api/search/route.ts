import { NextRequest, NextResponse } from "next/server"

const searchEndpoint =
  process.env.SEARCH_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8083/api/v1/search"
    : "https://www.munichclimbs.de/api/v1/search")

export async function GET(request: NextRequest) {
  try {
    const upstream = new URL(searchEndpoint)
    upstream.search = request.nextUrl.search

    // Search is an interaction, not page data: always query the current index.
    const response = await fetch(upstream, { cache: "no-store" })
    return NextResponse.json(await response.json(), { status: response.status })
  } catch {
    return NextResponse.json(
      { message: "Die Suche ist vorübergehend nicht verfügbar." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
