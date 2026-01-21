import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/quotations", "/customers", "/products", "/companies", "/settings"]
const PUBLIC_ROUTES = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  // Protect dashboard routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/quotations", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
