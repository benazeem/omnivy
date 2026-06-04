import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)
 
const protectedRoutes = ["/profile", "/settings", "/api/clip", "/api/clips", "/api/providers"]
 
const publicRoutes = ["/", "/install", "/documentation", "/privacy-policy", "/terms-of-service", "/auth"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth
 
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/"
    }
    return pathname === route || pathname.startsWith(route + "/")
  })
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
 
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !isAuthenticated) {
    
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
   
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
