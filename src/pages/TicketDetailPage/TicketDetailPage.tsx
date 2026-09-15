import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../auth";
import { TicketDetail } from "../../features/tickets/components/TicketDetail/TicketDetail";
import { usePendingNotifications } from "../../features/tickets/context/usePendingNotifications";
import { useTicketWorkspace } from "../../features/tickets/context/useTicketWorkspace";
import { canViewPendingTickets } from "../../features/tickets/policies/pendingTicketsAccess";

export function TicketDetailPage() {
  const { ticket } = useTicketWorkspace();
  const { user } = useAuth();
  const { notifications, markAsRead } = usePendingNotifications();
  const ticketId = ticket?.id;
  const canReadPending = canViewPendingTickets(user);

  useEffect(() => {
    if (!ticketId || !canReadPending) return;

    notifications
      .filter(
        (notification) =>
          !notification.read && notification.ticketId === ticketId,
      )
      .forEach((notification) => markAsRead(notification.id));
  }, [ticketId, canReadPending, notifications, markAsRead]);

  if (!ticket) {
    return <Navigate to="/tickets" replace />;
  }

  return <TicketDetail />;
}
