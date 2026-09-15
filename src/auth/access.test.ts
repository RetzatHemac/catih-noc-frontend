import { describe, expect, it } from "vitest";
import { can, getUserPermissions } from "./access";
import { PERMISSIONS } from "./permissions";
import { ROLES } from "./roles";
import type { AuthUser } from "./user.types";

const user: AuthUser = {
  id: "user",
  name: "Usuario",
  email: "user@test.mx",
  role: ROLES.SUPER_ADMIN,
};

describe("effective session permissions", () => {
  it("uses only session permissions, without adding local role permissions or grants", () => {
    const remoteUser: AuthUser = {
      ...user,
      effectivePermissions: [PERMISSIONS.PROFILE_VIEW],
      permissionOverrides: {
        grant: [PERMISSIONS.TICKET_PAUSE],
        deny: [PERMISSIONS.PROFILE_VIEW],
      },
    };
    expect(getUserPermissions(remoteUser)).toEqual([PERMISSIONS.PROFILE_VIEW]);
    expect(can(remoteUser, PERMISSIONS.TICKET_PAUSE)).toBe(false);
  });

  it("treats an empty effective list as no permissions even for a local super administrator", () => {
    expect(getUserPermissions({ ...user, effectivePermissions: [] })).toEqual(
      [],
    );
  });

  it("retains local role and override behavior when the session list is absent", () => {
    const mock: AuthUser = {
      ...user,
      role: ROLES.SOPORTE,
      permissionOverrides: {
        grant: [PERMISSIONS.PROJECTS_VIEW],
        deny: [PERMISSIONS.PROFILE_VIEW],
      },
    };
    expect(can(mock, PERMISSIONS.PROJECTS_VIEW)).toBe(true);
    expect(can(mock, PERMISSIONS.PROFILE_VIEW)).toBe(false);
    expect(can(mock, PERMISSIONS.TICKET_MANAGE)).toBe(true);
  });
});
