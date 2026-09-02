import { Navigate } from "react-router-dom";

import { TicketDetail } from "../../features/tickets/components/TicketDetail/TicketDetail";
import { useTicketWorkspace } from "../../features/tickets/context/useTicketWorkspace";

export function TicketDetailPage() {
  const { ticket } = useTicketWorkspace();

  if (!ticket) {
    return <Navigate to="/tickets" replace />;
  }

  return <TicketDetail />;
}
