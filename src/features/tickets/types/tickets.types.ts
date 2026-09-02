export type TicketStatus =
  | "created"
  | "assigned"
  | "in-progress"
  | "paused"
  | "closed"
  | "quotation"
  | "resolved";

export type TicketProject = "3k" | "wifi-mundial";
export type TicketType = "incident" | "request";

export interface Ticket {
  id: string;
  helixId: string;
  site: string;
  category: string;
  attendedBy: string;
  supervisorId: string;
  assigneeId: string;
  projectId: TicketProject;
  type: TicketType;
  queue: Exclude<TicketQueue, "general">;
  status: TicketStatus;
  slaResponse: "ok" | "warning" | "danger";
  slaResolution: "ok" | "warning" | "danger";
}

export type TicketQueue = "general" | "3k" | "wifi-mundial";

export interface TicketFilters {
  query: string;
  statuses: TicketStatus[];
  supervisor: string;
  user: string;
  project: "" | TicketProject;
  type: "" | TicketType;
  queue: TicketQueue;
}
