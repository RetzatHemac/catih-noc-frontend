import { describe, expect, it } from "vitest";

import {
  can,
  PERMISSIONS,
  ROLES,
  type AuthUser,
  type Role,
} from "../../../auth";

function createUser(role: Role): AuthUser {
  return {
    id: `user-${role}`,
    name: "Usuario de prueba",
    email: "usuario@prueba.mx",
    role,
  };
}

describe("NOC Online access", () => {
  it.each([ROLES.SUPER_ADMIN, ROLES.NOC_SUPERVISOR])(
    "allows %s to view online users",
    (role) => {
      expect(can(createUser(role), PERMISSIONS.NOC_USERS_VIEW)).toBe(true);
    },
  );

  it("denies roles without the permission", () => {
    expect(can(createUser(ROLES.ANALISTA), PERMISSIONS.NOC_USERS_VIEW)).toBe(
      false,
    );
  });
});
