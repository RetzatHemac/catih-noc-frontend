import { describe, expect, it } from "vitest";

import { ROLES, type AuthUser, type Role } from "../../../auth";

import { canReleaseCrew } from "./crewAccess";

function createUser(role: Role): AuthUser {
  return {
    id: `user-${role}`,
    name: "Usuario de prueba",
    email: "usuario@prueba.mx",
    role,
  };
}

describe("canReleaseCrew", () => {
  it.each([ROLES.SUPER_ADMIN, ROLES.ANALISTA])(
    "allows %s to release crews",
    (role) => {
      expect(canReleaseCrew(createUser(role))).toBe(true);
    },
  );

  it("denies roles without the release permission", () => {
    expect(canReleaseCrew(createUser(ROLES.NOC_SUPERVISOR))).toBe(false);
  });
});
