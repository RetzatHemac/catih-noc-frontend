import { can, type AuthUser } from "../../../auth";
import type { TicketListToolAccess } from "../types/ticketListTools.types";
import { TICKET_LIST_TOOLS } from "../config/ticketListTools";

export function getVisibleTicketListTools(user: AuthUser) {
  return TICKET_LIST_TOOLS.filter((tool) =>
    canPreviewTicketListTool(user, tool),
  );
}

export function canPreviewTicketListTool(
  user: AuthUser,
  tool: TicketListToolAccess,
): boolean {
  if (tool.permission === null) {
    // Unconfirmed tools are mock-only previews, never capabilities granted by a role.
    return user.effectivePermissions === undefined;
  }
  return can(user, tool.permission);
}
