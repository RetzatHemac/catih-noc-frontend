import type {
  TicketDetail,
  TicketStatus as TicketDetailStatus,
} from "../types/ticketDetail.types";
import type {
  Ticket,
  TicketStatus as TicketListStatus,
} from "../types/tickets.types";

const DETAIL_STATUS_BY_LIST_STATUS: Record<
  TicketListStatus,
  TicketDetailStatus
> = {
  created: "CREADO",
  assigned: "ASIGNADO",
  "in-progress": "EN_PROCESO",
  paused: "PAUSADO",
  closed: "CERRADO",
  quotation: "COTIZACION",
  resolved: "RESUELTO",
};

const LIST_STATUS_BY_DETAIL_STATUS: Record<
  TicketDetailStatus,
  TicketListStatus
> = {
  CREADO: "created",
  ASIGNADO: "assigned",
  EN_PROCESO: "in-progress",
  PAUSADO: "paused",
  CERRADO: "closed",
  COTIZACION: "quotation",
  RESUELTO: "resolved",
};

export type TicketStatusOverrides = Partial<
  Record<Ticket["id"], TicketDetail["status"]>
>;

export function toTicketDetailStatus(
  status: TicketListStatus,
): TicketDetailStatus {
  return DETAIL_STATUS_BY_LIST_STATUS[status];
}

export function toTicketListStatus(
  status: TicketDetailStatus,
): TicketListStatus {
  return LIST_STATUS_BY_DETAIL_STATUS[status];
}

export function applyTicketStatusOverrides(
  tickets: Ticket[],
  overrides: TicketStatusOverrides,
): Ticket[] {
  return tickets.map((ticket) => {
    const status = overrides[ticket.id];

    return status ? { ...ticket, status: toTicketListStatus(status) } : ticket;
  });
}
