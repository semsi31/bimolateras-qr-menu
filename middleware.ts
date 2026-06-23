import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifySessionTokenWithReason,
} from "@/lib/session";

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
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET);

  if (pathname.startsWith("/admin/login")) {
    const verify = await verifySessionTokenWithReason(token);

    console.log("[ADMIN_MIDDLEWARE]", {
      pathname,
      hasCookie: Boolean(token),
      cookieName: ADMIN_SESSION_COOKIE,
      hasAuthSecret,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      verifyResult: verify.valid,
      verifyErrorReason: verify.reason,
    });

    if (verify.valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedAdminPath(pathname)) {
    const verify = await verifySessionTokenWithReason(token);

    console.log("[ADMIN_MIDDLEWARE]", {
      pathname,
      hasCookie: Boolean(token),
      cookieName: ADMIN_SESSION_COOKIE,
      hasAuthSecret,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      verifyResult: verify.valid,
      verifyErrorReason: verify.reason,
    });

    if (!verify.valid) {
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
