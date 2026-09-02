import { describe, expect, it } from "vitest";

import {
  PERMISSIONS,
  ROLES,
  type AuthUser,
  type PermissionOverrides,
  type Role,
} from "../../../auth";

import { getVisibleTaskbarActions } from "./taskbarAccess";

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

describe("getVisibleTaskbarActions", () => {
  it("shows every configured action to a super administrator in progress", () => {
    const actions = getVisibleTaskbarActions(
      createUser(ROLES.SUPER_ADMIN),
      "EN_PROCESO",
    );

    expect(actions).toHaveLength(12);
  });

  it("hides the complete taskbar while a ticket is assigned", () => {
    const actions = getVisibleTaskbarActions(
      createUser(ROLES.SUPER_ADMIN),
      "ASIGNADO",
    );

    expect(actions).toEqual([]);
  });

  it("applies role permissions to individual actions", () => {
    const actions = getVisibleTaskbarActions(
      createUser(ROLES.ANALISTA),
      "EN_PROCESO",
    );

    expect(actions.map((action) => action.id)).toEqual([
      "open-chat",
      "manage-notes",
      "upload-images",
      "report-activity",
      "download-reports",
    ]);
  });

  it("honors user-level permission denials", () => {
    const actions = getVisibleTaskbarActions(
      createUser(ROLES.SUPER_ADMIN, {
        deny: [PERMISSIONS.TICKET_PAUSE],
      }),
      "EN_PROCESO",
    );

    expect(actions.some((action) => action.id === "pause-ticket")).toBe(false);
  });
});
