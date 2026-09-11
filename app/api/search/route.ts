import { NextRequest, NextResponse } from "next/server"

const searchEndpoint =
  process.env.SEARCH_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080/search"
    : "https://www.munichclimbs.de/search")

export async function GET(request: NextRequest) {
  const upstream = new URL(searchEndpoint)
  upstream.search = request.nextUrl.search

  const response = await fetch(upstream, { cache: "no-store" })
  return NextResponse.json(await response.json(), { status: response.status })
}
