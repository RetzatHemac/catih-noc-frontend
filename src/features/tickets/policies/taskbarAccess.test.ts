import { describe, expect, it } from "vitest";

import {
  PERMISSIONS,
  ROLES,
  type AuthUser,
  type PermissionOverrides,
  type Role,
} from "../../../auth";

import { canUseTaskbarAction, getVisibleTaskbarActions } from "./taskbarAccess";

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
  it("uses session permissions instead of the role to expose and authorize actions", () => {
    const user: AuthUser = {
      ...createUser(ROLES.SUPER_ADMIN),
      effectivePermissions: [PERMISSIONS.TICKET_REPORT_DOWNLOAD],
    };
    expect(
      getVisibleTaskbarActions(user, "EN_PROCESO").map((action) => action.id),
    ).toEqual(["download-reports"]);
    expect(canUseTaskbarAction(user, "close-ticket", "EN_PROCESO")).toBe(false);
    expect(canUseTaskbarAction(user, "download-reports", "CERRADO")).toBe(true);
    expect(canUseTaskbarAction(user, "download-reports", "ASIGNADO")).toBe(
      false,
    );
  });
  it("still restricts actions by state when the session grants the permission", () => {
    const user: AuthUser = {
      ...createUser(ROLES.VISOR),
      effectivePermissions: [PERMISSIONS.TICKET_PAUSE],
    };
    expect(canUseTaskbarAction(user, "pause-ticket", "EN_PROCESO")).toBe(true);
    expect(canUseTaskbarAction(user, "pause-ticket", "CERRADO")).toBe(false);
    expect(canUseTaskbarAction(user, "pause-ticket", "CREADO")).toBe(false);
  });
  it("shows every configured action to a super administrator in progress", () => {
    const actions = getVisibleTaskbarActions(
      createUser(ROLES.SUPER_ADMIN),
      "EN_PROCESO",
    );

    expect(actions).toHaveLength(13);
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
