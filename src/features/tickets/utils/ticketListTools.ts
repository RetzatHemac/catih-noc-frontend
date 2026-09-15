import type { TicketListToolsContext } from "../types/ticketListTools.types";
import type { Ticket, TicketFilters } from "../types/tickets.types";

export function createTicketListToolsContext(
  filters: TicketFilters,
  tickets: readonly Ticket[],
): TicketListToolsContext {
  return {
    filters: { ...filters, statuses: [...filters.statuses] },
    ticketIds: tickets.map(({ id }) => id),
  };
}
