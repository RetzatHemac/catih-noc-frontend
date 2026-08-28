import type { TicketStatus } from "../types/tickets.types";

interface TicketStatusConfig {
  label: string;
  color: string;
  softColor: string;
}

export const TICKET_STATUS_CONFIG: Record<TicketStatus, TicketStatusConfig> = {
  created: {
    label: "Creado",
    color: "var(--status-created)",
    softColor: "var(--status-created-soft)",
  },

  assigned: {
    label: "Asignado",
    color: "var(--status-assigned)",
    softColor: "var(--status-assigned-soft)",
  },

  "in-progress": {
    label: "En proceso",
    color: "var(--status-in-progress)",
    softColor: "var(--status-in-progress-soft)",
  },

  paused: {
    label: "Pausado",
    color: "var(--status-paused)",
    softColor: "var(--status-paused-soft)",
  },

  closed: {
    label: "Cerrado",
    color: "var(--status-closed)",
    softColor: "var(--status-closed-soft)",
  },

  quotation: {
    label: "Cotización",
    color: "var(--status-quotation)",
    softColor: "var(--status-quotation-soft)",
  },

  resolved: {
    label: "Resuelto",
    color: "var(--status-resolved)",
    softColor: "var(--status-resolved-soft)",
  },
};
