import { can } from "./access";
import type { Permission } from "./permissions";
import { useAuth } from "./useAuth";

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();

  return can(user, permission);
}
