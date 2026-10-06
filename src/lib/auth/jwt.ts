import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "auren_super_secure_auth_secret_phase_key_32bytes_minimum"
);

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "auren_admin_jwt_secret_token_signature_key_2026"
);

export interface TokenPayload {
  sub: string;
  email: string;
  name?: string | null;
  role: Role;
}

/**
 * Sign customer session JWT (30 days validity)
 */
export async function signCustomerToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setIssuer("auren:storefront")
    .sign(AUTH_SECRET);
}

/**
 * Verify customer session JWT
 */
export async function verifyCustomerToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET, {
      issuer: "auren:storefront",
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Sign admin session JWT (8 hours validity)
 */
export async function signAdminToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setIssuer("auren:admin")
    .sign(ADMIN_SECRET);
}

/**
 * Verify admin session JWT
 */
export async function verifyAdminToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET, {
      issuer: "auren:admin",
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
