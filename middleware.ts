import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If user is authenticated and trying to access login/signup, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder).*)"],
}
