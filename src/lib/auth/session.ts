import { cookies } from "next/headers";
import { verifyCustomerToken, verifyAdminToken, TokenPayload } from "./jwt";
import { Permission, hasPermission, isAdmin } from "./rbac";

export const CUSTOMER_COOKIE_NAME = "auren_customer_session";
export const ADMIN_COOKIE_NAME = "auren_admin_session";

/**
 * Get current customer session from cookies
 */
export async function getCustomerSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyCustomerToken(token);
}

/**
 * Get current admin session from cookies
 */
export async function getAdminSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyAdminToken(token);
  if (!payload || !isAdmin(payload.role)) return null;
  return payload;
}

/**
 * Assert that the current request has an admin session with required permission
 */
export async function requireAdminPermission(permission: Permission): Promise<TokenPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Admin authentication required");
  }

  if (!hasPermission(session.role, permission)) {
    throw new Error(`Forbidden: Insufficient privileges for ${permission}`);
  }

  return session;
}
