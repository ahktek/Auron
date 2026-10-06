import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 100,
  EDITOR: 50,
  SUPPORT: 25,
  CUSTOMER: 0,
};

export type AdminRole = "OWNER" | "EDITOR" | "SUPPORT";

export const ADMIN_PERMISSIONS = {
  MANAGE_USERS: ["OWNER"],
  MANAGE_SETTINGS: ["OWNER"],
  REFUND_ORDERS: ["OWNER", "SUPPORT"],
  FULFILL_ORDERS: ["OWNER", "EDITOR", "SUPPORT"],
  VIEW_ORDERS: ["OWNER", "EDITOR", "SUPPORT"],
  MANAGE_CATALOG: ["OWNER", "EDITOR"],
  MANAGE_CMS: ["OWNER", "EDITOR"],
  MODERATE_REVIEWS: ["OWNER", "EDITOR", "SUPPORT"],
  VIEW_ANALYTICS: ["OWNER", "EDITOR"],
} as const;

export type Permission = keyof typeof ADMIN_PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = ADMIN_PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(role);
}

export function isAtLeastRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export function isAdmin(role: Role): boolean {
  return role === "OWNER" || role === "EDITOR" || role === "SUPPORT";
}
