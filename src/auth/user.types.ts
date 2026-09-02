import type { Permission } from "./permissions";
import type { Role } from "./roles";

export interface PermissionOverrides {
  grant?: Permission[];
  deny?: Permission[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;

  permissionOverrides?: PermissionOverrides;
}
