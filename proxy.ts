import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const legacyLegalRoutes: Record<string, string> = {
  "/Datenschutz": "/datenschutz",
  "/Impressum": "/impressum",
}

export function proxy(request: NextRequest) {
  const destination = legacyLegalRoutes[request.nextUrl.pathname]
  if (!destination) return NextResponse.next()

  return NextResponse.redirect(new URL(destination, request.url), 308)
}

export const config = {
  matcher: ["/Datenschutz", "/Impressum"],
}
