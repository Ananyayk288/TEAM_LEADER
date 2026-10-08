// middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
// Next.js Server Middleware for Route Protection & Security
// Enforces server-side authentication check on all protected pages & APIs.
// Redirects unauthenticated users to /login and logged-in users away from /login.
// Disables browser caching on protected routes to prevent Back-button leakage.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

// Excluded paths (public assets, login API, static files)
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/favicon.ico",
  "/login_bg.jpg",
  "/viceverse_logo.png",
  "/ivc_logo.png",
  "/squad_bg.png",
  "/background.png",
  "/screen1.png",
  "/screen2.png",
  "/screen3.png",
];

const STATIC_PREFIXES = ["/_next", "/static", "/uploads", "/public"];
const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/i;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets & images
  if (
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    STATIC_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Extract session token from HTTP-only cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sessionUser = await verifySessionToken(sessionToken);
  const isAuthenticated = !!sessionUser;

  // 3. Handle /login page access
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 4. Check public paths
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // 5. Handle unauthenticated access to protected routes
  if (!isAuthenticated) {
    // If requesting an API route, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized — Valid session required" },
        { status: 401 }
      );
    }

    // Redirect page requests to /login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("denied", "1");
    return NextResponse.redirect(loginUrl);
  }

  // 6. Authenticated user accessing protected route: proceed with anti-caching security headers
  const response = NextResponse.next();

  // Prevent browser caching of protected pages (stops back-button after logout)
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate, private");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
