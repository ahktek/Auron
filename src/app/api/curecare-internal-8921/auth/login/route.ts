import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, verifyAdminToken } from "@/lib/auth/jwt";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  verifyEnterprisePassword,
} from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    
    // 1. Check Rate Limit
    const limit = checkLoginRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Account temporarily locked for security. Try again in ${limit.retryAfterSeconds} seconds.`,
          locked: true,
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    let authenticated = false;
    let userRole = Role.OWNER;
    let userName = "Cure-Care Administrator";
    let userId = "admin_master_1";

    // 2. Try checking database if available
    try {
      const { prisma } = await import("@/lib/prisma");
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (dbUser && (dbUser.role === Role.OWNER || dbUser.role === Role.EDITOR || dbUser.role === Role.SUPPORT)) {
        const matches = await verifyEnterprisePassword(password, dbUser.passwordHash);
        if (matches) {
          authenticated = true;
          userRole = dbUser.role;
          userName = dbUser.name || "Cure-Care Staff";
          userId = dbUser.id;
        }
      }
    } catch {
      // Prisma offline or schema mismatch fallback
    }

    // 3. Fallback to master enterprise credentials
    if (!authenticated) {
      const allowedAdminEmails = [
        "admin@curecarebd.com",
        "owner@curecarebd.com",
        "curecare@gmail.com",
        "akabd@curecarebd.com",
      ];
      
      const isEmailAllowed = allowedAdminEmails.includes(normalizedEmail);
      const isPasswordValid = await verifyEnterprisePassword(password, "");

      if (isEmailAllowed && isPasswordValid) {
        authenticated = true;
      }
    }

    // 4. Handle Failure
    if (!authenticated) {
      const failure = recordFailedLogin(ip);
      const remainingAttempts = 5; // default scale
      return NextResponse.json(
        {
          success: false,
          error: failure.locked
            ? `Maximum login attempts exceeded. Portal locked for 15 minutes.`
            : "Invalid administrative credentials.",
          locked: failure.locked,
          retryAfterSeconds: failure.retryAfterSeconds,
        },
        { status: 401 }
      );
    }

    // 5. Success: reset rate limit & issue signed HttpOnly enterprise JWT
    resetLoginAttempts(ip);

    const token = await signAdminToken({
      sub: userId,
      email: normalizedEmail,
      name: userName,
      role: userRole,
    });

    const response = NextResponse.json({
      success: true,
      user: { email: normalizedEmail, name: userName, role: userRole },
    });

    // Enterprise Cookie: HttpOnly, Secure in prod, SameSite=Strict, 8 hours
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    // Also set legacy indicator for client-side state
    response.cookies.set({
      name: "auren_admin_authenticated",
      value: "true",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout endpoint
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: "auren_admin_authenticated",
    value: "",
    httpOnly: false,
    path: "/",
    maxAge: 0,
  });
  return response;
}
