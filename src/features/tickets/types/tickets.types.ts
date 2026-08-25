export type TicketStatus =
  | "created"
  | "assigned"
  | "in-progress"
  | "paused"
  | "closed"
  | "quotation"
  | "resolved";

export interface Ticket {
  id: string;
  helixId: string;
  site: string;
  category: string;
  attendedBy: string;
  status: TicketStatus;
  slaResponse: "ok" | "warning" | "danger";
  slaResolution: "ok" | "warning" | "danger";
}

export type TicketQueue = "general" | "3k" | "wifi-mundial";
