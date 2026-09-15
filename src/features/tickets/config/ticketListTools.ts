import { FileText, Map, type LucideIcon } from "lucide-react";
import type { TicketListToolAccess } from "../types/ticketListTools.types";

interface TicketListToolConfig extends TicketListToolAccess {
  label: string;
  icon: LucideIcon;
}

export const TICKET_LIST_TOOLS: readonly TicketListToolConfig[] = [
  {
    id: "view-map",
    label: "Ver mapa",
    icon: Map,
    availability: "planned",
    permission: null,
  },
  {
    id: "supervisor-report",
    label: "Reporte supervisor",
    icon: FileText,
    availability: "planned",
    permission: null,
  },
  {
    id: "filtered-report",
    label: "Reporte filtrado",
    icon: FileText,
    availability: "planned",
    permission: null,
  },
  {
    id: "assigned-report",
    label: "Reporte asignado",
    icon: FileText,
    availability: "planned",
    permission: null,
  },
];
