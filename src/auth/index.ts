export { ROLES, NOC_ROLES, type Role } from "./roles";

export { PERMISSIONS, type Permission } from "./permissions";

export { ROLE_PERMISSIONS } from "./rolePermissions";

export {
  hasRolePermission,
  getUserPermissions,
  can,
  canAny,
  canAll,
} from "./access";

export type { AuthUser, PermissionOverrides } from "./user.types";

export { mockUser } from "./mockUser";

export { AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";
export { usePermission } from "./usePermission";
