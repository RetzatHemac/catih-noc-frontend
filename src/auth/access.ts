import type { Permission } from "./permissions";

import { ROLE_PERMISSIONS } from "./rolePermissions";

import type { Role } from "./roles";
import type { AuthUser } from "./user.types";

export function hasRolePermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getUserPermissions(user: AuthUser): Permission[] {
  const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];

  const granted = user.permissionOverrides?.grant ?? [];

  const denied = user.permissionOverrides?.deny ?? [];

  return [...new Set([...rolePermissions, ...granted])].filter(
    (permission) => !denied.includes(permission),
  );
}

export function can(user: AuthUser, permission: Permission): boolean {
  return getUserPermissions(user).includes(permission);
}

export function canAny(user: AuthUser, permissions: Permission[]): boolean {
  return permissions.some((permission) => can(user, permission));
}

export function canAll(user: AuthUser, permissions: Permission[]): boolean {
  return permissions.every((permission) => can(user, permission));
}
