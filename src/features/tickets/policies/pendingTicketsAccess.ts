import { can, PERMISSIONS, type AuthUser } from "../../../auth";

export function canViewPendingTickets(user: AuthUser): boolean {
  return can(user, PERMISSIONS.TICKET_PENDING_VIEW);
}
