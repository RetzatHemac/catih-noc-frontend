import { useParams, Navigate } from "react-router-dom";

import { mockTicketDetail } from "../../features/tickets/mocks/ticketDetail.mock";
import { TicketDetail } from "../../features/tickets/components/TicketDetail/TicketDetail";

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();

  // Por ahora usamos el mock, más adelante puedes hacer fetch del ticket
  // basado en el ticketId
  if (!ticketId) {
    return <Navigate to="/" replace />;
  }

  // Aquí puedes hacer fetch del ticket real basado en el ID
  // const ticket = fetchTicketById(ticketId);

  return <TicketDetail ticket={mockTicketDetail} />;
}
