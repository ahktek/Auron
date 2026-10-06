import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  signCustomerToken,
  verifyCustomerToken,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/auth/jwt";
import { hasPermission, isAtLeastRole, isAdmin } from "@/lib/auth/rbac";
import { formatPrice, slugify } from "@/lib/utils";
import { checkRateLimit } from "@/lib/redis";
import { Role } from "@prisma/client";

describe("Phase 1: Security & Auth Foundation", () => {
  it("hashes password with Argon2id and verifies correctly", async () => {
    const raw = "SuperSecretP@ssw0rd!2026";
    const hashed = await hashPassword(raw);

    expect(hashed).toBeDefined();
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(raw);
    expect(hashed).toContain("$argon2id$");

    const isValid = await verifyPassword(raw, hashed);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword123", hashed);
    expect(isInvalid).toBe(false);
  });

  it("signs and verifies customer JWT tokens securely", async () => {
    const customerPayload = {
      sub: "user_cust_123",
      email: "customer@example.com",
      name: "Jane Doe",
      role: Role.CUSTOMER,
    };

    const token = await signCustomerToken(customerPayload);
    expect(token).toBeDefined();

    const decoded = await verifyCustomerToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.sub).toBe("user_cust_123");
    expect(decoded?.email).toBe("customer@example.com");
    expect(decoded?.role).toBe(Role.CUSTOMER);
  });

  it("signs and verifies admin JWT tokens with RBAC claims", async () => {
    const adminPayload = {
      sub: "user_admin_999",
      email: "admin@aurencarry.com",
      name: "Marcus Vance",
      role: Role.OWNER,
    };

    const token = await signAdminToken(adminPayload);
    expect(token).toBeDefined();

    const decoded = await verifyAdminToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.role).toBe(Role.OWNER);
  });

  it("enforces RBAC permissions hierarchy", () => {
    // OWNER should have full rights
    expect(hasPermission(Role.OWNER, "MANAGE_USERS")).toBe(true);
    expect(hasPermission(Role.OWNER, "REFUND_ORDERS")).toBe(true);
    expect(hasPermission(Role.OWNER, "MANAGE_CATALOG")).toBe(true);
    expect(isAdmin(Role.OWNER)).toBe(true);

    // EDITOR cannot manage users or refund
    expect(hasPermission(Role.EDITOR, "MANAGE_USERS")).toBe(false);
    expect(hasPermission(Role.EDITOR, "REFUND_ORDERS")).toBe(false);
    expect(hasPermission(Role.EDITOR, "MANAGE_CATALOG")).toBe(true);
    expect(isAdmin(Role.EDITOR)).toBe(true);

    // SUPPORT can refund & moderate reviews, but cannot manage catalog or users
    expect(hasPermission(Role.SUPPORT, "REFUND_ORDERS")).toBe(true);
    expect(hasPermission(Role.SUPPORT, "MODERATE_REVIEWS")).toBe(true);
    expect(hasPermission(Role.SUPPORT, "MANAGE_CATALOG")).toBe(false);
    expect(hasPermission(Role.SUPPORT, "MANAGE_USERS")).toBe(false);
    expect(isAdmin(Role.SUPPORT)).toBe(true);

    // CUSTOMER has no admin permissions
    expect(hasPermission(Role.CUSTOMER, "VIEW_ORDERS")).toBe(false);
    expect(isAdmin(Role.CUSTOMER)).toBe(false);

    // Hierarchy checks
    expect(isAtLeastRole(Role.OWNER, Role.EDITOR)).toBe(true);
    expect(isAtLeastRole(Role.EDITOR, Role.OWNER)).toBe(false);
    expect(isAtLeastRole(Role.SUPPORT, Role.CUSTOMER)).toBe(true);
  });
});

describe("Phase 1: Core Design Tokens & Utilities", () => {
  it("formats prices across currencies accurately", () => {
    expect(formatPrice(199)).toBe("$199");
    expect(formatPrice(199.5, "USD")).toBe("$199.50");
    expect(formatPrice(150, "EUR")).toContain("150");
  });

  it("slugifies product and collection names accurately", () => {
    expect(slugify("Apex Transit Backpack 24L")).toBe("apex-transit-backpack-24l");
    expect(slugify("Work & Commute Essentials")).toBe("work-commute-essentials");
    expect(slugify("  Special @#$ Collection!  ")).toBe("special-collection");
  });

  it("rate limits requests accurately with sliding window / counter fallback", async () => {
    const testId = `test_user_${Date.now()}`;
    const firstAttempt = await checkRateLimit(testId, 3, 60);
    expect(firstAttempt.success).toBe(true);
    expect(firstAttempt.remaining).toBe(2);

    await checkRateLimit(testId, 3, 60); // 2nd
    await checkRateLimit(testId, 3, 60); // 3rd

    const fourthAttempt = await checkRateLimit(testId, 3, 60);
    expect(fourthAttempt.success).toBe(false);
    expect(fourthAttempt.remaining).toBe(0);
  });
});
