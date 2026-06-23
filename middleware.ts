import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/session";

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
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasSessionCookie = Boolean(token);

  console.log("[ADMIN_MIDDLEWARE]", {
    pathname,
    hasSessionCookie,
  });

  if (pathname.startsWith("/admin/login")) {
    const session = await verifySessionToken(token);

    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedAdminPath(pathname)) {
    const session = await verifySessionToken(token);

    if (!session) {
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
