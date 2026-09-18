import type { Permission } from "./permissions";
import type { Role } from "./roles";
import type { CompanyBranding } from "../features/companies/types/company.types";

export interface PermissionOverrides {
  grant?: Permission[];
  deny?: Permission[];
}

export interface AuthUser {
  id: string;
  username?: string;
  name: string;
  email: string;
  role: Role;
  company?: CompanyBranding;

  /** Authoritative permissions from the session adapter; [] grants nothing. */
  effectivePermissions?: Permission[];

  permissionOverrides?: PermissionOverrides;
}
