import type { Permission } from "../../../auth";
import type { Ticket, TicketFilters } from "./tickets.types";

export type TicketListToolId =
  "view-map" | "supervisor-report" | "filtered-report" | "assigned-report";

/** The same query and result IDs as the Sidebar, not the active ticket detail. */
export interface TicketListToolsContext {
  filters: Readonly<Omit<TicketFilters, "statuses">> & {
    readonly statuses: readonly TicketFilters["statuses"][number][];
  };
  ticketIds: readonly Ticket["id"][];
}

export interface TicketListToolAccess {
  id: TicketListToolId;
  availability: "planned";
  /** null means the permission has not been agreed; only a disabled mock preview. */
  permission: Permission | null;
}
