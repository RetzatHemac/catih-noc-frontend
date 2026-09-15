import type { TicketStatus } from "../types/tickets.types";

interface TicketStatusConfig {
  label: string;
  color: string;
  softColor: string;
  textColor: string;
}

export const TICKET_STATUS_CONFIG: Record<TicketStatus, TicketStatusConfig> = {
  created: {
    label: "Creado",
    color: "var(--status-created)",
    softColor: "var(--status-created-soft)",
    textColor: "var(--status-created-text)",
  },

  assigned: {
    label: "Asignado",
    color: "var(--status-assigned)",
    softColor: "var(--status-assigned-soft)",
    textColor: "var(--status-assigned-text)",
  },

  "in-progress": {
    label: "En proceso",
    color: "var(--status-in-progress)",
    softColor: "var(--status-in-progress-soft)",
    textColor: "var(--status-in-progress-text)",
  },

  paused: {
    label: "Pausado",
    color: "var(--status-paused)",
    softColor: "var(--status-paused-soft)",
    textColor: "var(--status-paused-text)",
  },

  closed: {
    label: "Cerrado",
    color: "var(--status-closed)",
    softColor: "var(--status-closed-soft)",
    textColor: "var(--status-closed-text)",
  },

  quotation: {
    label: "Cotización",
    color: "var(--status-quotation)",
    softColor: "var(--status-quotation-soft)",
    textColor: "var(--status-quotation-text)",
  },

  resolved: {
    label: "Resuelto",
    color: "var(--status-resolved)",
    softColor: "var(--status-resolved-soft)",
    textColor: "var(--status-resolved-text)",
  },
};
