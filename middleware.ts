import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/session";

const protectedAdminPaths = [
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/settings",
  "/admin/logout",
];

function isProtectedAdminPath(pathname: string) {
  return protectedAdminPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (pathname.startsWith("/admin/login")) {
    console.log("[ADMIN_MIDDLEWARE]", {
      pathname,
      hasCookie: Boolean(sessionCookie),
      cookieName: ADMIN_SESSION_COOKIE,
      mode: "login-page",
    });

    return NextResponse.next();
  }

  if (isProtectedAdminPath(pathname)) {
    console.log("[ADMIN_MIDDLEWARE]", {
      pathname,
      hasCookie: Boolean(sessionCookie),
      cookieName: ADMIN_SESSION_COOKIE,
      mode: "cookie-presence",
    });

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search}`
      );
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
