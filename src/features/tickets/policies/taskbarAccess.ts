import { can, type AuthUser } from "../../../auth";

import {
  TASKBAR_ACTIONS,
  type TaskbarActionConfig,
} from "../config/taskbarActions";
import type { TicketStatus } from "../types/ticketDetail.types";

export function getVisibleTaskbarActions(
  user: AuthUser,
  ticketStatus: TicketStatus,
): TaskbarActionConfig[] {
  if (ticketStatus === "ASIGNADO") {
    return [];
  }

  return TASKBAR_ACTIONS.filter((action) => {
    const hasPermission = !action.permission || can(user, action.permission);
    const matchesAllowedStatus =
      !action.allowedStatuses || action.allowedStatuses.includes(ticketStatus);
    const isHiddenByStatus =
      action.hiddenStatuses?.includes(ticketStatus) ?? false;

    return hasPermission && matchesAllowedStatus && !isHiddenByStatus;
  });
}
