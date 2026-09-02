import { createContext } from "react";

import type { TicketDetail } from "../types/ticketDetail.types";

export interface TicketFeedback {
  message: string;
  tone: "success" | "info" | "error";
}

export interface TicketWorkspaceContextValue {
  ticket: TicketDetail | null;
  feedback: TicketFeedback | null;
  updateTicket: (updater: (current: TicketDetail) => TicketDetail) => void;
  setFeedback: (feedback: TicketFeedback | null) => void;
}

export const TicketWorkspaceContext =
  createContext<TicketWorkspaceContextValue | null>(null);
