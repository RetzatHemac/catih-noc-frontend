import { describe, expect, it } from "vitest";

import { ROLES, type AuthUser, type Role } from "../../../auth";

import { canViewPendingTickets } from "./pendingTicketsAccess";

function createUser(role: Role): AuthUser {
  return {
    id: `user-${role}`,
    name: "Usuario de prueba",
    email: "usuario@prueba.mx",
    role,
  };
}

describe("canViewPendingTickets", () => {
  it.each([
    ROLES.SUPER_ADMIN,
    ROLES.NOC_SUPERVISOR,
    ROLES.AGENTE_RJ,
    ROLES.AGENTE_PGH,
  ])("allows %s to view pending tickets", (role) => {
    expect(canViewPendingTickets(createUser(role))).toBe(true);
  });

  it("denies roles outside the NOC pending flow", () => {
    expect(canViewPendingTickets(createUser(ROLES.ANALISTA))).toBe(false);
  });
});
