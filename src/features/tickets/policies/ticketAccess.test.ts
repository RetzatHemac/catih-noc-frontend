import { describe, expect, it } from "vitest";

import {
  PERMISSIONS,
  ROLES,
  type AuthUser,
  type PermissionOverrides,
  type Role,
} from "../../../auth";

import { canStartTicket, getTicketDetailCapabilities } from "./ticketAccess";

function createUser(
  role: Role,
  permissionOverrides?: PermissionOverrides,
): AuthUser {
  return {
    id: `user-${role}`,
    name: "Usuario de prueba",
    email: "usuario@prueba.mx",
    role,
    permissionOverrides,
  };
}

describe("canStartTicket", () => {
  it("allows a user with start permission when the ticket is assigned", () => {
    const user = createUser(ROLES.NOC_SUPERVISOR);

    expect(canStartTicket(user, "ASIGNADO")).toBe(true);
  });

  it("denies a user without ticket start permission", () => {
    const user = createUser(ROLES.VISOR);

    expect(canStartTicket(user, "ASIGNADO")).toBe(false);
  });

  it("denies the action when the ticket is not assigned", () => {
    const user = createUser(ROLES.NOC_SUPERVISOR);

    expect(canStartTicket(user, "EN_PROCESO")).toBe(false);
  });

  it("honors a user-level permission denial", () => {
    const user = createUser(ROLES.NOC_SUPERVISOR, {
      deny: [PERMISSIONS.TICKET_START],
    });

    expect(canStartTicket(user, "ASIGNADO")).toBe(false);
  });

  it("honors a user-level permission grant", () => {
    const user = createUser(ROLES.VISOR, {
      grant: [PERMISSIONS.TICKET_START],
    });

    expect(canStartTicket(user, "ASIGNADO")).toBe(true);
  });
});

describe("getTicketDetailCapabilities", () => {
  it("exposes every TicketDetail capability to a super administrator", () => {
    const capabilities = getTicketDetailCapabilities(
      createUser(ROLES.SUPER_ADMIN),
      "ASIGNADO",
    );

    expect(Object.values(capabilities).every(Boolean)).toBe(true);
  });

  it("gives a viewer image access without mutation capabilities", () => {
    const capabilities = getTicketDetailCapabilities(
      createUser(ROLES.VISOR),
      "ASIGNADO",
    );

    expect(capabilities.canViewImages).toBe(true);
    expect(capabilities.canEditTicket).toBe(false);
    expect(capabilities.canDeleteObjects).toBe(false);
    expect(capabilities.canViewMaterials).toBe(false);
  });

  it("separates material viewing from material validation", () => {
    const leaderCapabilities = getTicketDetailCapabilities(
      createUser(ROLES.LIDER_OPERATIVO),
      "EN_PROCESO",
    );
    const supervisorCapabilities = getTicketDetailCapabilities(
      createUser(ROLES.SUPERVISOR),
      "EN_PROCESO",
    );

    expect(leaderCapabilities.canViewMaterials).toBe(true);
    expect(leaderCapabilities.canValidateMaterials).toBe(false);
    expect(supervisorCapabilities.canViewMaterials).toBe(true);
    expect(supervisorCapabilities.canValidateMaterials).toBe(true);
  });

  it("keeps site editing separate from changing its address", () => {
    const capabilities = getTicketDetailCapabilities(
      createUser(ROLES.ANALISTA),
      "EN_PROCESO",
    );

    expect(capabilities.canEditSite).toBe(true);
    expect(capabilities.canChangeSiteAddress).toBe(false);
  });
});
