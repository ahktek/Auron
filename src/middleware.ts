import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/jwt";

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/curecare-internal-8921/:path*",
    "/curecare-internal-8921",
    "/api/curecare-internal-8921/:path*",
  ],
};

const ADMIN_COOKIE_NAME = "auren_admin_session";
const SECRET_ADMIN_PATH = "/curecare-internal-8921";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Enterprise Obfuscation: Completely block and 404 any access to /admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const notFoundUrl = new URL("/not-found", request.url);
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  // 2. Allow the secret login page and the login API without requiring an existing session
  if (
    pathname === `${SECRET_ADMIN_PATH}/login` ||
    pathname === `/api${SECRET_ADMIN_PATH}/auth/login`
  ) {
    return NextResponse.next();
  }

  // 3. For any other route inside the secret portal or its API, enforce valid JWT session
  if (
    pathname === SECRET_ADMIN_PATH ||
    pathname.startsWith(`${SECRET_ADMIN_PATH}/`) ||
    pathname.startsWith(`/api${SECRET_ADMIN_PATH}/`)
  ) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Enterprise administrative session required." },
          { status: 401 }
        );
      }
      const loginUrl = new URL(`${SECRET_ADMIN_PATH}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Invalid or expired administrative token." },
          { status: 403 }
        );
      }
      const loginUrl = new URL(`${SECRET_ADMIN_PATH}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
