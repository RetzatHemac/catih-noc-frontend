import { can, type AuthUser } from "../../../auth";

import {
  TASKBAR_ACTIONS,
  type TaskbarActionConfig,
  type TaskbarActionId,
} from "../config/taskbarActions";
import type { TicketStatus } from "../types/ticketDetail.types";

export function getVisibleTaskbarActions(
  user: AuthUser,
  ticketStatus: TicketStatus,
): TaskbarActionConfig[] {
  return TASKBAR_ACTIONS.filter((action) =>
    canUseAction(user, action, ticketStatus),
  );
}

export function canUseTaskbarAction(
  user: AuthUser,
  actionId: TaskbarActionId,
  ticketStatus: TicketStatus,
): boolean {
  const action = TASKBAR_ACTIONS.find((item) => item.id === actionId);
  return Boolean(action && canUseAction(user, action, ticketStatus));
}

function canUseAction(
  user: AuthUser,
  action: TaskbarActionConfig,
  status: TicketStatus,
): boolean {
  return (
    status !== "ASIGNADO" &&
    can(user, action.permission) &&
    (!action.allowedStatuses || action.allowedStatuses.includes(status)) &&
    !action.hiddenStatuses?.includes(status)
  );
}
