import { describe, expect, it } from "vitest";
import { ROLES, PERMISSIONS, type AuthUser } from "../../../auth";
import {
  getVisibleTicketListTools,
  canPreviewTicketListTool,
} from "./ticketListToolsAccess";
import type { TicketListToolAccess } from "../types/ticketListTools.types";

const user: AuthUser = {
  id: "user",
  name: "Usuario",
  email: "user@test.mx",
  role: ROLES.SUPER_ADMIN,
};

describe("ticket list tool permissions awaiting agreement", () => {
  it("keeps planned previews in the mock without granting executable actions", () => {
    expect(getVisibleTicketListTools(user)).toHaveLength(4);
    expect(
      getVisibleTicketListTools(user).every(
        (tool) => tool.availability === "planned",
      ),
    ).toBe(true);
  });
  it("hides tools without an agreed permission when using effective session permissions", () => {
    expect(
      getVisibleTicketListTools({
        ...user,
        effectivePermissions: Object.values(PERMISSIONS),
      }),
    ).toEqual([]);
  });
  it("can apply an agreed permission without changing the component or assigning roles", () => {
    const tool: TicketListToolAccess = {
      id: "view-map",
      availability: "planned",
      permission: PERMISSIONS.TICKET_DASHBOARD_VIEW,
    };
    expect(
      canPreviewTicketListTool({ ...user, effectivePermissions: [] }, tool),
    ).toBe(false);
    expect(
      canPreviewTicketListTool(
        { ...user, effectivePermissions: [PERMISSIONS.TICKET_DASHBOARD_VIEW] },
        tool,
      ),
    ).toBe(true);
  });
});
