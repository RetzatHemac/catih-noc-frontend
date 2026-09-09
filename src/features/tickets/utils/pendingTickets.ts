import type { PendingTicketNotification } from "../types/pendingTicketNotification.types";
import type { Ticket } from "../types/tickets.types";

export interface PendingTicketItem {
  ticket: Ticket;
  notification: PendingTicketNotification;
}

export function getUnreadPendingTickets(
  tickets: Ticket[],
  notifications: PendingTicketNotification[],
): PendingTicketItem[] {
  return notifications.flatMap((notification) => {
    if (notification.read) return [];

    const ticket = tickets.find(
      (item) => item.id === notification.ticketId && item.status === "assigned",
    );

    return ticket ? [{ ticket, notification }] : [];
  });
}
